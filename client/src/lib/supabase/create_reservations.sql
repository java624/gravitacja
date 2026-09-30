-- Migration script for public.resources + public.reservations tables in Supabase
-- (system rezerwacji torow / stalow).
--
-- Uruchom w Supabase Dashboard -> SQL Editor. Skrypt jest IDEMPOTENTNY
-- (create ... if not exists / add column if not exists / drop policy if exists),
-- wiec mozna go wykonywac wielokrotnie na tej samej bazie.
--
-- Dlaczego to istnieje: jesli w projekcie Supabase brakuje tabel "reservations"
-- albo rol "anon" nie ma polityk RLS, to zapis rezerwacji konczyl sie bledem, a
-- frontend (przed ta zmiana) cicho zapisywal rezerwacje do localStorage. Klient
-- widzial "rezerwacja przyjeta", recepcja w panelu admina nie widziala nic.

-- ---------------------------------------------------------------------------
-- 1) Zasoby: tory bowlingowe / stoly bilardowe
--    id jako text, bo UI uzywa stabilnych identyfikatorow typu 'kat-b1'
--    (takie same jak INITIAL_MOCK_RESOURCES w mockStore.ts).
-- ---------------------------------------------------------------------------
create table if not exists public.resources (
  id text primary key,
  name text not null,
  type text not null default 'bowling',            -- 'bowling' | 'billiards' | 'dart' | 'karaoke'
  location_slug text not null default 'katowice',  -- 'katowice' | 'jaworzno' | 'poznan'
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dosypuje kolumny, ktorych moze nie dawna tabela (setup sprzed wersji 2026.09).
alter table public.resources add column if not exists location_slug text not null default 'katowice';
alter table public.resources add column if not exists is_active boolean not null default true;

-- ---------------------------------------------------------------------------
-- 2) Rezerwacje
--    start_time / end_time jako text 'HH:mm' - tak wysyla je formularz i tak
--    liczone sa kolizje w reservationsService.checkTimeCollision.
-- ---------------------------------------------------------------------------
create table if not exists public.reservations (
  id uuid default gen_random_uuid() primary key,
  resource_id text not null,
  location_slug text not null default 'katowice',
  client_name text not null,
  client_phone text not null,
  client_email text not null default '',
  reservation_date date not null,                  -- YYYY-MM-DD
  start_time text not null,                        -- HH:mm
  end_time text not null,                          -- HH:mm
  guests_count integer not null default 1,
  status text not null default 'pending',          -- 'pending' | 'confirmed' | 'cancelled'
  total_price numeric(10, 2),
  payment_method text,                             -- 'blik' | 'card' | 'payu' | 'reception'
  payment_status text default 'pending',           -- 'pending' | 'paid' | 'failed'
  include_shoes boolean default false,
  shoes_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dosypuje kolumny wymagane przez obecny formularz / dashboardy.
alter table public.reservations add column if not exists location_slug text not null default 'katowice';
alter table public.reservations add column if not exists client_email text not null default '';
alter table public.reservations add column if not exists total_price numeric(10, 2);
alter table public.reservations add column if not exists payment_method text;
alter table public.reservations add column if not exists payment_status text default 'pending';
alter table public.reservations add column if not exists include_shoes boolean default false;
alter table public.reservations add column if not exists shoes_count integer default 0;

-- ---------------------------------------------------------------------------
-- 3) Klucz obcy reservations.resource_id -> resources.id
--    Pilnuje, by rezerwacja wskazywala na istniejacy tor/stol (bez niego
--    bledna rezerwacja trafilaby do bazy i recepcja widziala "pusta nazwa").
--    Calosc w DO block: jesli istniejaca tabela ma inny typ kolumn (np. uuid),
--    skrypt nie przerywa dzialania, tylko wysyla ostrzezenie.
-- ---------------------------------------------------------------------------
do $$
begin
  alter table public.reservations
    add constraint reservations_resource_id_fkey
    foreign key (resource_id) references public.resources(id)
    on delete restrict;
exception
  when duplicate_object then
    raise notice 'Klucz obcy reservations_resource_id_fkey juz istnieje - pomijam.';
  when others then
    raise notice 'Nie udalo sie dodac klucza obcego reservations.resource_id -> resources.id: %', sqlerrm;
