import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { LEAD_STATUS_LABEL, type Lead } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sb = createServerSupabase();

  const [products, visible, categories, leadsNew, leadsTotal, recent] =
    await Promise.all([
      sb.from("products").select("id", { count: "exact", head: true }),
      sb.from("products").select("id", { count: "exact", head: true }).eq("is_visible", true),
      sb.from("categories").select("id", { count: "exact", head: true }),
      sb.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      sb.from("leads").select("id", { count: "exact", head: true }),
      sb.from("leads").select("*").order("created_at", { ascending: false }).limit(6),
    ]);

  const stats = [
    { label: "Товаров всего", value: products.count ?? 0, href: "/admin/products" },
    { label: "Видимых на сайте", value: visible.count ?? 0, href: "/admin/products" },
    { label: "Категорий", value: categories.count ?? 0, href: "/admin/categories" },
    { label: "Новых заявок", value: leadsNew.count ?? 0, href: "/admin/leads", accent: true },
  ];

  const recentLeads = (recent.data as Lead[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Обзор</h1>
          <p className="mt-1 text-muted">Сводка по каталогу и заявкам SportMix.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-signal btn-md">
          + Добавить товар
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card p-5 transition-colors hover:border-ink ${s.accent && (s.value as number) > 0 ? "border-signal/40 bg-signal-soft/40" : ""}`}
          >
            <span className="text-sm text-muted">{s.label}</span>
            <span className="mt-1 block font-display text-3xl font-bold">{s.value}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Последние заявки</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-signal hover:underline">
            Все заявки →
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="card grid place-items-center py-12 text-center text-muted">
            Заявок пока нет. Они появятся здесь после отправки формы с сайта.
          </div>
        ) : (
          <div className="card divide-y divide-line">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href="/admin/leads"
                className="flex items-center justify-between gap-4 p-4 hover:bg-ink/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {lead.client_name}
                    {lead.product_title && (
                      <span className="text-muted"> · {lead.product_title}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted">{formatDate(lead.created_at)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium">
                  {LEAD_STATUS_LABEL[lead.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
