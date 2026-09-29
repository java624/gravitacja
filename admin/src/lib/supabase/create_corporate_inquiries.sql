-- Migration script for public.corporate_inquiries table in Supabase
-- Służy do zbierania zapytań z formularza "Dla Firm" (strona /katowice/firmy).
create table if not exists public.corporate_inquiries (
  id uuid default gen_random_uuid() primary key,
  location_slug text not null default 'katowice',
  company_name text not null,
  email text not null,
  phone text not null,
  event_date date,
  guests_count integer,
  preferences text[],
  message text,
  status text not null default 'new', -- 'new', 'contacted', 'closed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.corporate_inquiries enable row level security;

-- Allow anonymous visitors to submit corporate inquiries
create policy "Allow public insert to corporate_inquiries"
  on public.corporate_inquiries for insert
  with check (true);

-- Allow authenticated users (admin panel) full read / status updates
create policy "Allow full access for authenticated users to corporate_inquiries"
  on public.corporate_inquiries for all
  to authenticated
  using (true)
  with check (true);