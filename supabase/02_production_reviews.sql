-- ════════════════════════════════════════════════════════════════
-- SportMix — миграция: управление фото производства и отзывами
-- Выполните в Supabase → SQL Editor (поверх основного schema.sql).
-- Безопасно запускать повторно.
-- ════════════════════════════════════════════════════════════════

-- ─────────────── ФОТО ПРОИЗВОДСТВА ───────────────
-- section: 'step'  — этап производства (с заголовком и описанием)
--          'gallery' — фото в галерею (заголовок-подпись)
create table if not exists public.production_photos (
  id          uuid primary key default gen_random_uuid(),
  section     text not null default 'gallery',
  title       text,
  description text,
  image_url   text,
  sort_order  int not null default 0,
  is_visible  boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists production_photos_section_idx
  on public.production_photos(section, sort_order);

-- ─────────────── ОТЗЫВЫ ───────────────
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

-- ─────────────── НАСТРОЙКИ: опыт ───────────────
alter table public.settings
  add column if not exists experience_text text default '5+ лет';

-- ════════════════════════════════════════════════════════════════
-- RLS
-- ════════════════════════════════════════════════════════════════
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
