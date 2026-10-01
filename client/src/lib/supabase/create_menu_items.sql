-- ============================================================================
--  TABELA menu_items + zdjęcia w Supabase Storage
-- ============================================================================
--  Uruchom w Supabase SQL Editor PRZED wdrożeniem panelu admina.
--  Skrypt jest idempotentny (można go odpalić wielokrotnie).
--
--  POWOD HTTP 400 PRZY ZAPISIE MENU (naprawia ten skrypt):
--  PostgREST zwraca 400 z błędem PGRST204 ("Could not find the '<kolumna>'
--  column of 'menu_items' in the schema cache"), gdy kod wysyła klucza, którego
--  nie ma w tabeli. Panel admina wysyła: title, description, price, price_maxi,
--  volume, portion, category, image_url, location_slug, location, is_available,
--  is_bestseller, sort_order. Poniżej masz komplet tych kolumn.
--
--  UWAGA O NAZWACH:
--  Nazwa potrawy trzymana jest w kolumnie `title` (tak było od początku i tak
--  używa jej cały kod: MenuItem.title, AdminMenuManager, MenuSection,
--  MenuItemArt). Nie zmieniamy tego na `name` - wymagałoby to jednoczesnej
--  zmiany kontraktu we wszystkich warstwach obu aplikacji.
-- ============================================================================

-- 1) Tabela menu_items ---------------------------------------------------------------
create table if not exists public.menu_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  price_maxi numeric(10, 2),          -- dla pizzy Maxi lub wież piwnych 5L
  volume text,                        -- np. '40ml', '0.5l', '160g', '32cm'
  portion text,                       -- synonim volume używany przez formularz
  category text not null,             -- 'snacki', 'przekaski', 'pizza', 'napoje_zimne', ...
  image_url text,                     -- publiczny URL zdjęcia z bucketa menu-images
  location_slug text not null default 'katowice',
  location text not null default 'katowice',
  is_available boolean not null default true,
  is_bestseller boolean not null default false,
  sort_order integer not null default 0,   -- kolejność w menu (drag & drop)
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- 2) Dogrywka kolumn dla tabel, które powstały w starszej wersji -------------------
--    Każda z tych kolumn MUSI istnieć, bo panel wysyła je przy insert/update,
--    a brak którejkolwiek kończy się HTTP 400 PGRST204.
alter table public.menu_items add column if not exists image_url text;
alter table public.menu_items add column if not exists volume text;
alter table public.menu_items add column if not exists portion text;
alter table public.menu_items add column if not exists location_slug text not null default 'katowice';
alter table public.menu_items add column if not exists location text not null default 'katowice';
alter table public.menu_items add column if not exists sort_order integer not null default 0;
alter table public.menu_items add column if not exists price_maxi numeric(10, 2);
alter table public.menu_items add column if not exists is_bestseller boolean not null default false;
alter table public.menu_items add column if not exists is_available boolean not null default true;

comment on column public.menu_items.image_url is
  'Publiczny URL zdjęcia w Supabase Storage (bucket menu-images) albo null.';
comment on column public.menu_items.sort_order is
  'Kolejność pozycji w menu. Ustawiane przeciąganiem myszką w panelu admina.';

-- 3) Backfill sort_order dla istniejących pozycji -----------------------------------
--    Nowa kolonka dostaje 0 u wszystkich, więc bez tego klient pokazałby menu
--    w losowej kolejności. Nadajemy numerację wg daty powstania, żeby istniejące
--    menu zachowało dotychczasową kolejność.
with ranked as (
  select id,
         row_number() over (partition by location_slug order by created_at asc) as computed_order
  from public.menu_items
  where sort_order = 0
)
update public.menu_items m
set sort_order = r.computed_order
from ranked r
where m.id = r.id;

-- Enable RLS (Row Level Security)
alter table public.menu_items enable row level security;

-- Public read access for menu items
drop policy if exists "Allow public read access to menu_items" on public.menu_items;
create policy "Allow public read access to menu_items"
  on public.menu_items for select
  using (true);

-- Allow authenticated users / service role full access
drop policy if exists "Allow full access for authenticated users to menu_items" on public.menu_items;
create policy "Allow full access for authenticated users to menu_items"
  on public.menu_items for all
  using (true)
  with check (true);

-- 2) Migracja kolumny image_url (dla baz, które już mają tabelę) -------------------
alter table public.menu_items
  add column if not exists image_url text;

comment on column public.menu_items.image_url is
  'Publiczny URL zdjęcia w Supabase Storage (bucket menu-images) albo null.';

-- 3) Bucket publiczny --------------------------------------------------------------
--    `public = true` daje link w stylu
--    https://<project>.supabase.co/storage/v1/object/public/menu-images/<plik>
--    który klient może wyrenderować bez żadnego tokena.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 4) Polityki RLS dla obiektów w bucketcie ----------------------------------------
--    Panel admina i strona klienta używają tego samego anon key, więc polityki
--    muszą dopuszczać zapis - tak jak robi to istniejąca polityka dla menu_items.

drop policy if exists "Allow public read on menu-images" on storage.objects;
create policy "Allow public read on menu-images"
  on storage.objects for select
  using (bucket_id = 'menu-images');

drop policy if exists "Allow upload to menu-images" on storage.objects;
create policy "Allow upload to menu-images"
  on storage.objects for insert
  with check (bucket_id = 'menu-images');

drop policy if exists "Allow update on menu-images" on storage.objects;
create policy "Allow update on menu-images"
  on storage.objects for update
  using (bucket_id = 'menu-images')
  with check (bucket_id = 'menu-images');

drop policy if exists "Allow delete from menu-images" on storage.objects;
create policy "Allow delete from menu-images"
  on storage.objects for delete
  using (bucket_id = 'menu-images');

-- 5) UWAGA OPERACYJNA: seed menu -----------------------------------------------
--    Ten skrypt NIE wypełnia menu_items - pozycje zakłada właściciel w panelu
--    (zakładka "Menu" -> "Dodaj Pozycję"). To jest celowe.
--
--    `fetchMenuItems` traktuje PUSTY wynik z bazy jako "menu jest świadomie
--    puste", a nie jako błąd sieci - dzięki temu usunięcie ostatniej pozycji
--    naprawdę czyści menu klienta, zamiast podsyłać dane demonstracyjne.
--
--    UWAGA: jeśli Supabase jest skonfigurowany, a tabela jest jeszcze pusta
--    (świeży projekt), klient zobaczy puste menu zamiast danych demo. Wtedy
--    dodaj pozycje w panelu admina albo wykonaj jednorazowo:
--
--      insert into public.menu_items
--        (location_slug, category, title, description, price, is_available, is_bestseller)
--      values
--        ('katowice', 'pizza', 'Pizza Margherita', 'Pomidor, mozzarella, bazylia', 32.00, true, true),
--        ('katowice', 'napoje_zimne', 'Coca-Cola 0,5l', null, 12.00, true, false);
