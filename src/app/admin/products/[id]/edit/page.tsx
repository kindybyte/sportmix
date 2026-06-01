import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const sb = createServerSupabase();
  const [{ data: product }, { data: categories }] = await Promise.all([
    sb
      .from("products")
      .select("*, images:product_images(*)")
      .eq("id", params.id)
      .maybeSingle(),
    sb.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  const typed = product as Product;
  typed.images = (typed.images ?? []).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">← Назад к товарам</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Редактирование товара</h1>
      <p className="mt-1 text-muted">{typed.title}</p>
      <div className="mt-8">
        <ProductForm categories={(categories as Category[]) ?? []} product={typed} />
      </div>
    </div>
  );
}
