import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/queries";
import { PriceRequestButton } from "@/components/lead/PriceRequestButton";
import { ArrowRight, TelegramIcon } from "@/components/ui/Icons";
import { telegramLink } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Как заказать оптом",
  description:
    "Как сделать оптовый заказ в SportMix: выберите модель, отправьте заявку, согласуйте цвета, размеры и доставку. Отправка в Россию и СНГ.",
  alternates: { canonical: "/how-to-order" },
};

const STEPS = [
  { n: "01", t: "Выберите модель", d: "Откройте каталог, изучите ткани, размеры и цвета. Отметьте интересующие товары в избранное." },
  { n: "02", t: "Отправьте заявку", d: "Нажмите «Отправить заявку» — короткая форма уйдёт менеджеру в Telegram. Можно отправить сразу список из избранного." },
  { n: "03", t: "Менеджер уточнит детали", d: "Подтвердим наличие, актуальную оптовую цену и рассчитаем стоимость доставки до вашего города." },
  { n: "04", t: "Согласование заказа", d: "Фиксируем состав партии: модели, цвета, размеры, количество и сроки производства." },
  { n: "05", t: "Отправка товара", d: "Производим, упаковываем и передаём в доставку. Сообщаем трек-номер для отслеживания." },
];

const FAQ = [
  { q: "Какая минимальная партия?", a: "Зависит от модели — обычно от 10–30 штук. Точное количество подскажет менеджер по конкретному товару." },
  { q: "Можно заказать разные цвета и размеры?", a: "Да. В одной партии можно комбинировать цвета и размеры из доступного ряда." },
  { q: "Как происходит доставка в Россию?", a: "Отправляем транспортными компаниями по России и СНГ. Сроки и стоимость рассчитываем индивидуально." },
  { q: "Как узнать цены?", a: "Нажмите «Получить прайс» или напишите в Telegram — отправим актуальный прайс-лист." },
];

export default async function HowToOrderPage() {
  const settings = await getSettings();
  const tg = telegramLink(settings?.telegram_username);

  return (
    <div className="container-px py-12 lg:py-16">
      <div className="max-w-2xl">
        <span className="eyebrow mb-3">Инструкция</span>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Как заказать</h1>
        <p className="mt-4 text-lg text-muted">
          Пять простых шагов от выбора модели до получения готовой партии.
        </p>
      </div>

      <ol className="mt-12 space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6 sm:flex-row sm:items-center">
            <span className="font-display text-4xl font-bold text-signal sm:w-20">{s.n}</span>
            <div>
              <h3 className="font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/catalog" className="btn btn-primary btn-lg">
          Смотреть каталог <ArrowRight className="h-5 w-5" />
        </Link>
        {tg && (
          <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
            <TelegramIcon className="h-5 w-5" /> Написать в Telegram
          </a>
        )}
        <PriceRequestButton className="btn-signal btn-lg" />
      </div>

      {/* FAQ */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Частые вопросы</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-panel">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display font-semibold">
                {f.q}
                <span className="text-signal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
