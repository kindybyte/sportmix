-- ════════════════════════════════════════════════════════════════
-- SportMix — усиление безопасности (RLS только для админов)
-- Выполните в Supabase → SQL Editor (после schema.sql и 02_*).
-- Безопасно запускать повторно.
--
-- Что делает:
--   • создаёт таблицу admins (список администраторов по user_id);
--   • функцию is_admin();
--   • переписывает политики записи/чтения заявок так, чтобы доступ
--     был ТОЛЬКО у пользователей из admins (а не у любого вошедшего).
--   • автоматически добавляет уже существующих пользователей в admins
--     (бутстрап — чтобы вы не потеряли доступ).
-- ════════════════════════════════════════════════════════════════

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Проверка «текущий пользователь — админ»
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Бутстрап: добавляем всех уже существующих пользователей в админы.
-- (Сейчас это только вы. Новые регистрации админами НЕ станут.)
insert into public.admins (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- ─────────── Переписываем admin-политики на is_admin() ───────────
drop policy if exists "categories admin all" on public.categories;
create policy "categories admin all" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products admin all" on public.products;
create policy "products admin all" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "product_images admin all" on public.product_images;
create policy "product_images admin all" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads admin all" on public.leads;
create policy "leads admin all" on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings admin all" on public.settings;
create policy "settings admin all" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "production_photos admin all" on public.production_photos;
create policy "production_photos admin all" on public.production_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reviews admin all" on public.reviews;
create policy "reviews admin all" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─────────── Storage: запись только админам ───────────
drop policy if exists "product-images admin write" on storage.objects;
create policy "product-images admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- Чтобы вручную добавить нового админа позже:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'new-admin@example.com'
--   on conflict (user_id) do nothing;
-- ────────────────────────────────────────────────────────────────
