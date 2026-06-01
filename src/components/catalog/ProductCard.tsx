import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ArrowRight } from "@/components/ui/Icons";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0]?.image_url ?? null;
  return (
    <article className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[4/5] overflow-hidden bg-line/40">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <ProductImage
            src={cover}
            alt={product.title}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>

        {/* Метки */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-paper">
              Новинка
            </span>
          )}
          {product.is_popular && (
            <span className="rounded-full bg-signal px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Хит продаж
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <FavoriteButton
            item={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              article: product.article,
              image: cover,
            }}
          />
        </div>

        <div className="absolute bottom-3 left-3">
          <StatusBadge status={product.status} />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          {product.category?.title && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {product.category.title}
            </span>
          )}
          <h3 className="mt-0.5 font-display text-base font-semibold leading-snug">
            <Link href={`/product/${product.slug}`} className="hover:text-signal">
              {product.title}
            </Link>
          </h3>
        </div>

        <dl className="space-y-1 text-[13px] text-muted">
          {product.fabric && (
            <div className="flex gap-1.5">
              <dt className="text-muted/70">Ткань:</dt>
              <dd className="text-ink/80">{product.fabric}</dd>
            </div>
          )}
          {product.sizes?.length > 0 && (
            <div className="flex gap-1.5">
              <dt className="text-muted/70">Размеры:</dt>
              <dd className="text-ink/80">{product.sizes.join(", ")}</dd>
            </div>
          )}
          {product.colors?.length > 0 && (
            <div className="flex gap-1.5">
              <dt className="text-muted/70">Цвета:</dt>
              <dd className="text-ink/80 line-clamp-1">{product.colors.join(", ")}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <span className="block text-[11px] text-muted">Опт. цена</span>
            <span className="font-display text-lg font-bold">
              {formatPrice(product.price)}
            </span>
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="btn btn-outline btn-md text-[13px]"
          >
            Подробнее
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
