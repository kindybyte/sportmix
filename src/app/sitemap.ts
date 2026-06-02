import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/queries";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/production`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/how-to-order`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  let products: MetadataRoute.Sitemap = [];
  let categories: MetadataRoute.Sitemap = [];

  try {
    const slugs = await getAllProductSlugs();
    products = slugs.map((slug) => ({
      url: `${base}/product/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    const cats = await getCategories();
    categories = cats.map((c) => ({
      url: `${base}/catalog?category=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // База ещё не настроена — отдаём статические страницы
  }

  return [...staticPages, ...categories, ...products];
}
