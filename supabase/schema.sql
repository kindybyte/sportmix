-- ════════════════════════════════════════════════════════════════
-- SportMix — схема базы данных Supabase (PostgreSQL)
-- Выполните этот скрипт в Supabase → SQL Editor.
-- Он создаёт таблицы, индексы, политики RLS и хранилище для фото.
-- ════════════════════════════════════════════════════════════════

-- Расширения
create extension if not exists "pgcrypto";

-- ─────────────────────────── ENUMS ───────────────────────────
do $$ begin
  create type product_status as enum ('in_stock', 'on_order', 'coming_soon');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'in_progress', 'done', 'canceled');
exception when duplicate_object then null; end $$;

-- ─────────────────────────── CATEGORIES ───────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────── PRODUCTS ─────────────────────────
create table if not exists public.products (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  slug                text not null unique,
  article             text,
  category_id         uuid references public.categories(id) on delete set null,
  fabric              text,
  sizes               text[] not null default '{}',
  colors              text[] not null default '{}',
  price               numeric(12,2),                 -- null = «Цена по запросу»
  min_order_quantity  int default 1,
  description         text,
  status              product_status not null default 'in_stock',
  is_new              boolean not null default false,
  is_popular          boolean not null default false,
  is_visible          boolean not null default true,
  season              text,
  gender              text default 'Мужской',
  origin              text default 'Кыргызстан',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_visible_idx  on public.products(is_visible);
create index if not exists products_created_idx  on public.products(created_at desc);

-- ─────────────────────────── PRODUCT IMAGES ───────────────────
create table if not exists public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  image_url   text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images(product_id, sort_order);

-- ─────────────────────────── LEADS (заявки) ───────────────────
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete set null,
  product_title text,                                -- денормализация на момент заявки
  product_article text,
  client_name  text not null,
  city         text,
  contact      text not null,
  color        text,
  size         text,
  quantity     text,
  comment      text,
  type         text not null default 'product',      -- 'product' | 'price' | 'cart'
  status       lead_status not null default 'new',
  created_at   timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads(created_at desc);
create index if not exists leads_status_idx  on public.leads(status);

-- ─────────────────────────── SETTINGS (single row) ────────────
create table if not exists public.settings (
  id                int primary key default 1,
  company_name      text not null default 'SportMix',
  telegram_username text default 'sportmix',
  whatsapp_number   text,
  city              text default 'Бишкек, Кыргызстан',
  delivery_text     text default 'Доставка в Россию и страны СНГ. Сроки и стоимость уточняйте у менеджера.',
  about_text        text default 'SportMix — швейный цех полного цикла. Производим мужскую одежду оптом напрямую с производства.',
  logo_url          text,
  constraint settings_single_row check (id = 1)
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ─────────────────────────── updated_at trigger ───────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- Публично (anon): только чтение видимых товаров/категорий/настроек
--                  + вставка заявок (через серверный route — service role).
-- Авторизованные (admin): полный доступ.
-- ════════════════════════════════════════════════════════════════

alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.leads          enable row level security;
alter table public.settings       enable row level security;

-- CATEGORIES
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select using (is_visible = true);

drop policy if exists "categories admin all" on public.categories;
create policy "categories admin all" on public.categories
  for all to authenticated using (true) with check (true);

-- PRODUCTS
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (is_visible = true);

drop policy if exists "products admin all" on public.products;
create policy "products admin all" on public.products
  for all to authenticated using (true) with check (true);

-- PRODUCT IMAGES (видны, если виден товар)
drop policy if exists "product_images public read" on public.product_images;
create policy "product_images public read" on public.product_images
  for select using (
    exists (select 1 from public.products p
            where p.id = product_id and p.is_visible = true)
  );

drop policy if exists "product_images admin all" on public.product_images;
create policy "product_images admin all" on public.product_images
  for all to authenticated using (true) with check (true);

-- LEADS — публично НЕ читаются. Вставка — только сервер (service role обходит RLS).
-- Авторизованные видят и управляют.
drop policy if exists "leads admin all" on public.leads;
create policy "leads admin all" on public.leads
  for all to authenticated using (true) with check (true);

-- SETTINGS
drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings
  for select using (true);

drop policy if exists "settings admin all" on public.settings;
create policy "settings admin all" on public.settings
  for all to authenticated using (true) with check (true);

-- ════════════════════════════════════════════════════════════════
-- STORAGE: публичный бакет для фотографий товаров
-- ════════════════════════════════════════════════════════════════
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images', 'product-images', true, 5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];

-- Публичное чтение файлов из бакета
drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read" on storage.objects
  for select using (bucket_id = 'product-images');

-- Загрузка/удаление — только авторизованные (админ)
drop policy if exists "product-images admin write" on storage.objects;
create policy "product-images admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images');

drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- ════════════════════════════════════════════════════════════════
-- ДЕМО-ДАННЫЕ (по желанию — можно удалить)
-- ════════════════════════════════════════════════════════════════
insert into public.categories (title, slug, sort_order) values
  ('Футболки', 'futbolki', 1),
  ('Поло', 'polo', 2),
  ('Батники', 'batniki', 3),
  ('Худи', 'hudi', 4),
  ('Спортивные костюмы', 'sportivnye-kostyumy', 5)
on conflict (slug) do nothing;

-- ════════════════════════════════════════════════════════════════
-- ФОТО ПРОИЗВОДСТВА И ОТЗЫВЫ (управляются из админки)
-- ════════════════════════════════════════════════════════════════
create table if not exists public.production_photos (
  id          uuid primary key default gen_random_uuid(),
  section     text not null default 'gallery',   -- 'step' | 'gallery'
  title       text,
  description text,
  image_url   text,
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists production_photos_section_idx
  on public.production_photos(section, sort_order);

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  city        text,
  text        text not null,
  rating      int not null default 5,
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_sort_idx on public.reviews(sort_order);

alter table public.settings
  add column if not exists experience_text text default '5+ лет';
alter table public.settings
  add column if not exists hero_image_url text;

alter table public.production_photos enable row level security;
alter table public.reviews           enable row level security;

drop policy if exists "production_photos public read" on public.production_photos;
create policy "production_photos public read" on public.production_photos
  for select using (is_visible = true);
drop policy if exists "production_photos admin all" on public.production_photos;
create policy "production_photos admin all" on public.production_photos
  for all to authenticated using (true) with check (true);

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (is_visible = true);
drop policy if exists "reviews admin all" on public.reviews;
create policy "reviews admin all" on public.reviews
  for all to authenticated using (true) with check (true);
