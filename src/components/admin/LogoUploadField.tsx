"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
const MAX_SIZE = 2 * 1024 * 1024;

export function LogoUploadField({ initialUrl }: { initialUrl: string | null }) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!ALLOWED.includes(file.type)) {
      setError("Допустимы PNG, JPG, WebP, SVG.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Файл больше 2 МБ.");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const path = `logo/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: true });
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
      <label className="label">Логотип</label>
      <input type="hidden" name="logo_url" value={url ?? ""} />
      <div className="flex items-center gap-4">
        {url && (
          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-line bg-white">
            <Image src={url} alt="Логотип" fill sizes="56px" className="object-contain p-1" />
          </div>
        )}
        <label className="btn btn-outline btn-md cursor-pointer">
          <input
            type="file"
            accept={ALLOWED.join(",")}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {uploading ? "Загрузка…" : url ? "Заменить" : "Загрузить логотип"}
        </label>
        {url && (
          <button type="button" onClick={() => setUrl(null)} className="text-sm text-red-600 hover:underline">
            Удалить
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
