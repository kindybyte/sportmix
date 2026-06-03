const FAQ: { q: string; a: string }[] = [
  {
    q: "Какая минимальная партия?",
    a: "Продаём пачками — полным размерным рядом. Минимум обычно от 10–30 штук в зависимости от модели; точное количество по конкретному товару подскажет менеджер.",
  },
  {
    q: "Можно ли заказать образцы?",
    a: "Да, перед оптовым заказом можно заказать образцы, чтобы оценить ткань и пошив. Условия и стоимость уточняйте у менеджера.",
  },
  {
    q: "Есть ли готовое наличие?",
    a: "Часть моделей всегда есть в наличии — они отмечены статусом «В наличии» в каталоге. Остальное шьём под заказ. Актуальное наличие подтвердит менеджер.",
  },
  {
    q: "Можно ли заказать свои цвета?",
    a: "Да. Под партию подбираем нужные цвета из доступной палитры ткани. Напишите, какие цвета нужны — проверим возможность.",
  },
  {
    q: "Делаете ли брендирование?",
    a: "Да, делаем брендирование: бирки, принты, нашивки, индивидуальная упаковка. Расскажите задачу — подберём подходящий вариант.",
  },
  {
    q: "Как происходит доставка в Россию?",
    a: "Отправляем транспортными компаниями по России и странам СНГ. Сроки и стоимость рассчитываем индивидуально под ваш город и объём, после отгрузки присылаем трек-номер.",
  },
  {
    q: "Какие сроки производства?",
    a: "Зависят от объёма партии и модели — обычно от нескольких дней до пары недель. Точный срок называем при согласовании заказа.",
  },
  {
    q: "Можно ли получить фото/видео перед отправкой?",
    a: "Да. Перед отгрузкой пришлём фото и видео готовой партии, чтобы вы убедились в качестве.",
  },
  {
    q: "Как получить прайс?",
    a: "Нажмите «Получить прайс» или напишите нам в Telegram / WhatsApp — отправим актуальный прайс-лист с ценами и наличием.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group card p-5 transition-colors hover:border-ink/40">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold">
        {q}
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-signal-soft text-lg leading-none text-signal transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{a}</p>
    </details>
  );
}

export function FaqSection() {
  const mid = Math.ceil(FAQ.length / 2);
  const columns = [FAQ.slice(0, mid), FAQ.slice(mid)];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="container-px py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow mb-3">Вопросы и ответы</span>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Частые вопросы</h2>
        <p className="mt-3 text-muted">
          Коротко о самом важном для оптовых клиентов. Не нашли ответ — напишите нам.
        </p>
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-2">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-3">
            {col.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
