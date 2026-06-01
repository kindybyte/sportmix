"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { Modal } from "@/components/ui/Modal";
import { LeadForm } from "@/components/lead/LeadForm";
import { HeartIcon, ArrowRight, TelegramIcon, CloseIcon, SpoolIcon } from "@/components/ui/Icons";

export default function FavoritesPage() {
  const { items, remove, clear, ready } = useFavorites();
  const [open, setOpen] = useState(false);

  const cartSummary =
    "Интересующие модели:\n" +
    items
      .map((i, idx) => `${idx + 1}. ${i.title}${i.article ? ` (${i.article})` : ""}`)
      .join("\n");

  return (
    <div className="container-px py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow mb-3">Избранное</span>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Список интересующих моделей</h1>
          <p className="mt-3 max-w-xl text-muted">
            Соберите несколько моделей и отправьте одну общую заявку — менеджер
            подготовит прайс и условия сразу по всем позициям.
          </p>
        </div>
        {ready && items.length > 0 && (
          <button onClick={clear} className="btn btn-ghost btn-md text-muted">
            Очистить список
          </button>
        )}
      </div>

      {!ready ? null : items.length === 0 ? (
        <div className="card mt-10 grid place-items-center py-20 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-signal-soft text-signal">
            <HeartIcon className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold">В избранном пока пусто</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Добавляйте понравившиеся модели из каталога — нажимайте на сердечко на карточке товара.
          </p>
          <Link href="/catalog" className="btn btn-primary btn-lg mt-6">
            Перейти в каталог <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="card flex items-center gap-4 p-3">
                <Link href={`/product/${item.slug}`} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-line/40">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-muted/50">
                      <SpoolIcon className="h-6 w-6" />
                    </span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} className="block truncate font-display font-semibold hover:text-signal">
                    {item.title}
                  </Link>
                  {item.article && <span className="text-xs text-muted">Арт. {item.article}</span>}
                </div>
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Убрать"
                  className="btn btn-ghost h-9 w-9 shrink-0 rounded-full p-0 text-muted"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setOpen(true)} className="btn btn-signal btn-lg">
              <TelegramIcon className="h-5 w-5" />
              Отправить общую заявку ({items.length})
            </button>
            <Link href="/catalog" className="btn btn-outline btn-lg">
              Добавить ещё <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <Modal open={open} onClose={() => setOpen(false)} title="Заявка по избранному">
            <p className="-mt-2 mb-5 text-sm text-muted">
              В заявку войдут {items.length} выбранных моделей. Менеджер подготовит
              цены и условия по всем позициям.
            </p>
            <LeadForm type="cart" cartSummary={cartSummary} onSuccess={clear} />
          </Modal>
        </>
      )}
    </div>
  );
}
