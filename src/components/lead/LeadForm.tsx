"use client";

import { useState } from "react";
import { CheckIcon, TelegramIcon } from "@/components/ui/Icons";
import type { Product } from "@/lib/types";

interface LeadFormProps {
  product?: Pick<Product, "id" | "title" | "article" | "sizes" | "colors">;
  type?: "product" | "price" | "cart";
  cartSummary?: string;
  onSuccess?: () => void;
}

export function LeadForm({ product, type = "product", cartSummary, onSuccess }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

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
      color: String(fd.get("color") ?? ""),
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
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="lf-color">Цвет</label>
            <input
              id="lf-color"
              name="color"
              list="lf-colors"
              maxLength={120}
              className="field"
              placeholder="Чёрный"
            />
            {product?.colors?.length ? (
              <datalist id="lf-colors">
                {product.colors.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            ) : null}
          </div>
          <div>
            <label className="label" htmlFor="lf-size">Размер</label>
            <input
              id="lf-size"
              name="size"
              list="lf-sizes"
              maxLength={120}
              className="field"
              placeholder="46–54"
            />
            {product?.sizes?.length ? (
              <datalist id="lf-sizes">
                {product.sizes.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            ) : null}
          </div>
          <div>
            <label className="label" htmlFor="lf-qty">Кол-во, шт</label>
            <input id="lf-qty" name="quantity" maxLength={60} className="field" placeholder="100" />
          </div>
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
