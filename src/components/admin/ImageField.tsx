"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Поле загрузки одного изображения в Supabase Storage.
 * Кладёт публичный URL в скрытый input с указанным name —
 * чтобы значение ушло в серверный action вместе с формой.
 */
export function ImageField({
  name,
  initialUrl = null,
  label = "Фото",
  folder = "production",
}: {
  name: string;
  initialUrl?: string | null;
  label?: string;
  folder?: string;
}) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Только JPG, PNG, WebP, AVIF.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Файл больше 5 МБ.");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {label && <span className="label">{label}</span>}
      <input type="hidden" name={name} value={url ?? ""} />
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-line/30">
          {url ? (
            <Image src={url} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-xs text-muted/50">нет</span>
          )}
        </div>
        <label className="btn btn-outline btn-md cursor-pointer">
          <input
            type="file"
            accept={ALLOWED.join(",")}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {uploading ? "Загрузка…" : url ? "Заменить фото" : "Загрузить фото"}
        </label>
        {url && (
          <button type="button" onClick={() => setUrl(null)} className="text-sm text-red-600 hover:underline">
            Убрать
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
