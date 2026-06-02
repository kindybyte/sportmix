import { SpoolIcon, PinIcon, ArrowRight, CheckIcon } from "@/components/ui/Icons";
import type { Review } from "@/lib/types";

/**
 * Блок доверия: опыт, производство, доставка + отзывы клиентов.
 * Отзывы и значение «Опыт» подтягиваются из админки; пока их нет —
 * показываются примеры по умолчанию.
 */

function pillars(experience: string) {
  return [
    {
      icon: CheckIcon,
      value: experience,
      title: "Опыт",
      desc: "Шьём мужскую одежду оптом и знаем требования оптовых клиентов.",
    },
  {
    icon: SpoolIcon,
    value: "100%",
    title: "Своё производство",
    desc: "Полный цикл: раскрой, пошив, контроль качества и упаковка.",
  },
  {
    icon: ArrowRight,
    value: "РФ + СНГ",
    title: "Доставка",
    desc: "Отправляем транспортными компаниями по России и странам СНГ.",
  },
    {
      icon: PinIcon,
      value: "Бишкек",
      title: "Производство",
      desc: "Швейный цех в Кыргызстане — честная цена напрямую с фабрики.",
    },
  ];
}

type ReviewItem = Pick<Review, "name" | "city" | "text" | "rating">;

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    text: "Заказывали поло и футболки на пробную партию — качество пошива отличное, размеры в норму. Уже сделали повторный заказ.",
    name: "Алексей",
    city: "Москва",
    rating: 5,
  },
  {
    text: "Удобно, что можно собрать разные цвета и размеры в одну поставку. Менеджер быстро отвечает в Telegram, прайс прислали сразу.",
    name: "Марина",
    city: "Казань",
    rating: 5,
  },
  {
    text: "Берём худи и спортивные костюмы регулярно. Цена от цеха ниже рынка, доставка до Екатеринбурга без задержек.",
    name: "Дмитрий",
    city: "Екатеринбург",
    rating: 5,
  },
];

export function TrustBlock({
  reviews,
  experienceText,
}: {
  reviews?: ReviewItem[];
  experienceText?: string | null;
}) {
  const PILLARS = pillars(experienceText || "5+ лет");
  const REVIEWS = reviews && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  return (
    <section className="container-px py-16 lg:py-24">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow mb-3">Почему нам доверяют</span>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Работаем напрямую и отвечаем за результат
        </h2>
      </div>

      {/* Столпы доверия */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-signal-soft text-signal">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-4 font-display text-2xl font-bold">{p.value}</p>
              <h3 className="mt-1 font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Отзывы */}
      <div className="mt-12">
        <div className="mb-6 flex items-end justify-between">
          <h3 className="font-display text-2xl font-bold">Отзывы клиентов</h3>
          <span className="hidden text-sm text-muted sm:block">Оптовые клиенты из России и СНГ</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <figure key={`${r.name}-${i}`} className="card flex flex-col p-6">
              <div className="mb-3 flex gap-0.5 text-signal" aria-hidden>
                {Array.from({ length: Math.max(1, Math.min(5, r.rating || 5)) }).map((_, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-ink/85">
                «{r.text}»
              </blockquote>
              <figcaption className="mt-4 border-t border-line pt-3 text-sm">
                <span className="font-semibold">{r.name}</span>
                <span className="text-muted"> · {r.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
