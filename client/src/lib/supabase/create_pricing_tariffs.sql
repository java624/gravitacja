-- ============================================================================
--  TABELA pricing_tariffs - JEDYNE ZRÓDŁO PRAWDY O CENACH W CAŁEJ APLIKACJI
-- ============================================================================
--  Uruchom w Supabase SQL Editor PRZED wdrożeniem zmian w cenniku.
--  Skrypt jest idempotentny (można go odpalić wielokrotnie).
--
--  DLACZEGO TO ISTNIEJE:
--  Ceny kręgli / bilarda / darta / karaoke oraz cena wypożyczenia obuwia
--  były wcześniej zaszyte w kodzie (client/src/data/pricingData.ts) albo
--  w localStorage panelu admina. Efekt: właściciel zmieniał cenę w panelu,
--  a publiczny cennik i kalkulator rezerwacji pokazywały dalej stare stawki.
--  Teraz JEDYNYM ŹRÓDŁEM jest ta tabela - frontend (client + admin) czyta
--  ją przez pricingService, a panel "Ceny i Taryfy" zapisuje przez UPSERT.
--
--  STRUKTURA:
--    location_slug   - 'katowice' | 'jaworzno' | 'poznan'
--    resource_type   - 'bowling' | 'billiards' | 'dart' | 'karaoke'
--    day_group       - identyfikator grupy dni (patrz DAY_GROUP_PRIORITY w kodzie):
--                      'mon-thu' (PN-CZ), 'fri' (PT), 'sat-holidays' (SO/ŚW),
--                      'sun' (ND), 'weekend' (SO-ND-ŚW), 'fri-sun' (PT-ND),
--                      'all-week' (PN-ND). Jedna stawka na grupę dni.
--    price_before_17 - PLN za 1 godz. przed godziną 17:00
--    price_after_17  - PLN za 1 godz. po godzinie 17:00
--    shoes_price     - PLN za jedną parę obuwia (powtarzane we wszystkich
--                      wierszach danego miasta + usługi, bo zależy tylko
--                      od lokalizacji i rodzaju rozrywki).
--
--  KLUCZ UNIKALNY (location_slug, resource_type, day_group) jest tym samym
--  kluczem, którego używa upsert w pricingService.upsertPricingTariffs -
--  "ZAPISZ WSZYSTKIE ZMIANY" w panelu działa jako INSERT ... ON CONFLICT DO
--  UPDATE, więc nie wymaga wcześniejszego tworzenia wiersza ręcznie.
-- ============================================================================

-- 1) Tabela ------------------------------------------------------------------------
create table if not exists public.pricing_tariffs (
  id uuid default gen_random_uuid() primary key,
  location_slug text not null,
  location_name text not null default 'Katowice',
  resource_type text not null default 'bowling',
  title text not null default '',
  subtitle text not null default '',
  unit_text text not null default '',
  extra_note text not null default '',
  page_title text,
  day_group text not null,
  day_label text not null default '',
  day_short text not null default '',
  price_before_17 numeric(10, 2) not null default 0,
  price_after_17 numeric(10, 2) not null default 0,
  shoes_price numeric(10, 2) not null default 0,
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);
-- 2) Dogrywka kolumn dla baz, na których tabela powstała w starszej wersji ---------
alter table public.pricing_tariffs add column if not exists location_name text not null default 'Katowice';
alter table public.pricing_tariffs add column if not exists title text not null default '';
alter table public.pricing_tariffs add column if not exists subtitle text not null default '';
alter table public.pricing_tariffs add column if not exists unit_text text not null default '';
alter table public.pricing_tariffs add column if not exists extra_note text not null default '';
alter table public.pricing_tariffs add column if not exists page_title text;
alter table public.pricing_tariffs add column if not exists day_group text not null default 'all-week';
alter table public.pricing_tariffs add column if not exists day_label text not null default '';
alter table public.pricing_tariffs add column if not exists day_short text not null default '';
alter table public.pricing_tariffs add column if not exists price_before_17 numeric(10, 2) not null default 0;
alter table public.pricing_tariffs add column if not exists price_after_17 numeric(10, 2) not null default 0;
alter table public.pricing_tariffs add column if not exists shoes_price numeric(10, 2) not null default 0;
alter table public.pricing_tariffs add column if not exists is_popular boolean not null default false;
alter table public.pricing_tariffs add column if not exists sort_order integer not null default 0;
alter table public.pricing_tariffs add column if not exists is_active boolean not null default true;
alter table public.pricing_tariffs add column if not exists updated_at timestamp with time zone not null default timezone('utc'::text, now());

comment on table public.pricing_tariffs is
  'Jedyne źródło prawdy o cenniku. Frontend (client + admin) czyta przez pricingService, panel "Ceny i Taryfy" zapisuje przez upsert.';
