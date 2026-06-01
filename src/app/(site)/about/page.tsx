import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/queries";
import { ArrowRight, SpoolIcon } from "@/components/ui/Icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "О нас — швейный цех в Кыргызстане",
  description:
    "SportMix — швейный цех полного цикла в Бишкеке. Производим мужскую одежду оптом: футболки, поло, батники, худи, спортивные костюмы. Отправка в Россию и СНГ.",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { t: "Полный цикл", d: "От закупки ткани и раскроя до пошива, упаковки и отгрузки." },
  { t: "Опт от производителя", d: "Работаем напрямую с оптовыми клиентами — без наценок посредников." },
  { t: "Качество ткани", d: "Холодок, кулир, футер, трёхнитка — подбираем под модель и сезон." },
  { t: "Гибкость по партии", d: "Разные цвета и размеры в одной поставке под ваш заказ." },
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="container-px py-12 lg:py-16">
      <div className="max-w-3xl">
        <span className="eyebrow mb-3">О компании</span>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          {settings?.company_name ?? "SportMix"} — швейный цех мужской одежды
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink/80">
          {settings?.about_text ??
            "SportMix — швейный цех полного цикла в Кыргызстане. Производим мужскую одежду оптом и отправляем напрямую клиентам из России и стран СНГ."}
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Мы специализируемся на базовых и трендовых моделях мужской одежды:
          футболки, поло, батники, худи и спортивные костюмы. Собственное
          производство позволяет держать честную оптовую цену, быстро запускать
          новые модели и выполнять заказы в нужных цветах и размерах.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.t} className="card p-6">
            <SpoolIcon className="h-7 w-7 text-signal" />
            <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/catalog" className="btn btn-primary btn-lg">
          Смотреть каталог <ArrowRight className="h-5 w-5" />
        </Link>
        <Link href="/how-to-order" className="btn btn-outline btn-lg">
          Как заказать
        </Link>
      </div>
    </div>
  );
}
