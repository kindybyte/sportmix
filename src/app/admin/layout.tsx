import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminToaster } from "@/components/admin/AdminToaster";
import { signOutAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

/** Список разрешённых email из ADMIN_EMAILS (через запятую). Пусто = разрешены все. */
function allowedEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();

  // Неавторизованным (страница логина) — без оболочки
  if (!user) {
    return <>{children}</>;
  }

  // Email-allowlist: если задан ADMIN_EMAILS — пускаем только их
  const allowed = allowedEmails();
  const email = (user.email ?? "").toLowerCase();
  if (allowed.length > 0 && !allowed.includes(email)) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-5 text-center">
        <div className="max-w-sm">
          <h1 className="font-display text-2xl font-bold">Доступ запрещён</h1>
          <p className="mt-2 text-muted">
            Аккаунт <span className="font-medium text-ink">{user.email}</span> не
            в списке администраторов.
          </p>
          <form action={signOutAction} className="mt-6">
            <button className="btn btn-outline btn-lg">Выйти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      <AdminToaster />
      <AdminSidebar email={user.email ?? ""} />
      <div className="min-w-0">
        <main className="px-5 py-6 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
