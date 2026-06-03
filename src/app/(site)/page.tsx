import Link from "next/link";
import { getCategories, getNewProducts, getReviews, getSettings } from "@/lib/queries";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PriceRequestButton } from "@/components/lead/PriceRequestButton";
import { TrustBlock } from "@/components/site/TrustBlock";
import { PriceFormSection } from "@/components/site/PriceFormSection";
import { FaqSection } from "@/components/site/FaqSection";
import {
  ArrowRight,
  TelegramIcon,
  WhatsappIcon,
  PinIcon,
} from "@/components/ui/Icons";
import { telegramLink, whatsappLink } from "@/lib/utils";

export const revalidate = 120;

const ADVANTAGES = [
  { t: "Собственное производство", d: "Свой швейный цех — цена напрямую, без посредников." },
  { t: "Оптовые партии", d: "Производим тиражами под нужды оптовых клиентов." },
  { t: "Актуальные модели", d: "Каталог регулярно пополняется новыми моделями." },
  { t: "Отправка в Россию и СНГ", d: "Налаженная логистика до вашего города." },
  { t: "Цвета и размеры на выбор", d: "Разные цвета и полный размерный ряд под заказ." },
  { t: "Быстрая связь в Telegram", d: "Ответим на заявку и пришлём прайс в мессенджере." },
];

const STEPS = [
  { n: "01", t: "Выберите модель", d: "Откройте каталог и отметьте интересующие товары." },
  { n: "02", t: "Отправьте заявку", d: "Заполните короткую форму — она придёт менеджеру в Telegram." },
  { n: "03", t: "Уточним детали", d: "Менеджер подтвердит наличие, цену и стоимость доставки." },
  { n: "04", t: "Согласуем заказ", d: "Фиксируем состав партии, цвета, размеры и сроки." },
  { n: "05", t: "Отправляем товар", d: "Отгружаем и передаём в доставку до вашего города." },
];

