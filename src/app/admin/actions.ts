"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { LeadStatus, ProductStatus } from "@/lib/types";

async function requireAuth() {
  const sb = createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return sb;
}

function splitList(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value)
    .split(/[,\n;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function str(value: FormDataEntryValue | null): string | null {
  const s = value ? String(value).trim() : "";
  return s.length ? s : null;
}

// ─────────────────────── AUTH ───────────────────────
export async function signOutAction() {
  const sb = createServerSupabase();
  await sb.auth.signOut();
  redirect("/admin/login");
}

// ─────────────────────── PRODUCTS ───────────────────
export async function saveProductAction(formData: FormData) {
  const sb = await requireAuth();

  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) throw new Error("Укажите название товара");

  let slug = str(formData.get("slug")) || slugify(title);

  const priceRaw = str(formData.get("price"));
  const price = priceRaw ? Number(priceRaw.replace(/[^\d.]/g, "")) : null;

  const moqRaw = str(formData.get("min_order_quantity"));
  const min_order_quantity = moqRaw ? parseInt(moqRaw, 10) : null;

  const imagesRaw = str(formData.get("images"));
  let images: string[] = [];
  try {
    images = imagesRaw ? JSON.parse(imagesRaw) : [];
  } catch {
    images = [];
  }

  const payload = {
    title,
    slug,
    article: str(formData.get("article")),
    category_id: str(formData.get("category_id")),
    fabric: str(formData.get("fabric")),
    sizes: splitList(formData.get("sizes")),
    colors: splitList(formData.get("colors")),
    price: price != null && !Number.isNaN(price) ? price : null,
    min_order_quantity:
      min_order_quantity != null && !Number.isNaN(min_order_quantity)
        ? min_order_quantity
        : null,
    description: str(formData.get("description")),
    status: (str(formData.get("status")) ?? "in_stock") as ProductStatus,
    season: str(formData.get("season")),
    gender: str(formData.get("gender")) ?? "Мужской",
    origin: str(formData.get("origin")) ?? "Кыргызстан",
    is_new: formData.get("is_new") === "on",
    is_popular: formData.get("is_popular") === "on",
    is_visible: formData.get("is_visible") === "on",
  };

  let productId = id;

  if (id) {
    const { error } = await sb.from("products").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    // гарантируем уникальность slug
    const { data: existing } = await sb
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const { data, error } = await sb
      .from("products")
      .insert({ ...payload, slug })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  // Пересобираем галерею изображений
  if (productId) {
    await sb.from("product_images").delete().eq("product_id", productId);
    if (images.length) {
      await sb.from("product_images").insert(
        images.map((url, i) => ({
          product_id: productId,
          image_url: url,
          sort_order: i,
        }))
      );
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    await sb.from("products").delete().eq("id", id);
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
  }
}

export async function toggleProductVisibilityAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  const visible = formData.get("is_visible") === "true";
  if (id) {
    await sb.from("products").update({ is_visible: !visible }).eq("id", id);
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
  }
}

// ─────────────────────── CATEGORIES ─────────────────
export async function saveCategoryAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) throw new Error("Укажите название категории");
  const slug = str(formData.get("slug")) || slugify(title);
  const sort_order = parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  const is_visible = formData.get("is_visible") === "on";

  const payload = { title, slug, sort_order, is_visible };

  if (id) {
    await sb.from("categories").update(payload).eq("id", id);
  } else {
    await sb.from("categories").insert(payload);
  }
  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
  revalidatePath("/");
}

export async function deleteCategoryAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    await sb.from("categories").delete().eq("id", id);
    revalidatePath("/admin/categories");
    revalidatePath("/catalog");
  }
}

// ─────────────────────── LEADS ──────────────────────
export async function updateLeadStatusAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  const status = str(formData.get("status")) as LeadStatus | null;
  if (id && status) {
    await sb.from("leads").update({ status }).eq("id", id);
    revalidatePath("/admin/leads");
  }
}

export async function deleteLeadAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    await sb.from("leads").delete().eq("id", id);
    revalidatePath("/admin/leads");
  }
}

// ─────────────────────── SETTINGS ───────────────────
export async function saveSettingsAction(formData: FormData) {
  const sb = await requireAuth();
  const payload = {
    id: 1,
    company_name: str(formData.get("company_name")) ?? "SportMix",
    telegram_username: str(formData.get("telegram_username")),
    whatsapp_number: str(formData.get("whatsapp_number")),
    city: str(formData.get("city")),
    delivery_text: str(formData.get("delivery_text")),
    about_text: str(formData.get("about_text")),
    logo_url: str(formData.get("logo_url")),
    experience_text: str(formData.get("experience_text")),
  };
  await sb.from("settings").upsert(payload, { onConflict: "id" });
  revalidatePath("/", "layout");
}

// ─────────────────────── PRODUCTION PHOTOS ──────────
export async function saveProductionPhotoAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  const section = (str(formData.get("section")) ?? "gallery") as "step" | "gallery";
  const sort_order = parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  const payload = {
    section,
    title: str(formData.get("title")),
    description: str(formData.get("description")),
    image_url: str(formData.get("image_url")),
    sort_order,
    is_visible: formData.get("is_visible") === "on",
  };
  if (id) {
    await sb.from("production_photos").update(payload).eq("id", id);
  } else {
    await sb.from("production_photos").insert(payload);
  }
  revalidatePath("/admin/production");
  revalidatePath("/production");
}

export async function deleteProductionPhotoAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    await sb.from("production_photos").delete().eq("id", id);
    revalidatePath("/admin/production");
    revalidatePath("/production");
  }
}

// ─────────────────────── REVIEWS ────────────────────
export async function saveReviewAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  const text = str(formData.get("text"));
  if (!name || !text) throw new Error("Укажите имя и текст отзыва");
  const ratingRaw = parseInt(String(formData.get("rating") ?? "5"), 10);
  const rating = Math.min(5, Math.max(1, Number.isNaN(ratingRaw) ? 5 : ratingRaw));
  const payload = {
    name,
    city: str(formData.get("city")),
    text,
    rating,
    sort_order: parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    is_visible: formData.get("is_visible") === "on",
  };
  if (id) {
    await sb.from("reviews").update(payload).eq("id", id);
  } else {
    await sb.from("reviews").insert(payload);
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReviewAction(formData: FormData) {
  const sb = await requireAuth();
  const id = str(formData.get("id"));
  if (id) {
    await sb.from("reviews").delete().eq("id", id);
    revalidatePath("/admin/reviews");
    revalidatePath("/");
  }
}
