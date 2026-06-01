"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [null];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-line/40">
        <ProductImage
          src={list[active] ?? null}
          alt={title}
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-line/40 transition-all",
                active === i ? "border-ink ring-2 ring-ink/15" : "border-line hover:border-ink/40"
              )}
            >
              <ProductImage src={src} alt={`${title} — фото ${i + 1}`} sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
