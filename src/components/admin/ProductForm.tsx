"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveProductAction } from "@/app/admin/actions";
import type { Category, Product } from "@/lib/types";
import { CloseIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(
    product?.images?.map((i) => i.image_url) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadError(null);
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED.includes(file.type)) {
        setUploadError("Допустимы только изображения JPG, PNG, WebP, AVIF.");
        continue;
      }
      if (file.size > MAX_SIZE) {
        setUploadError("Файл больше 5 МБ — выберите изображение поменьше.");
        continue;
      }
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) {
        setUploadError(`Ошибка загрузки: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  function move(idx: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  return (
    <form
      action={saveProductAction}
      onSubmit={() => setSubmitting(true)}
      className="space-y-8"
    >
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {/* Основное */}
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Основное</h2>
        <div className="mt-5 grid gap-5">
          <div>
            <label className="label" htmlFor="title">Название товара *</label>
            <input id="title" name="title" required defaultValue={product?.title} className="field" placeholder="Поло холодок" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="article">Артикул</label>
              <input id="article" name="article" defaultValue={product?.article ?? ""} className="field" placeholder="SM-001" />
            </div>
            <div>
              <label className="label" htmlFor="category_id">Категория</label>
              <select id="category_id" name="category_id" defaultValue={product?.category_id ?? ""} className="field">
                <option value="">— без категории —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="slug">URL-адрес (slug)</label>
            <input id="slug" name="slug" defaultValue={product?.slug ?? ""} className="field" placeholder="Оставьте пустым — создастся автоматически" />
            <p className="mt-1 text-xs text-muted">Красивая ссылка на товар, например: /product/polo-holodok</p>
          </div>
        </div>
      </section>

      {/* Фотографии */}
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Фотографии</h2>
        <p className="mt-1 text-sm text-muted">JPG, PNG, WebP или AVIF, до 5 МБ. Первое фото — основное.</p>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((url, idx) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                {idx === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-paper">Основное</span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" onClick={() => move(idx, -1)} className="px-1.5 text-xs text-white">←</button>
                  <button type="button" onClick={() => removeImage(url)} className="px-1.5 text-white">
                    <CloseIcon className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(idx, 1)} className="px-1.5 text-xs text-white">→</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className={cn("mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-white px-4 py-8 text-center transition-colors hover:border-ink", uploading && "pointer-events-none opacity-60")}>
          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED.join(",")}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="font-medium">{uploading ? "Загрузка…" : "Нажмите, чтобы выбрать фото"}</span>
          <span className="mt-1 text-xs text-muted">можно выбрать несколько файлов</span>
        </label>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </section>

      {/* Характеристики */}
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Характеристики</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fabric">Ткань</label>
            <input id="fabric" name="fabric" defaultValue={product?.fabric ?? ""} className="field" placeholder="Холодок" />
          </div>
          <div>
            <label className="label" htmlFor="season">Сезон</label>
            <input id="season" name="season" defaultValue={product?.season ?? ""} className="field" placeholder="Весна / Лето" />
          </div>
          <div>
            <label className="label" htmlFor="sizes">Размеры</label>
            <input id="sizes" name="sizes" defaultValue={product?.sizes?.join(", ") ?? ""} className="field" placeholder="46, 48, 50, 52, 54" />
            <p className="mt-1 text-xs text-muted">Через запятую</p>
          </div>
          <div>
            <label className="label" htmlFor="colors">Цвета</label>
            <input id="colors" name="colors" defaultValue={product?.colors?.join(", ") ?? ""} className="field" placeholder="белый, чёрный, кофе, тёмно-синий" />
            <p className="mt-1 text-xs text-muted">Через запятую</p>
          </div>
          <div>
            <label className="label" htmlFor="gender">Пол</label>
            <input id="gender" name="gender" defaultValue={product?.gender ?? "Мужской"} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="origin">Производство</label>
            <input id="origin" name="origin" defaultValue={product?.origin ?? "Кыргызстан"} className="field" />
          </div>
        </div>
      </section>

      {/* Цена и наличие */}
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Цена и наличие</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">Оптовая цена, ₽</label>
            <input id="price" name="price" inputMode="numeric" defaultValue={product?.price ?? ""} className="field" placeholder="пусто = «по запросу»" />
          </div>
          <div>
            <label className="label" htmlFor="min_order_quantity">Минимальная партия, шт</label>
            <input id="min_order_quantity" name="min_order_quantity" inputMode="numeric" defaultValue={product?.min_order_quantity ?? ""} className="field" placeholder="30" />
          </div>
          <div>
            <label className="label" htmlFor="status">Статус наличия</label>
            <select id="status" name="status" defaultValue={product?.status ?? "in_stock"} className="field">
              <option value="in_stock">В наличии</option>
              <option value="on_order">Под заказ</option>
              <option value="coming_soon">Скоро</option>
            </select>
          </div>
        </div>
      </section>

      {/* Описание */}
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Описание</h2>
        <textarea
          name="description"
          rows={5}
          defaultValue={product?.description ?? ""}
          className="field mt-4 resize-y"
          placeholder="Расскажите о товаре: посадка, плотность ткани, особенности пошива…"
        />
      </section>

      {/* Флаги */}
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Отображение</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Toggle name="is_visible" label="Показывать на сайте" defaultChecked={product ? product.is_visible : true} />
          <Toggle name="is_new" label="Новинка" defaultChecked={product?.is_new ?? false} />
          <Toggle name="is_popular" label="Хит продаж" defaultChecked={product?.is_popular ?? false} />
        </div>
      </section>

      {/* Действия */}
      <div className="sticky bottom-0 -mx-5 flex items-center justify-end gap-3 border-t border-line bg-paper/90 px-5 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-6">
        <button type="button" onClick={() => router.push("/admin/products")} className="btn btn-ghost btn-md">
          Отмена
        </button>
        <button type="submit" disabled={submitting || uploading} className="btn btn-signal btn-lg">
          {submitting ? "Сохраняем…" : "Сохранить товар"}
        </button>
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-signal after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}
