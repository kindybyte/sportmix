"use client";

import { useEffect, useState } from "react";
import { TelegramIcon, WhatsappIcon } from "@/components/ui/Icons";

/**
 * Плавающие кнопки связи в правом нижнем углу.
 * Всегда видны при скролле — основной канал заявок с мобильных.
 */
export function FloatingContact({
  whatsapp,
  telegram,
}: {
  whatsapp: string | null;
  telegram: string | null;
}) {
  const [shown, setShown] = useState(false);

  // Лёгкое появление после загрузки
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 400);
    return () => clearTimeout(t);
  }, []);

  if (!whatsapp && !telegram) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-500 sm:bottom-6 sm:right-6 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {telegram && (
        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в Telegram"
          className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#229ED9] text-white shadow-lift transition-transform hover:scale-105 active:scale-95"
        >
          <TelegramIcon className="h-7 w-7" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper opacity-0 shadow-card transition-opacity group-hover:opacity-100 lg:block">
            Написать в Telegram
          </span>
        </a>
      )}

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в WhatsApp"
          className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
          <WhatsappIcon className="relative h-7 w-7" />
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper opacity-0 shadow-card transition-opacity group-hover:opacity-100 lg:block">
            Написать в WhatsApp
          </span>
        </a>
      )}
    </div>
  );
}
