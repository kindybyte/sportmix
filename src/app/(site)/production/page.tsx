import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/queries";
import { PriceRequestButton } from "@/components/lead/PriceRequestButton";
import { SpoolIcon, ArrowRight, TelegramIcon, CheckIcon } from "@/components/ui/Icons";
import { telegramLink } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Производство — швейный цех SportMix",
  description:
    "Как устроено производство SportMix: раскрой, пошив, контроль качества, упаковка и отгрузка. Собственный швейный цех в Кыргызстане, отправка оптом в Россию и СНГ.",
  alternates: { canonical: "/production" },
};

/**
 * Этапы производства. Чтобы добавить реальные фото:
 * 1) положите изображения в папку /public/production/ (например step-1.jpg),
 * 2) укажите путь в поле image, напр. image: "/production/step-1.jpg".
 * Пока image: null — показывается аккуратный плейсхолдер.
 */
const STEPS: { n: string; title: string; desc: string; image: string | null }[] = [
  { n: "01", title: "Закупка ткани", desc: "Отбираем качественное полотно: холодок, кулир, футер, трёхнитка.", image: null },
  { n: "02", title: "Раскрой", desc: "Точный раскрой по лекалам — ровная посадка и минимум брака.", image: null },
  { n: "03", title: "Пошив", desc: "Швейные линии цеха выполняют тираж в нужном объёме и в срок.", image: null },
  { n: "04", title: "Контроль качества", desc: "Проверяем швы, размеры и фурнитуру перед упаковкой.", image: null },
  { n: "05", title: "Упаковка", desc: "Складываем и упаковываем по размерам и цветам — удобно принимать.", image: null },
  { n: "06", title: "Отгрузка", desc: "Передаём в транспортную компанию и присылаем трек-номер.", image: null },
];

const GALLERY: { caption: string; image: string | null }[] = [
  { caption: "Швейный цех", image: null },
  { caption: "Раскройный стол", image: null },
  { caption: "Готовая продукция", image: null },
  { caption: "Контроль качества", image: null },
  { caption: "Упаковка партии", image: null },
  { caption: "Отгрузка заказа", image: null },
];

function PhotoTile({
  src,
  caption,
  aspect = "aspect-[4/3]",
}: {
  src: string | null;
  caption?: string;
  aspect?: string;
}) {
  return (
    <div className={`relative ${aspect} overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-line/60 to-panel`}>
      {src ? (
        <Image src={src} alt={caption ?? ""} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted/60">
          <SpoolIcon className="h-9 w-9" />
          {caption && <span className="text-xs font-medium">{caption}</span>}
        </div>
      )}
    </div>
  );
}

export default async function ProductionPage() {
  const settings = await getSettings();
  const tg = telegramLink(settings?.telegram_username);

  return (
    <div className="container-px py-12 lg:py-16">
      {/* Hero */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="eyebrow mb-3">Производство</span>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Собственный швейный цех в Кыргызстане
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">
            SportMix — производство полного цикла: от закупки ткани до упаковки и
            отгрузки готовой партии. Это позволяет держать честную оптовую цену и
            контролировать качество на каждом этапе.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {["Полный цикл производства", "Контроль качества каждой партии", "Любые цвета и размеры под заказ", "Упаковка по размерам и цветам"].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-ink/80">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-signal-soft text-signal">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <PhotoTile src={null} caption="Фото цеха" aspect="aspect-[4/3]" />
      </div>

      {/* Этапы производства */}
      <section className="mt-16 lg:mt-24">
        <div className="mb-8 max-w-2xl">
          <span className="eyebrow mb-3">Как мы работаем</span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Этапы производства</h2>
          <p className="mt-3 text-muted">От ткани до отгрузки — каждый шаг под контролем.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s) => (
            <article key={s.n} className="card overflow-hidden">
              <PhotoTile src={s.image} caption={s.title} aspect="aspect-[4/3] rounded-none border-0 border-b border-line" />
              <div className="p-5">
                <span className="font-display text-sm font-bold text-signal">{s.n}</span>
                <h3 className="mt-1 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Галерея */}
      <section className="mt-16 lg:mt-24">
        <div className="mb-8">
          <span className="eyebrow mb-3">Фотогалерея</span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Цех, упаковка и отгрузка</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {GALLERY.map((g) => (
            <PhotoTile key={g.caption} src={g.image} caption={g.caption} aspect="aspect-square" />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 overflow-hidden rounded-2xl bg-ink p-8 text-paper sm:p-12 lg:mt-24">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Запустим вашу партию</h2>
            <p className="mt-3 max-w-md text-paper/70">
              Расскажите, что нужно — подберём ткань, цвета и размеры, рассчитаем
              цену и сроки. Отправляем в Россию и СНГ.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/catalog" className="btn btn-signal btn-lg">
              Смотреть каталог <ArrowRight className="h-5 w-5" />
            </Link>
            {tg && (
              <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-lg border border-paper/30 text-paper hover:bg-paper hover:text-ink">
                <TelegramIcon className="h-5 w-5" /> Telegram
              </a>
            )}
            <PriceRequestButton className="btn-lg border border-paper/30 text-paper hover:bg-paper hover:text-ink">
              Получить прайс
            </PriceRequestButton>
          </div>
        </div>
      </section>
    </div>
  );
}
