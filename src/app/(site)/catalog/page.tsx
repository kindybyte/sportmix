import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/queries";
import { CatalogView } from "@/components/catalog/CatalogView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Каталог мужской одежды оптом",
  description:
    "Каталог SportMix: футболки, поло, батники, худи и спортивные костюмы оптом. Фильтры по ткани, размерам, цветам и наличию. Производство в Кыргызстане, доставка в Россию и СНГ.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="container-px py-10 lg:py-14">
      <header className="mb-8">
        <span className="eyebrow mb-3">Каталог</span>
        <h1 className="font-display text-3xl font-bold sm:text-5xl">
          Оптовый каталог SportMix
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Мужская одежда напрямую с производства. Выбирайте модели, добавляйте в
          избранное и отправляйте заявку — менеджер уточнит цену и доставку.
        </p>
      </header>

      <CatalogView
        products={products}
        categories={categories}
        initialCategory={searchParams.category}
        initialSort={searchParams.sort}
      />
    </div>
  );
}
