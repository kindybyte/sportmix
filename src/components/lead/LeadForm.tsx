"use client";

import { useState } from "react";
import { CheckIcon, TelegramIcon } from "@/components/ui/Icons";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LeadFormProps {
  product?: Pick<Product, "id" | "title" | "article" | "sizes" | "colors">;
  type?: "product" | "price" | "cart";
  cartSummary?: string;
  onSuccess?: () => void;
}

/**
 * Размерные ряды (пачки). Если у товара уже заданы диапазоны
 * (например «46-54»), берём их как есть. Если перечислены отдельные
 * размеры — собираем один полный ряд min–max.
 */
function buildSizeRanges(sizes: string[] = []): string[] {
  const clean = sizes.map((s) => s.trim()).filter(Boolean);
  if (!clean.length) return [];
  if (clean.some((s) => /[-–—]/.test(s))) return clean;
  return clean.length > 1 ? [`${clean[0]}–${clean[clean.length - 1]}`] : clean;
}

export function LeadForm({ product, type = "product", cartSummary, onSuccess }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const sizeRanges = buildSizeRanges(product?.sizes);
  const colorOptions = product?.colors ?? [];

  function toggleColor(color: string) {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = {
      client_name: String(fd.get("client_name") ?? ""),
      city: String(fd.get("city") ?? ""),
      contact: String(fd.get("contact") ?? ""),
      color: colorOptions.length
        ? selectedColors.join(", ")
        : String(fd.get("color") ?? ""),
      size: String(fd.get("size") ?? ""),
      quantity: String(fd.get("quantity") ?? ""),
      comment: String(fd.get("comment") ?? ""),
      website: String(fd.get("website") ?? ""), // honeypot
      type,
      product_id: product?.id ?? "",
      product_title: product?.title ?? (cartSummary ? "Список избранного" : ""),
      product_article: product?.article ?? "",
    };
    if (cartSummary) {
      payload.comment = [cartSummary, payload.comment].filter(Boolean).join("\n\n");
    }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "Не удалось отправить заявку. Попробуйте позже.");
        return;
      }
      setStatus("done");
      onSuccess?.();
    } catch {
      setStatus("error");
      setError("Ошибка сети. Проверьте подключение и попробуйте снова.");
    }
  }

  if (status === "done") {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h4 className="font-display text-lg font-bold">Заявка отправлена!</h4>
        <p className="mt-2 text-sm text-muted">
          Менеджер SportMix свяжется с вами в ближайшее время и уточнит наличие,
          цену и доставку.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {product && (
        <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm">
          <span className="text-muted">Товар: </span>
          <span className="font-semibold">{product.title}</span>
          {product.article && (
            <span className="text-muted"> · {product.article}</span>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="lf-name">Ваше имя *</label>
          <input id="lf-name" name="client_name" required maxLength={80} className="field" placeholder="Иван" />
        </div>
        <div>
          <label className="label" htmlFor="lf-city">Город</label>
          <input id="lf-city" name="city" maxLength={80} className="field" placeholder="Москва" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="lf-contact">Telegram или WhatsApp *</label>
        <input id="lf-contact" name="contact" required maxLength={120} className="field" placeholder="@username или +7 900 000-00-00" />
      </div>

      {type === "product" && (
        <div className="space-y-4">
          {/* Цвета — можно выбрать несколько */}
          <div>
            <label className="label">
              Цвет
              {colorOptions.length > 0 && (
                <span className="ml-1 font-normal text-muted">
                  · можно несколько{selectedColors.length ? ` (выбрано ${selectedColors.length})` : ""}
                </span>
              )}
            </label>
            {colorOptions.length ? (
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => {
                  const active = selectedColors.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleColor(c)}
                      aria-pressed={active}
                      className={cn("chip", active && "chip-active")}
                    >
                      {active && <CheckIcon className="h-3.5 w-3.5" />}
                      {c}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input id="lf-color" name="color" maxLength={200} className="field" placeholder="Белый, чёрный…" />
            )}
          </div>

          {/* Размерный ряд + количество */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="lf-size">Размерный ряд</label>
              {sizeRanges.length ? (
                <select
                  id="lf-size"
                  name="size"
                  defaultValue={sizeRanges.length === 1 ? sizeRanges[0] : ""}
                  className="field"
                >
                  {sizeRanges.length > 1 && <option value="">Выберите ряд</option>}
                  {sizeRanges.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              ) : (
                <input id="lf-size" name="size" maxLength={120} className="field" placeholder="46–54" />
              )}
            </div>
            <div>
              <label className="label" htmlFor="lf-qty">Кол-во, пачек</label>
              <input id="lf-qty" name="quantity" maxLength={60} className="field" placeholder="10" />
            </div>
          </div>

          <p className="text-xs text-muted">
            Продаём пачками: в одной пачке — полный размерный ряд. Количество указывайте в пачках.
          </p>
        </div>
      )}

      <div>
        <label className="label" htmlFor="lf-comment">Комментарий</label>
        <textarea
          id="lf-comment"
          name="comment"
          rows={3}
          maxLength={1000}
          className="field resize-none"
          placeholder="Интересует цена с доставкой…"
        />
      </div>

      {/* honeypot — скрыто от пользователей, ловит ботов */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-signal btn-lg w-full"
      >
        <TelegramIcon className="h-5 w-5" />
        {status === "loading" ? "Отправляем…" : "Отправить заявку в Telegram"}
      </button>

      <p className="text-center text-xs text-muted">
        Нажимая кнопку, вы соглашаетесь на обработку контактных данных для связи.
      </p>
    </form>
  );
}
