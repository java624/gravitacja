-- Migration script for public.menu_items table in Supabase
create table if not exists public.menu_items (
  id uuid default gen_random_uuid() primary key,
  location_slug text not null default 'katowice',
  category text not null, -- 'snacki', 'przekaski', 'pizza', 'napoje_zimne', 'napoje_gorace', 'piwo', 'alkohole', 'cocktails', 'shots', 'zestawy'
  title text not null,
  description text,
  price numeric(10, 2) not null,
  price_maxi numeric(10, 2), -- dla pizzy Maxi lub wież piwnych 5L
  volume text, -- e.g. '40ml', '0.5l', '160g', '32cm'
  is_available boolean default true,
  is_bestseller boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.menu_items enable row level security;

-- Public read access for menu items
create policy "Allow public read access to menu_items"
  on public.menu_items for select
  using (true);

-- Allow authenticated users / service role full access
create policy "Allow full access for authenticated users to menu_items"
  on public.menu_items for all
  using (true)
  with check (true);
