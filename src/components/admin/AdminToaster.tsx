"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";

const MESSAGES: Record<string, string> = {
  "product-saved": "Товар сохранён",
  "product-deleted": "Товар удалён",
  visibility: "Видимость товара обновлена",
  "category-saved": "Категория сохранена",
  "category-deleted": "Категория удалена",
  "lead-updated": "Статус заявки обновлён",
  "lead-deleted": "Заявка удалена",
  "settings-saved": "Настройки сохранены",
  "photo-saved": "Фото сохранено",
  "photo-deleted": "Фото удалено",
  "review-saved": "Отзыв сохранён",
  "review-deleted": "Отзыв удалён",
};

function ToasterInner() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const toastKey = params.get("toast");

  // Показываем сообщение и сразу чистим ?toast= из URL
  useEffect(() => {
    if (!toastKey) return;
    setMessage(MESSAGES[toastKey] ?? "Готово");

    const next = new URLSearchParams(params.toString());
    next.delete("toast");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastKey]);

  // Автозакрытие — отдельный эффект, привязан к сообщению,
  // поэтому смена URL его не сбрасывает.
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3200);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center px-4 sm:left-auto sm:right-5 sm:justify-end">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-lift animate-fade-up">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="h-4 w-4" />
        </span>
        <span className="text-sm font-medium text-ink">{message}</span>
        <button
          onClick={() => setMessage(null)}
          aria-label="Закрыть"
          className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-ink/5"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function AdminToaster() {
  return (
    <Suspense fallback={null}>
      <ToasterInner />
    </Suspense>
  );
}
