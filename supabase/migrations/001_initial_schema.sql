-- Orderly: početna šema baze (korak 0.6)
-- Pokreni u Supabase SQL Editoru. RLS i indeksi su u 002_rls_indexes.sql (korak 0.7).

begin;

-- ---------------------------------------------------------------------------
-- Pomoćna funkcija: automatski osvežava updated_at pri izmeni reda
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. sites: prodavnice (WooCommerce / Thinkific)
-- ---------------------------------------------------------------------------
create table public.sites (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  platform           text not null check (platform in ('woocommerce', 'thinkific')),
  url                text not null,
  -- WooCommerce REST API
  consumer_key       text,
  consumer_secret    text,
  -- Thinkific API
  api_key            text,
  subdomain          text,
  -- Tajna za proveru potpisa webhook-a
  webhook_secret     text,
  color_hex          text not null default '#1B6EF3' check (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  default_margin_pct numeric(5,2) not null default 0 check (default_margin_pct between 0 and 100),
  card_fee_pct       numeric(5,2) not null default 0 check (card_fee_pct between 0 and 100),
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger sites_set_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. customers: jedan kupac po email-u, preko svih kanala
-- ---------------------------------------------------------------------------
create table public.customers (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique check (email = lower(btrim(email))),
  first_name     text,
  last_name      text,
  total_orders   integer not null default 0,
  total_spent    numeric(12,2) not null default 0, -- u osnovnoj valuti
  first_order_at timestamptz,
  last_order_at  timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. products: proizvodi po sajtu, sa troškom (COGS)
-- ---------------------------------------------------------------------------
create table public.products (
  id                  uuid primary key default gen_random_uuid(),
  site_id             uuid not null references public.sites(id) on delete cascade,
  external_product_id text not null,
  name                text not null,
  product_type        text not null default 'physical' check (product_type in ('physical', 'digital')),
  cost_type           text check (cost_type in ('percent', 'fixed')),
  cost_value          numeric(12,2) check (cost_value >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (site_id, external_product_id)
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. orders: porudžbine sa svih kanala
--    created_at i updated_at dolaze SA IZVORA (npr. date_created_gmt),
--    zato created_at nema default i nema trigger za updated_at.
-- ---------------------------------------------------------------------------
create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  site_id           uuid not null references public.sites(id) on delete cascade,
  external_order_id text not null,
  customer_id       uuid references public.customers(id) on delete set null,
  customer_email    text,
  customer_name     text,
  status            text not null,
  currency          char(3) not null,
  total             numeric(12,2) not null default 0,
  subtotal          numeric(12,2),
  tax_total         numeric(12,2),
  shipping_total    numeric(12,2),
  discount_total    numeric(12,2),
  net_profit        numeric(12,2),
  payment_method    text,
  source            text not null check (source in ('woocommerce', 'thinkific')),
  created_at        timestamptz not null,
  updated_at        timestamptz,
  synced_at         timestamptz not null default now(),
  unique (site_id, external_order_id)
);

-- ---------------------------------------------------------------------------
-- 5. order_items: stavke porudžbine
-- ---------------------------------------------------------------------------
create table public.order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id) on delete cascade,
  product_id          uuid references public.products(id) on delete set null,
  external_product_id text,
  name                text not null,
  quantity            integer not null default 1 check (quantity >= 0),
  unit_price          numeric(12,2) not null default 0,
  total               numeric(12,2) not null default 0,
  product_type        text not null default 'physical' check (product_type in ('physical', 'digital')),
  cost                numeric(12,2)
);

-- ---------------------------------------------------------------------------
-- 6. subscriptions: pretplate (WooCommerce Subscriptions / Thinkific)
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  site_id                  uuid not null references public.sites(id) on delete cascade,
  external_subscription_id text not null,
  customer_id              uuid references public.customers(id) on delete set null,
  customer_email           text,
  status                   text not null,
  currency                 char(3) not null,
  amount                   numeric(12,2) not null default 0,
  billing_period           text check (billing_period in ('day', 'week', 'month', 'year')),
  billing_interval         integer not null default 1 check (billing_interval > 0),
  start_date               timestamptz,
  next_payment_date        timestamptz,
  end_date                 timestamptz,
  cancelled_at             timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  unique (site_id, external_subscription_id)
);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 7. settings: ključ / vrednost (valuta, kursevi, ciljevi, statusi...)
-- ---------------------------------------------------------------------------
create table public.settings (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 8. sync_log: zapis svakog webhook-a, sync-a i cron-a
-- ---------------------------------------------------------------------------
create table public.sync_log (
  id               uuid primary key default gen_random_uuid(),
  site_id          uuid references public.sites(id) on delete set null,
  source           text not null check (source in ('webhook', 'sync', 'cron')),
  status           text not null check (status in ('success', 'error')),
  orders_processed integer not null default 0,
  error            text,
  details          jsonb,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. sound_settings: zvuk po sajtu
-- ---------------------------------------------------------------------------
create table public.sound_settings (
  id         uuid primary key default gen_random_uuid(),
  site_id    uuid not null unique references public.sites(id) on delete cascade,
  enabled    boolean not null default true,
  sound_url  text,
  volume     numeric(3,2) not null default 0.8 check (volume between 0 and 1),
  statuses   text[] not null default '{processing,completed}',
  updated_at timestamptz not null default now()
);

create trigger sound_settings_set_updated_at
  before update on public.sound_settings
  for each row execute function public.set_updated_at();

commit;
