import { createPublicSupabase } from "@/lib/supabase/server";
import type { Category, Product, Settings } from "@/lib/types";

const PRODUCT_SELECT = "*, category:categories(*), images:product_images(*)";

function sortImages(product: Product): Product {
  if (product.images) {
    product.images = [...product.images].sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }
  return product;
}

export async function getSettings(): Promise<Settings | null> {
  const sb = createPublicSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb.from("settings").select("*").eq("id", 1).single();
    return (data as Settings) ?? null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  const sb = createPublicSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("categories")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  const sb = createPublicSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });
    return ((data as Product[]) ?? []).map(sortImages);
  } catch {
    return [];
  }
}

export async function getNewProducts(limit = 8): Promise<Product[]> {
  const sb = createPublicSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_visible", true)
      .order("is_new", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);
    return ((data as Product[]) ?? []).map(sortImages);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sb = createPublicSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("is_visible", true)
      .maybeSingle();
    return data ? sortImages(data as Product) : null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const sb = createPublicSupabase();
  if (!sb) return [];
  try {
    let query = sb
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_visible", true)
      .neq("id", product.id)
      .limit(limit);
    if (product.category_id) query = query.eq("category_id", product.category_id);
    const { data } = await query;
    return ((data as Product[]) ?? []).map(sortImages);
  } catch {
    return [];
  }
}

export async function getAllProductSlugs(): Promise<string[]> {
  const sb = createPublicSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("products")
      .select("slug")
      .eq("is_visible", true);
    return (data ?? []).map((r: { slug: string }) => r.slug);
  } catch {
    return [];
  }
}
