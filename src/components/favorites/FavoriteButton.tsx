"use client";

import { useFavorites, type FavoriteItem } from "./FavoritesProvider";
import { HeartIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  item,
  variant = "icon",
  className,
}: {
  item: FavoriteItem;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { has, toggle, ready } = useFavorites();
  const active = ready && has(item.id);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(item)}
        className={cn(
          "btn btn-lg",
          active ? "bg-signal-soft text-signal" : "btn-outline",
          className
        )}
        aria-pressed={active}
      >
        <HeartIcon filled={active} className="h-5 w-5" />
        {active ? "В избранном" : "Добавить в избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={active}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all",
        active
          ? "border-signal bg-signal text-white"
          : "border-line bg-white/90 text-ink hover:border-ink",
        className
      )}
    >
      <HeartIcon filled={active} className="h-[18px] w-[18px]" />
    </button>
  );
}
