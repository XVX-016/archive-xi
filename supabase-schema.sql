-- ARCCHIVE XI — Supabase schema: auth, addresses, orders, checkout
-- Run in Supabase SQL editor. Assumes a `products` table already
-- exists with at least: id uuid, slug text, name text, price integer
-- (in paise, i.e. rupees * 100 — always store money as integers),
-- qty_available integer, status text ('active' | 'sold_out' | 'draft').
-- If your products table differs, adjust the RPC below to match.

-- ============ PROFILES ============
-- One row per authenticated user, auto-created on signup via trigger.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- auto-create profile row when a user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============ ADDRESSES ============
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table addresses enable row level security;

create policy "addresses_crud_own" on addresses
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============ ORDERS ============
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null, -- nullable: guest checkout
  guest_email text, -- required if user_id is null
  status text not null default 'pending_payment',
    -- pending_payment | paid | fulfilled | cancelled | payment_failed
  subtotal integer not null,   -- paise
  shipping_fee integer not null default 0,
  total integer not null,      -- paise
  shipping_address jsonb not null, -- snapshot at time of order, not a live FK
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "orders_select_own" on orders
  for select using (auth.uid() = user_id);

-- NOTE: deliberately no insert/update policy for regular users.
-- Orders are only ever created/modified via the create_order() and
-- confirm_payment() functions below (security definer), so price and
-- stock can never be set directly by a client. This is the whole
-- point — do not add a permissive insert policy here later without
-- thinking hard about it.

-- ============ ORDER ITEMS ============
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  name_snapshot text not null,
  price_snapshot integer not null, -- paise, price at time of purchase
  quantity integer not null check (quantity > 0)
);

alter table order_items enable row level security;

create policy "order_items_select_via_order" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- ============ CREATE ORDER (atomic, server-trusted pricing) ============
-- Call this via Supabase RPC from your server route (not directly from
-- the browser with a service key) after the client sends up a cart:
-- [{ product_id, quantity }, ...] and a shipping_address jsonb blob.
--
-- This function is the ONLY way orders get created. It:
--  1. Locks each product row (FOR UPDATE) to prevent race conditions
--     when two people buy the last unit at the same moment.
--  2. Reads price and stock from the products table itself — never
--     trusts a price the client sends.
--  3. Rejects the whole order if any item is out of stock.
--  4. Decrements stock and inserts the order + order_items in one
--     transaction, so you never end up with an order that doesn't
--     match a stock decrement.

create or replace function create_order(
  p_items jsonb,           -- [{ "product_id": "...", "quantity": 2 }, ...]
  p_shipping_address jsonb,
  p_guest_email text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_subtotal integer := 0;
  v_item jsonb;
  v_product record;
  v_qty integer;
begin
  if auth.uid() is null and p_guest_email is null then
    raise exception 'guest_email required for guest checkout';
  end if;

  -- create the order shell first (subtotal/total filled in after loop)
  insert into orders (user_id, guest_email, status, subtotal, total, shipping_address)
  values (auth.uid(), p_guest_email, 'pending_payment', 0, 0, p_shipping_address)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;

    -- lock the product row so concurrent checkouts can't both pass
    -- the stock check for the last unit
    select id, name, price, qty_available into v_product
    from products
    where id = (v_item->>'product_id')::uuid
    and status = 'active'
    for update;

    if not found then
      raise exception 'Product % not found or inactive', v_item->>'product_id';
    end if;

    if v_product.qty_available < v_qty then
      raise exception 'Insufficient stock for %: have %, requested %',
        v_product.name, v_product.qty_available, v_qty;
    end if;

    update products
    set qty_available = qty_available - v_qty,
        status = case when qty_available - v_qty <= 0 then 'sold_out' else status end
    where id = v_product.id;

    insert into order_items (order_id, product_id, name_snapshot, price_snapshot, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.price, v_qty);

    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  update orders
  set subtotal = v_subtotal,
      total = v_subtotal -- add shipping_fee logic here once you have rules
  where id = v_order_id;

  return v_order_id;
end;
$$;

-- ============ CONFIRM PAYMENT ============
-- Called from your server (NOT the browser) after verifying the
-- Razorpay webhook signature — see checkout notes below. Marks the
-- order paid. Keep this separate from create_order so an abandoned
-- (unpaid) order never looks fulfilled.

create or replace function confirm_payment(
  p_order_id uuid,
  p_razorpay_order_id text,
  p_razorpay_payment_id text
)
returns void
language plpgsql
security definer
as $$
begin
  update orders
  set status = 'paid',
      razorpay_order_id = p_razorpay_order_id,
      razorpay_payment_id = p_razorpay_payment_id
  where id = p_order_id;
end;
$$;

-- ============ RELEASE STOCK ON PAYMENT FAILURE/EXPIRY ============
-- Call this if a Razorpay payment fails or an order sits unpaid past
-- your abandon window (e.g. a scheduled job checking for
-- pending_payment orders older than 30 minutes), so stock isn't
-- permanently locked by abandoned checkouts.

create or replace function release_order_stock(p_order_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update products p
  set qty_available = p.qty_available + oi.quantity,
      status = 'active'
  from order_items oi
  where oi.order_id = p_order_id and oi.product_id = p.id;

  update orders set status = 'cancelled' where id = p_order_id;
end;
$$;
