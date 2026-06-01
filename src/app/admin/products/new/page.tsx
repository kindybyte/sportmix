import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const sb = createServerSupabase();
  const { data } = await sb
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">← Назад к товарам</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Новый товар</h1>
      <p className="mt-1 text-muted">Заполните поля и сохраните — товар сразу появится в каталоге.</p>
      <div className="mt-8">
        <ProductForm categories={(data as Category[]) ?? []} />
      </div>
    </div>
  );
}
