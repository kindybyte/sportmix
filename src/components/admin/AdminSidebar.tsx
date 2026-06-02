"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { MenuIcon, CloseIcon } from "@/components/ui/Icons";
import { signOutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Обзор", exact: true },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/production", label: "Производство" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/settings", label: "Настройки" },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-ink text-paper" : "text-ink/80 hover:bg-ink/5"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Топ-бар на мобильных */}
      <div className="flex items-center justify-between border-b border-line bg-panel px-5 py-3 lg:hidden">
        <Logo href="/admin" name="SportMix" />
        <button onClick={() => setOpen(true)} className="btn btn-ghost h-10 w-10 rounded-full p-0">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Десктоп-сайдбар */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-panel p-5 lg:flex">
        <Logo href="/admin" name="SportMix" />
        <div className="mt-8 flex-1">{nav}</div>
        <SidebarFooter email={email} />
      </aside>

      {/* Мобильный drawer */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-panel p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <Logo href="/admin" name="SportMix" />
              <button onClick={() => setOpen(false)} className="btn btn-ghost h-9 w-9 rounded-full p-0">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8 flex-1">{nav}</div>
            <SidebarFooter email={email} />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarFooter({ email }: { email: string }) {
  return (
    <div className="border-t border-line pt-4">
      <p className="truncate px-1 text-xs text-muted" title={email}>{email}</p>
      <div className="mt-2 flex flex-col gap-1">
        <Link href="/" target="_blank" className="rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-ink/5">
          Открыть сайт ↗
        </Link>
        <form action={signOutAction}>
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            Выйти
          </button>
        </form>
      </div>
    </div>
  );
}
