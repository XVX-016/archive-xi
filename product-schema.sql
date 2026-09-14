-- ARCCHIVE XI — Products table
-- Run this FIRST, before supabase-schema.sql (which references this
-- table via foreign key in order_items).

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- URL-friendly, e.g. "washed-utility-jacket"
  name text not null,
  description text,
  category text,                        -- e.g. 'jackets', 'footwear', 'accessories'
  price integer not null check (price >= 0),   -- ALWAYS paise (rupees * 100), never a decimal
  qty_available integer not null default 0 check (qty_available >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'active', 'sold_out')),
  sku text unique,
  images text[] default '{}',           -- array of Cloudinary URLs, first = primary
  source_region text,                   -- e.g. 'Japan', 'USA', 'China' — informational for now
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- keep updated_at current on edits
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

alter table products enable row level security;

-- Public (anyone, logged in or not) can read active products only.
-- Draft/sold_out-but-hidden logic: sold_out still shows (so the PDP
-- can say "sold out"), draft does not.
create policy "products_public_read_active" on products
  for select using (status in ('active', 'sold_out'));

-- No public insert/update/delete policy — this is deliberate.
-- Product management happens via the Supabase dashboard table editor,
-- a CSV import, or later an authenticated admin-only route. Never
-- open write access to the products table from the storefront client.

-- Helpful index for the shop page filtering by category/status
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category on products(category);