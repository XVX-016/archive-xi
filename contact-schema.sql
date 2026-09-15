-- ARCCHIVE XI — contact form messages
-- Run in Supabase SQL editor after schema.sql.
-- Anonymous users can submit via the site form; only service role / dashboard can read.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 1),
  email text not null check (char_length(trim(email)) >= 3),
  message text not null check (char_length(trim(message)) >= 1),
  submitted_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Allow anyone (anon or authenticated) to insert; no read/update/delete for client roles.
create policy "contact_messages_insert_public" on contact_messages
  for insert
  with check (true);

create index if not exists contact_messages_submitted_at_idx
  on contact_messages (submitted_at desc);
