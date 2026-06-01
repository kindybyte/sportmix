# SportMix — оптовый каталог мужской одежды

B2B-каталог для швейного цеха **SportMix** (Бишкек, Кыргызстан): современный сайт
с каталогом, страницами товаров, избранным, заявками через Telegram-бота и
закрытой админ-панелью для управления.

**Стек:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase
(БД, авторизация, хранилище фото) · Telegram Bot API · готов к деплою на Vercel.

---

## Возможности

**Для клиентов**
- Главная страница с преимуществами, категориями, новинками, шагами заказа и контактами.
- Каталог с поиском, фильтрами (категория, ткань, размеры, цвета, наличие) и сортировкой.
- Страница товара: галерея, характеристики, цена, мин. партия, похожие товары, «скопировать ссылку».
- Избранное (в браузере) и общая заявка по нескольким моделям.
- Заявка / запрос прайса → приходит владельцу в Telegram и сохраняется в БД.
- Адаптивный мобильный интерфейс, SEO-метаданные, sitemap, robots, Schema.org.

**Для администратора (`/admin`)**
- Авторизация (Supabase Auth), закрытый доступ через middleware.
- Товары: добавление, редактирование, удаление, скрытие, загрузка нескольких фото,
  цвета, размеры, ткань, цена, мин. партия, статус, метки «Новинка» / «Хит продаж».
- Категории: добавление, редактирование, порядок, видимость.
- Заявки: список, фильтр по статусу, смена статуса, быстрый переход в Telegram клиента.
- Настройки: название, Telegram, WhatsApp, город, доставка, описание, логотип.

---

## Быстрый старт (локально)

### 1. Зависимости
```bash
npm install
```

### 2. Supabase
1. Создайте проект на [supabase.com](https://supabase.com).
2. Откройте **SQL Editor** и выполните скрипт [`supabase/schema.sql`](supabase/schema.sql)
   (создаст таблицы, политики RLS, бакет `product-images` и демо-категории).
3. **Authentication → Users → Add user**: создайте аккаунт администратора
   (email + пароль). Это и есть логин в `/admin`.
4. **Project Settings → API**: скопируйте `URL`, `anon key` и `service_role key`.

### 3. Telegram-бот
1. Напишите [@BotFather](https://t.me/BotFather) → `/newbot` → получите **токен**.
2. Узнайте свой **chat_id**: напишите боту любое сообщение, затем откройте
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `chat.id`
   (или используйте [@userinfobot](https://t.me/userinfobot)).

### 4. Переменные окружения
Скопируйте `.env.example` → `.env.local` и заполните:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Запуск
```bash
npm run dev
```
- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin

---

## Деплой на Vercel

1. Залейте проект в GitHub.
2. На [vercel.com](https://vercel.com) → **New Project** → импортируйте репозиторий.
3. В **Environment Variables** добавьте все переменные из `.env.local`
   (в `NEXT_PUBLIC_SITE_URL` укажите боевой адрес, например `https://sportmix.vercel.app`).
4. **Deploy**. Vercel сам определит Next.js.

> После смены домена обновите `NEXT_PUBLIC_SITE_URL` и передеплойте — это влияет
> на canonical-ссылки и sitemap.

---

## Безопасность

- **RLS** включён для всех таблиц: публично доступны только видимые товары,
  категории и настройки; заявки и админ-операции — только авторизованным.
- Заявки вставляются на сервере (`/api/lead`) через **service role** ключ,
  который никогда не попадает в браузер.
- Валидация всех форм (Zod), **honeypot** + **rate limit** (5 заявок/мин на IP) от спама.
- Загрузка фото: проверка типа и размера (до 5 МБ), отдельный бакет, политики Storage.
- Админка защищена middleware и серверной проверкой сессии.
- Все ключи — только в переменных окружения.

---

## Структура

```
supabase/schema.sql            # БД + RLS + Storage
src/
  app/
    (site)/                    # публичный сайт (общий layout с шапкой/подвалом)
      page.tsx                 # главная
      catalog/                 # каталог с фильтрами
      product/[slug]/          # страница товара
      about · how-to-order · contacts · favorites
    admin/                     # закрытая админ-панель
      login · products · categories · leads · settings
      actions.ts               # серверные actions (CRUD)
    api/lead/route.ts          # приём заявок + Telegram
    sitemap.ts · robots.ts
  components/                  # UI, каталог, товар, заявки, избранное, админка
  lib/                         # supabase-клиенты, типы, запросы, telegram, валидация
  middleware.ts                # защита /admin
```

---

## Частые вопросы

- **Фото не отображаются после деплоя** — проверьте, что бакет `product-images`
  публичный (скрипт делает это автоматически) и что домен Supabase разрешён
  в `next.config.mjs` (берётся из `NEXT_PUBLIC_SUPABASE_URL`).
- **Заявки не приходят в Telegram** — проверьте `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`
  и что вы хотя бы раз написали боту. Заявка в любом случае сохраняется в админке.
- **Не пускает в админку** — создайте пользователя в Supabase → Authentication.
```