export default async function HomePage() {
  const [categories, newProducts, settings, reviews] = await Promise.all([
    getCategories(),
    getNewProducts(8),
    getSettings(),
    getReviews(),
  ]);

  const tg = telegramLink(settings?.telegram_username);
  const wa = whatsappLink(settings?.whatsapp_number);

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden">
        <div className="container-px grid gap-10 pb-12 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-20 lg:pt-20">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="eyebrow mb-5">
              <span className="h-px w-8 bg-signal" />
              Швейный цех · Бишкек, Кыргызстан
            </span>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.4rem)] font-bold leading-[0.98] tracking-tight">
              Оптовый каталог{" "}
              <span className="relative whitespace-nowrap text-signal">
                SportMix
              </span>
            </h1>
            <p className="mt-5 max-w-xl font-display text-lg font-medium text-ink/80 sm:text-xl">
              Мужская одежда от швейного цеха напрямую
            </p>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Футболки, поло, батники, худи и спортивная одежда оптом для клиентов
              из России и СНГ. Собственное производство — честная оптовая цена.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn btn-primary btn-lg">
                Смотреть каталог
                <ArrowRight className="h-5 w-5" />
              </Link>
              {tg && (
                <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                  <TelegramIcon className="h-5 w-5" />
                  Связаться в Telegram
                </a>
              )}
              <PriceRequestButton className="btn-signal btn-lg" />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
              <div><span className="font-display text-2xl font-bold text-ink">6+</span> категорий</div>
              <div className="h-8 w-px bg-line" />
              <div><span className="font-display text-2xl font-bold text-ink">100%</span> своё производство</div>
              <div className="h-8 w-px bg-line" />
              <div><span className="font-display text-2xl font-bold text-ink">RU + СНГ</span> доставка</div>
            </div>
          </div>

          {/* Карточка-витрина */}
          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-ink to-[#2a2620] text-paper shadow-lift">
              <div className="tape absolute inset-x-0 top-0 h-3 opacity-30" />
              <div className="flex h-full flex-col justify-between p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-signal">
                    Direct from factory
                  </span>
                  <p className="mt-4 font-display text-3xl font-bold leading-tight">
                    Шьём оптом.<br />Отправляем в Россию.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-paper/80">
                  {["Холодок, кулир, футер, трёхнитка", "Размерный ряд 44–60", "Любые цвета под партию", "Образцы и брендирование"].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-signal/20 text-signal">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Бегущая строка */}
        <div className="overflow-hidden border-y border-line bg-ink py-3 text-paper">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-wider">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex items-center gap-10">
                {["Футболки", "Поло", "Батники", "Худи", "Спортивные костюмы", "Новинки", "Опт от производителя"].map((w) => (
                  <span key={w} className="flex items-center gap-10">
                    {w} <span className="text-signal">✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── ПРЕИМУЩЕСТВА ─────────── */}
      <section className="container-px py-16 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow mb-3">Почему SportMix</span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Прямое производство — выгодные условия для опта
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <div key={a.t} className="card p-6 transition-colors hover:border-ink">
              <span className="font-display text-sm font-bold text-signal">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{a.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── КАТЕГОРИИ ─────────── */}
      <section className="container-px py-4 lg:py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow mb-3">Ассортимент</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Популярные категории</h2>
          </div>
          <Link href="/catalog" className="btn btn-outline btn-md">
            Весь каталог <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel p-4 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-card"
            >
              <span className="font-display text-3xl font-bold text-line transition-colors group-hover:text-signal">
                0{i + 1}
              </span>
              <span className="font-display text-sm font-semibold leading-tight">{c.title}</span>
            </Link>
          ))}
          <Link
            href="/catalog?sort=new"
            className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl bg-ink p-4 text-paper transition-all hover:-translate-y-1 hover:bg-signal hover:text-white"
          >
            <span className="font-display text-3xl font-bold text-paper/30">★</span>
            <span className="font-display text-sm font-semibold leading-tight">Новинки</span>
          </Link>
        </div>
      </section>

      {/* ─────────── НОВЫЕ ТОВАРЫ ─────────── */}
      {newProducts.length > 0 && (
        <section className="container-px py-16 lg:py-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow mb-3">Свежие модели</span>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Новинки каталога</h2>
            </div>
            <Link href="/catalog" className="btn btn-outline btn-md">
              Открыть каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {newProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─────────── КАК ЗАКАЗАТЬ ─────────── */}
      <section className="border-y border-line bg-panel">
        <div className="container-px py-16 lg:py-24">
          <div className="mb-12 max-w-2xl">
            <span className="eyebrow mb-3">Просто и быстро</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Как заказать</h2>
            <p className="mt-3 text-muted">
              Пять шагов от выбора модели до отправки готовой партии.
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-5">
            {STEPS.map((s) => (
              <li key={s.n} className="relative rounded-2xl border border-line bg-paper p-5">
                <span className="font-display text-3xl font-bold text-signal">{s.n}</span>
                <h3 className="mt-3 font-display text-base font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────── БЛОК ДОВЕРИЯ + ОТЗЫВЫ ─────────── */}
      <TrustBlock reviews={reviews} experienceText={settings?.experience_text} />

      {/* ─────────── ФОРМА: ПОЛУЧИТЬ ОПТОВЫЙ ПРАЙС ─────────── */}
      <PriceFormSection />

      {/* ─────────── FAQ ─────────── */}
      <FaqSection />

      {/* ─────────── КОНТАКТЫ CTA ─────────── */}
      <section className="container-px py-16 lg:py-24">
        <div className="overflow-hidden rounded-2xl bg-ink p-8 text-paper sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Готовы получить прайс?
              </h2>
              <p className="mt-4 max-w-md text-paper/70">
                Напишите нам в Telegram или оставьте заявку — пришлём актуальный
                каталог с ценами и наличием, ответим по доставке в ваш город.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {tg && (
                  <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-signal btn-lg">
                    <TelegramIcon className="h-5 w-5" /> Написать в Telegram
                  </a>
                )}
                <PriceRequestButton className="btn-lg border border-paper/30 text-paper hover:bg-paper hover:text-ink">
                  Получить прайс
                </PriceRequestButton>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-paper/15 p-5">
                <PinIcon className="h-6 w-6 text-signal" />
                <h3 className="mt-3 font-display font-semibold">Производство</h3>
                <p className="mt-1 text-sm text-paper/70">{settings?.city ?? "Бишкек, Кыргызстан"}</p>
              </div>
              <div className="rounded-2xl border border-paper/15 p-5">
                <ArrowRight className="h-6 w-6 text-signal" />
                <h3 className="mt-3 font-display font-semibold">Доставка</h3>
                <p className="mt-1 text-sm text-paper/70">{settings?.delivery_text ?? "Россия и СНГ"}</p>
              </div>
              {tg && (
                <a href={tg} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-paper/15 p-5 transition-colors hover:border-signal">
                  <TelegramIcon className="h-6 w-6 text-signal" />
                  <h3 className="mt-3 font-display font-semibold">Telegram</h3>
                  <p className="mt-1 text-sm text-paper/70">@{settings?.telegram_username}</p>
                </a>
              )}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-paper/15 p-5 transition-colors hover:border-signal">
                  <WhatsappIcon className="h-6 w-6 text-signal" />
                  <h3 className="mt-3 font-display font-semibold">WhatsApp</h3>
                  <p className="mt-1 text-sm text-paper/70">{settings?.whatsapp_number}</p>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