comment on column public.pricing_tariffs.price_before_17 is
  'Stawka PLN za 1 godz. gry przed godziną 17:00.';
comment on column public.pricing_tariffs.price_after_17 is
  'Stawka PLN za 1 godz. gry po godzinie 17:00.';
comment on column public.pricing_tariffs.shoes_price is
  'Cena wypożyczenia obuwia za jedną parę. Powtarzana we wszystkich wierszach danego (location_slug, resource_type).';

-- 3) Klucz unikalny = klucz UPSERT w panelu admina --------------------------------
create unique index if not exists pricing_tariffs_slot_unique
  on public.pricing_tariffs (location_slug, resource_type, day_group);

-- 4) updated_at automatycznie przy zmianie ceny ----------------------------------
create or replace function public.set_pricing_tariffs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists pricing_tariffs_updated_at on public.pricing_tariffs;
create trigger pricing_tariffs_updated_at
  before update on public.pricing_tariffs
  for each row execute function public.set_pricing_tariffs_updated_at();

-- 5) RLS - klient publiczny musi czytać, panel admina musi zapisywać ----------------
alter table public.pricing_tariffs enable row level security;

drop policy if exists "Allow public read access to pricing_tariffs" on public.pricing_tariffs;
create policy "Allow public read access to pricing_tariffs"
  on public.pricing_tariffs for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public insert to pricing_tariffs" on public.pricing_tariffs;
create policy "Allow public insert to pricing_tariffs"
  on public.pricing_tariffs for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public update to pricing_tariffs" on public.pricing_tariffs;
create policy "Allow public update to pricing_tariffs"
  on public.pricing_tariffs for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Allow public delete from pricing_tariffs" on public.pricing_tariffs;
create policy "Allow public delete from pricing_tariffs"
  on public.pricing_tariffs for delete
  to anon, authenticated
  using (true);

-- 6) Realtime - zmiana ceny ma natychmiast dotrzeć do publicznego cennika ---------
--    Bez tego Supabase nie emituje postgres_changes dla tej tabeli, a frontend
--    odświeżałby ceny dopiero przy przeładowaniu strony.
do $$
begin
  alter publication supabase_realtime add table public.pricing_tariffs;
exception
  when duplicate_object then null;   -- tabela już jest w publikacji
-- 7) Seed cennika ------------------------------------------------------------------
--    'on conflict do nothing' jest celowe: ponowne uruchomienie migracji NIGDY
--    nie nadpisze stawek zmienionych przez właściciela w panelu "Ceny i Taryfy".
insert into public.pricing_tariffs
  (location_slug, location_name, resource_type, title, subtitle, unit_text, extra_note, page_title,
   day_group, day_label, day_short, price_before_17, price_after_17, shoes_price, is_popular, sort_order)
