-- Orderly: zaštita tabela (RLS) i indeksi (korak 0.7)
-- Pokreni u Supabase SQL Editoru, posle 001_initial_schema.sql.
--
-- Pravilo: prijavljen korisnik (uloga authenticated, preko Clerk tokena) sme samo da ČITA.
-- Upise radi isključivo server preko service role ključa, koji zaobilazi RLS.
-- Za ulogu anon NEMA nijednog pravila: anon ključ je javan, pa odjavljen korisnik ne vidi ništa.

begin;

-- ---------------------------------------------------------------------------
-- 1. Uključi RLS na svih 9 tabela
-- ---------------------------------------------------------------------------
alter table public.sites          enable row level security;
alter table public.customers      enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.products       enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.settings       enable row level security;
alter table public.sync_log       enable row level security;
alter table public.sound_settings enable row level security;

-- ---------------------------------------------------------------------------
-- 2. Policy authenticated_read: SELECT samo za prijavljene
--    (nema INSERT/UPDATE/DELETE pravila => upis samo preko service role)
-- ---------------------------------------------------------------------------
create policy authenticated_read on public.sites
  for select to authenticated using (true);

create policy authenticated_read on public.customers
  for select to authenticated using (true);

create policy authenticated_read on public.orders
  for select to authenticated using (true);

create policy authenticated_read on public.order_items
  for select to authenticated using (true);

create policy authenticated_read on public.products
  for select to authenticated using (true);

create policy authenticated_read on public.subscriptions
  for select to authenticated using (true);

create policy authenticated_read on public.settings
  for select to authenticated using (true);

create policy authenticated_read on public.sync_log
  for select to authenticated using (true);

create policy authenticated_read on public.sound_settings
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- 3. sites: ključevi prodavnica nikad ne idu u browser
--    RLS radi po redovima, ne po kolonama. Zato prijavljenom korisniku
--    oduzimamo čitanje cele tabele i vraćamo samo bezbedne kolone.
--    consumer_key, consumer_secret, api_key i webhook_secret čita samo service role.
--    Posledica: u browseru ne raditi select('*') nad sites, nego navesti kolone.
-- ---------------------------------------------------------------------------
revoke select on public.sites from anon, authenticated;

grant select (
  id,
  name,
  platform,
  url,
  subdomain,
  color_hex,
  default_margin_pct,
  card_fee_pct,
  is_active,
  created_at,
  updated_at
) on public.sites to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Indeksi
--    Namerno preskočeni (već postoje preko UNIQUE ograničenja iz 001):
--      - orders(site_id): pokriva ga unique(site_id, external_order_id)
--      - customers(email): pokriva ga email unique
-- ---------------------------------------------------------------------------
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_site_created_at_idx
  on public.orders (site_id, created_at desc);   -- KPI i feed po sajtu i periodu

create index if not exists orders_status_idx
  on public.orders (status);

create index if not exists orders_customer_email_idx
  on public.orders (customer_email);

create index if not exists orders_customer_id_idx
  on public.orders (customer_id);                -- profil kupca

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create index if not exists order_items_product_id_idx
  on public.order_items (product_id);            -- top proizvodi

create index if not exists sync_log_created_at_idx
  on public.sync_log (created_at desc);

commit;
