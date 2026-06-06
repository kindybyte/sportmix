"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import {
  HeartIcon,
  MenuIcon,
  CloseIcon,
  WhatsappIcon,
} from "@/components/ui/Icons";
import { cn, whatsappLink } from "@/lib/utils";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/production", label: "Производство" },
  { href: "/about", label: "О нас" },
  { href: "/how-to-order", label: "Как заказать" },
  { href: "/contacts", label: "Контакты" },
];

export function Header({
  companyName,
  whatsappNumber,
  logoUrl,
}: {
  companyName: string;
  whatsappNumber: string | null;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count, ready } = useFavorites();
  const wa = whatsappLink(whatsappNumber);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="container-px flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo name={companyName} imageUrl={logoUrl} />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-ink text-paper" : "text-ink/80 hover:bg-ink/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5"
            aria-label="Избранное"
          >
            <HeartIcon className="h-5 w-5" filled={ready && count > 0} />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-signal px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md hidden sm:inline-flex"
            >
              <WhatsappIcon className="h-[18px] w-[18px]" />
              Написать в WhatsApp
            </a>
          )}

          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav className="container-px flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium",
                  pathname === item.href ? "bg-ink text-paper" : "hover:bg-ink/5"
                )}
              >
                {item.label}
              </Link>
            ))}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-signal btn-lg mt-2 w-full"
              >
                <WhatsappIcon className="h-5 w-5" />
                Написать в WhatsApp
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