values
  -- ===== KATOWICE ================================================================
  ('katowice', 'Katowice', 'bowling', 'Kręgle', '12 torów UV • Glow Bowling Zone',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   null, 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 99, 129, 3, false, 1),
  ('katowice', 'Katowice', 'bowling', 'Kręgle', '12 torów UV • Glow Bowling Zone',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   null, 'fri', 'Piątek', 'Pt', 119, 179, 3, true, 2),
  ('katowice', 'Katowice', 'bowling', 'Kręgle', '12 torów UV • Glow Bowling Zone',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   null, 'sat-holidays', 'Sobota i Święta', 'Sob i Święta', 149, 179, 3, true, 3),
  ('katowice', 'Katowice', 'bowling', 'Kręgle', '12 torów UV • Glow Bowling Zone',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   null, 'sun', 'Niedziela', 'Ndz', 149, 169, 3, false, 4),

  ('katowice', 'Katowice', 'billiards', 'Bilard', 'Stoły tournament grade 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   null, 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 25, 30, 0, false, 1),
  ('katowice', 'Katowice', 'billiards', 'Bilard', 'Stoły tournament grade 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   null, 'fri', 'Piątek', 'Pt', 25, 35, 0, false, 2),
  ('katowice', 'Katowice', 'billiards', 'Bilard', 'Stoły tournament grade 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   null, 'sat-holidays', 'Sobota i Święta', 'Sob i Święta', 30, 35, 0, true, 3),
  ('katowice', 'Katowice', 'billiards', 'Bilard', 'Stoły tournament grade 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   null, 'sun', 'Niedziela', 'Ndz', 30, 30, 0, false, 4),
  when undefined_object then null;   -- projekt bez Realtime - nie blokuj migracji
-- ===== JAWORZNO ================================================================
  ('jaworzno', 'Jaworzno', 'bowling', 'Kręgle', '8 torów UV • Galeria Galena',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 109, 119, 3, false, 1),
  ('jaworzno', 'Jaworzno', 'bowling', 'Kręgle', '8 torów UV • Galeria Galena',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'fri', 'Piątek', 'Pt', 119, 159, 3, true, 2),
  ('jaworzno', 'Jaworzno', 'bowling', 'Kręgle', '8 torów UV • Galeria Galena',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'weekend', 'Sobota, Niedziela i Święta', 'Sob - Nd i Św', 149, 159, 3, true, 3),

  ('jaworzno', 'Jaworzno', 'billiards', 'Bilard', 'Strefa stołów bilardowych 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 25, 30, 0, false, 1),
  ('jaworzno', 'Jaworzno', 'billiards', 'Bilard', 'Strefa stołów bilardowych 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'fri', 'Piątek', 'Pt', 25, 35, 0, false, 2),
  ('jaworzno', 'Jaworzno', 'billiards', 'Bilard', 'Strefa stołów bilardowych 9ft',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'weekend', 'Sobota, Niedziela i Święta', 'Sob - Nd i Św', 30, 35, 0, true, 3),

  ('jaworzno', 'Jaworzno', 'dart', 'Dart', 'Strefa dartowa • rzutki',
   'za 1 godz. gry', 'Podane ceny dotyczą 1 godziny gry w dart.',
   'Aktualne Ceny Kręgli i Bilarda', 'all-week', 'Poniedziałek – Niedziela i Święta', 'Pn - Nd i Św', 30, 30, 0, false, 1),

  -- ===== POZNAŃ ===================================================================
  ('poznan', 'Poznań', 'bowling', 'Kręgle', 'Torów bowlingowych • CH King Cross Marcelin',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 129, 159, 5, false, 1),
  ('poznan', 'Poznań', 'bowling', 'Kręgle', 'Torów bowlingowych • CH King Cross Marcelin',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'fri', 'Piątek', 'Pt', 129, 199, 5, false, 2),
  ('poznan', 'Poznań', 'bowling', 'Kręgle', 'Torów bowlingowych • CH King Cross Marcelin',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'sat-holidays', 'Sobota i Święta', 'Sob i Święta', 159, 199, 5, true, 3),
  ('poznan', 'Poznań', 'bowling', 'Kręgle', 'Torów bowlingowych • CH King Cross Marcelin',
   'za 1 godz. gry na 1 torze', 'Podane ceny dotyczą 1 godziny gry na 1 torze.',
   'Aktualne Ceny Kręgli i Bilarda', 'sun', 'Niedziela', 'Ndz', 159, 189, 5, false, 4),

  ('poznan', 'Poznań', 'billiards', 'Bilard', 'Strefa Lounge Bilard Bar',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 35, 40, 0, false, 1),
  ('poznan', 'Poznań', 'billiards', 'Bilard', 'Strefa Lounge Bilard Bar',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'fri', 'Piątek', 'Pt', 35, 50, 0, false, 2),
  ('poznan', 'Poznań', 'billiards', 'Bilard', 'Strefa Lounge Bilard Bar',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'sat-holidays', 'Sobota i Święta', 'Sob i Święta', 45, 50, 0, true, 3),
  ('poznan', 'Poznań', 'billiards', 'Bilard', 'Strefa Lounge Bilard Bar',
   'za 1 godz. gry na 1 stole', 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
   'Aktualne Ceny Kręgli i Bilarda', 'sun', 'Niedziela', 'Ndz', 45, 50, 0, false, 4),

  ('poznan', 'Poznań', 'karaoke', 'Karaoke', 'Sala karaoke • śpiew dla każdego',
   'za 1 godz. wynajmu sali', 'Podane ceny dotyczą 1 godziny wynajmu sali karaoke.',
   'Aktualne Ceny Kręgli i Bilarda', 'mon-thu', 'Poniedziałek – Czwartek', 'Pn - Czw', 90, 90, 0, false, 1),
  ('poznan', 'Poznań', 'karaoke', 'Karaoke', 'Sala karaoke • śpiew dla każdego',
   'za 1 godz. wynajmu sali', 'Podane ceny dotyczą 1 godziny wynajmu sali karaoke.',
   'Aktualne Ceny Kręgli i Bilarda', 'fri-sun', 'Piątek – Niedziela i Święta', 'Pt - Nd i Św', 160, 160, 0, true, 2)
on conflict (location_slug, resource_type, day_group) do nothing;

-- 8) Kontrola po wgraniu (uruchom osobno) ------------------------------------------
--   select location_slug, resource_type, count(*) as slots,
--          min(price_before_17) as min_stawka
--     from public.pricing_tariffs
--    where is_active
--    group by 1, 2
--    order by 1, 2;
end;
$$;