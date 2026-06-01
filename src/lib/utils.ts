import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Транслитерация кириллицы → латиница для slug. */
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "Цена по запросу";
  return (
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(price) +
    " ₽"
  );
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Чистый Telegram username без @ и ссылок. */
export function cleanTelegram(value: string | null | undefined): string | null {
  if (!value) return null;
  return value.replace(/^@/, "").replace(/^https?:\/\/t\.me\//, "").trim();
}

export function telegramLink(username: string | null | undefined): string | null {
  const clean = cleanTelegram(username);
  return clean ? `https://t.me/${clean}` : null;
}

export function whatsappLink(number: string | null | undefined): string | null {
  if (!number) return null;
  const digits = number.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
