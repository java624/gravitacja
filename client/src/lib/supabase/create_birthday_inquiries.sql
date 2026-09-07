-- Migration script for public.birthday_inquiries table in Supabase
-- Służy do zbierania zapytań z formularza "Urodziny dla dzieci" (strona /katowice/dzieci).
create table if not exists public.birthday_inquiries (
  id uuid default gen_random_uuid() primary key,
  location_slug text not null default 'katowice',
  parent_name text not null,
  email text not null,
  phone text not null,
  child_name text,
  child_age integer,
  event_date date,
  event_time text,
  package_type text, -- 'slonce' | 'gravitacja'
  guests_count integer,
  extras text[],
  notes text,
  status text not null default 'new', -- 'new', 'contacted', 'confirmed', 'closed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.birthday_inquiries enable row level security;

-- Allow anonymous visitors to submit birthday inquiries
create policy "Allow public insert to birthday_inquiries"
  on public.birthday_inquiries for insert
  with check (true);

-- Allow authenticated users (admin panel) full read / status updates
create policy "Allow full access for authenticated users to birthday_inquiries"
  on public.birthday_inquiries for all
  to authenticated
  using (true)
  with check (true);