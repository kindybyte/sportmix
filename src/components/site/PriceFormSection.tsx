import { LeadForm } from "@/components/lead/LeadForm";
import { CheckIcon } from "@/components/ui/Icons";

const BENEFITS = [
  "Актуальные оптовые цены на все модели",
  "Наличие и сроки производства",
  "Условия и стоимость доставки в ваш город",
  "Ответ в течение рабочего дня",
];

export function PriceFormSection() {
  return (
    <section id="price" className="container-px py-16 lg:py-24">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="grid lg:grid-cols-2">
          {/* Левая часть — оффер */}
          <div className="flex flex-col justify-center bg-ink p-8 text-paper sm:p-10 lg:p-12">
            <span className="eyebrow mb-4 text-signal">
              <span className="h-px w-8 bg-signal" />
              Оптовый прайс
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              Получить оптовый прайс-лист
            </h2>
            <p className="mt-4 max-w-md text-paper/70">
              Оставьте контакт — пришлём полный прайс SportMix с актуальными
              ценами, наличием и условиями доставки. Без звонков и спама.
            </p>
            <ul className="mt-7 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-paper/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal/20 text-signal">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Правая часть — форма */}
          <div className="p-6 sm:p-10 lg:p-12">
            <h3 className="mb-1 font-display text-xl font-bold">Заявка на прайс</h3>
            <p className="mb-6 text-sm text-muted">
              Заполните 2 поля — остальное уточнит менеджер.
            </p>
            <LeadForm type="price" />
          </div>
        </div>
      </div>
    </section>
  );
}