end $$;

-- ---------------------------------------------------------------------------
-- 4) Indeksy pod zapytania recepcji i pod sprawdzanie zajetosci terminu
-- ---------------------------------------------------------------------------
create index if not exists reservations_resource_date_idx
  on public.reservations (resource_id, reservation_date);
create index if not exists reservations_location_date_idx
  on public.reservations (location_slug, reservation_date);

-- ---------------------------------------------------------------------------
-- 5) RLS - bez tych polityk rola "anon" (publiczny klucz anon w .env) nie moze
--    ani zapisac, ani odczytac rezerwacji: zapis konczy sie SQLSTATE 42501.
--    Rezerwacje tworza takze zalogowani userowie panelu, wiec obie role.
-- ---------------------------------------------------------------------------
alter table public.reservations enable row level security;
alter table public.resources enable row level security;

drop policy if exists "Allow public read access to reservations" on public.reservations;
create policy "Allow public read access to reservations"
  on public.reservations for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public insert to reservations" on public.reservations;
create policy "Allow public insert to reservations"
  on public.reservations for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public update to reservations" on public.reservations;
create policy "Allow public update to reservations"
  on public.reservations for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow public delete to reservations" on public.reservations;
create policy "Allow public delete to reservations"
  on public.reservations for delete
  to anon, authenticated
  using (true);

drop policy if exists "Allow public read access to resources" on public.resources;
create policy "Allow public read access to resources"
  on public.resources for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 6) Seed zasobow - dzieki temu klient moze zarezerwowac od razu po odpaleniu,
--    a INSERT nie wywala 23503 (brak resource_id w tabeli resources).
--    'on conflict do nothing' nie nadpisuje nazw zmienionych przez obsluge.
-- ---------------------------------------------------------------------------
insert into public.resources (id, name, type, location_slug, is_active) values
  ('kat-b1',  'Tor 1',                'bowling',   'katowice', true),
  ('kat-b2',  'Tor 2',                'bowling',   'katowice', true),
  ('kat-b3',  'Tor 3',                'bowling',   'katowice', true),
  ('kat-b4',  'Tor 4',                'bowling',   'katowice', true),
  ('kat-b5',  'Tor 5',                'bowling',   'katowice', true),
  ('kat-b6',  'Tor 6',                'bowling',   'katowice', true),
  ('kat-b7',  'Tor 7',                'bowling',   'katowice', true),
  ('kat-b8',  'Tor 8',                'bowling',   'katowice', true),
  ('kat-b9',  'Tor 9',                'bowling',   'katowice', true),
  ('kat-b10', 'Tor 10',               'bowling',   'katowice', true),
  ('kat-b11', 'Tor 11',               'bowling',   'katowice', true),
  ('kat-b12', 'Tor 12',               'bowling',   'katowice', true),
  ('kat-p1',  'Stol Bilardowy #1',    'billiards', 'katowice', true),
  ('kat-p2',  'Stol Bilardowy #2',    'billiards', 'katowice', true),
  ('kat-p3',  'Stol Bilardowy #3',    'billiards', 'katowice', true),
  ('kat-p4',  'Stol Bilardowy #4',    'billiards', 'katowice', true),
  ('jaw-b1',  'Tor 1 Cosmic',         'bowling',   'jaworzno', true),
  ('jaw-b2',  'Tor 2 Cosmic',         'bowling',   'jaworzno', true),
  ('jaw-p1',  'Stol Bilardowy #1',    'billiards', 'jaworzno', true),
  ('pozn-b1', 'Tor 1 Arcade',         'bowling',   'poznan',   true),
  ('pozn-b2', 'Tor 2 Arcade',         'bowling',   'poznan',   true),
  ('pozn-p1', 'Stol Bilardowy #1',    'billiards', 'poznan',   true)
on conflict (id) do nothing;

-- Szybka kontrola po wgraniu (uruchom osobno, zeby sie upewnic):
--   select count(*) as resources from public.resources;
--   select count(*) as reservations from public.reservations;

