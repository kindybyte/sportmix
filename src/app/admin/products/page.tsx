import Link from "next/link";
import Image from "next/image";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { PRODUCT_STATUS_LABEL } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { SpoolIcon } from "@/components/ui/Icons";
import {
  deleteProductAction,
  toggleProductVisibilityAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const sb = createServerSupabase();
  const { data } = await sb
    .from("products")
    .select("*, category:categories(title), images:product_images(image_url, sort_order)")
    .order("created_at", { ascending: false });

  const products = ((data as Product[]) ?? []).map((p) => {
    p.images = (p.images ?? []).sort((a, b) => a.sort_order - b.sort_order);
    return p;
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Товары</h1>
          <p className="mt-1 text-muted">Всего: {products.length}</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-signal btn-md">
          + Добавить товар
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card mt-8 grid place-items-center py-16 text-center">
          <p className="font-display text-lg font-semibold">Товаров пока нет</p>
          <p className="mt-2 text-sm text-muted">Добавьте первый товар — он сразу появится в каталоге.</p>
          <Link href="/admin/products/new" className="btn btn-primary btn-md mt-5">+ Добавить товар</Link>
        </div>
      ) : (
        <div className="mt-8 card divide-y divide-line">
          {products.map((p) => {
            const cover = p.images?.[0]?.image_url;
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-line/40">
                  {cover ? (
                    <Image src={cover} alt={p.title} fill sizes="56px" className="object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-muted/50">
                      <SpoolIcon className="h-5 w-5" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="font-semibold hover:text-signal">
                      {p.title}
                    </Link>
                    {p.is_new && <span className="rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-paper">Новинка</span>}
                    {p.is_popular && <span className="rounded bg-signal px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Хит</span>}
                    {!p.is_visible && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">Скрыт</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {p.article ? `Арт. ${p.article} · ` : ""}
                    {p.category?.title ?? "Без категории"} · {PRODUCT_STATUS_LABEL[p.status]} · {formatPrice(p.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/products/${p.id}/edit`} className="btn btn-outline btn-md text-[13px]">
                    Изменить
                  </Link>
                  <form action={toggleProductVisibilityAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="is_visible" value={String(p.is_visible)} />
                    <button className="btn btn-ghost btn-md text-[13px]" title={p.is_visible ? "Скрыть с сайта" : "Показать на сайте"}>
                      {p.is_visible ? "Скрыть" : "Показать"}
                    </button>
                  </form>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="btn btn-ghost btn-md text-[13px] text-red-600 hover:bg-red-50">
                      Удалить
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
