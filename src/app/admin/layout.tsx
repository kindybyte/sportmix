import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

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

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      <AdminSidebar email={user.email ?? ""} />
      <div className="min-w-0">
        <main className="px-5 py-6 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
