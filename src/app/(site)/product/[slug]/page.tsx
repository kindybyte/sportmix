import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getSettings,
} from "@/lib/queries";
import { PRODUCT_STATUS_LABEL } from "@/lib/types";
import { formatPrice, siteUrl } from "@/lib/utils";
import { Gallery } from "@/components/product/Gallery";
import { CopyLinkButton } from "@/components/product/CopyLinkButton";
import { LeadButton } from "@/components/lead/LeadButton";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ArrowRight, TelegramIcon } from "@/components/ui/Icons";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Товар не найден" };
  const desc =
    product.description?.slice(0, 160) ||
    `${product.title} оптом от швейного цеха SportMix. ${product.fabric ? "Ткань: " + product.fabric + ". " : ""}Размеры: ${product.sizes.join(", ")}. Производство — Кыргызстан.`;
  const image = product.images?.[0]?.image_url;
  return {
    title: `${product.title} — оптом`,
    description: desc,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.title} оптом · SportMix`,
      description: desc,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) =>
  value ? (
    <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  ) : null;

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProducts(product, 4),
    getSettings(),
  ]);

  const images = (product.images ?? []).map((i) => i.image_url);
  const url = `${siteUrl()}/product/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.article ?? undefined,
    category: product.category?.title,
    description: product.description ?? undefined,
    image: images.length ? images : undefined,
    brand: { "@type": "Brand", name: settings?.company_name ?? "SportMix" },
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "RUB",
          availability:
            product.status === "in_stock"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
        }
      : undefined,
  };

  return (
    <div className="container-px py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Хлебные крошки */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-ink">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-ink">Каталог</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-ink">
              {product.category.title}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gallery images={images} title={product.title} />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={product.status} />
            {product.is_new && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase text-paper">Новинка</span>
            )}
            {product.is_popular && (
              <span className="rounded-full bg-signal px-2.5 py-1 text-[11px] font-bold uppercase text-white">Хит продаж</span>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            {product.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            {product.article && <span>Артикул: <span className="font-medium text-ink">{product.article}</span></span>}
            {product.category && <span>Категория: <span className="font-medium text-ink">{product.category.title}</span></span>}
          </div>

          {/* Цена */}
          <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2 rounded-2xl border border-line bg-panel p-5">
            <div>
              <span className="block text-xs text-muted">Оптовая цена</span>
              <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
            </div>
            {product.min_order_quantity ? (
              <div>
                <span className="block text-xs text-muted">Минимальная партия</span>
                <span className="font-display text-xl font-semibold">от {product.min_order_quantity} шт</span>
              </div>
            ) : null}
          </div>

          {/* Цвета и размеры */}
          {product.colors.length > 0 && (
            <div className="mt-6">
              <span className="label">Доступные цвета</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            </div>
          )}
          {product.sizes.length > 0 && (
            <div className="mt-4">
              <span className="label">Размерный ряд</span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Действия */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <LeadButton
              product={product}
              className="btn-signal btn-lg sm:col-span-2"
            >
              <TelegramIcon className="h-5 w-5" />
              Отправить заявку в Telegram
            </LeadButton>
            <FavoriteButton
              variant="full"
              item={{
                id: product.id,
                slug: product.slug,
                title: product.title,
                article: product.article,
                image: images[0] ?? null,
              }}
            />
            <CopyLinkButton url={url} />
          </div>

          {/* Описание */}
          {product.description && (
            <div className="mt-9">
              <h2 className="font-display text-lg font-bold">Описание</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink/80">
                {product.description}
              </p>
            </div>
          )}

          {/* Характеристики */}
          <div className="mt-9">
            <h2 className="font-display text-lg font-bold">Характеристики</h2>
            <dl className="mt-3">
              <Row label="Ткань" value={product.fabric} />
              <Row label="Размерный ряд" value={product.sizes.join(", ")} />
              <Row label="Цвета" value={product.colors.join(", ")} />
              <Row label="Пол" value={product.gender} />
              <Row label="Сезон" value={product.season} />
              <Row label="Производство" value={product.origin} />
              <Row label="Наличие" value={PRODUCT_STATUS_LABEL[product.status]} />
              <Row label="Продажа" value="Оптом" />
            </dl>
          </div>
        </div>
      </div>

      {/* Похожие товары */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Похожие товары</h2>
            <Link href="/catalog" className="btn btn-outline btn-md">
              Весь каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
