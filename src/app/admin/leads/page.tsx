import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { LEAD_STATUS_LABEL, type Lead, type LeadStatus } from "@/lib/types";
import { formatDate, telegramLink } from "@/lib/utils";
import { updateLeadStatusAction, deleteLeadAction } from "@/app/admin/actions";
import { TelegramIcon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "new", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "done", label: "Завершённые" },
  { key: "canceled", label: "Отменённые" },
];

const TYPE_LABEL: Record<string, string> = {
  product: "Товар",
  price: "Запрос прайса",
  cart: "Избранное",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const active = searchParams.status ?? "all";
  const sb = createServerSupabase();
  let query = sb.from("leads").select("*").order("created_at", { ascending: false });
  if (active !== "all") query = query.eq("status", active);
  const { data } = await query;
  const leads = (data as Lead[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Заявки</h1>
      <p className="mt-1 text-muted">Заявки клиентов с сайта. Дублируются в Telegram владельца.</p>

      {/* Фильтры по статусу */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/admin/leads" : `/admin/leads?status=${f.key}`}
            className={`chip ${active === f.key ? "chip-active" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="card mt-6 grid place-items-center py-16 text-muted">
          Заявок в этой категории нет.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {leads.map((lead) => {
            const tg = lead.contact.includes("@") ? telegramLink(lead.contact) : null;
            return (
              <div key={lead.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{lead.client_name}</h3>
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-muted">
                        {TYPE_LABEL[lead.type] ?? lead.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{formatDate(lead.created_at)}</p>
                  </div>
                  <span className={statusClass(lead.status)}>{LEAD_STATUS_LABEL[lead.status]}</span>
                </div>

                <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  {lead.product_title && <Field label="Товар" value={lead.product_title} />}
                  {lead.product_article && <Field label="Артикул" value={lead.product_article} />}
                  {lead.color && <Field label="Цвет" value={lead.color} />}
                  {lead.size && <Field label="Размерный ряд" value={lead.size} />}
                  {lead.quantity && <Field label="Кол-во (пачек)" value={lead.quantity} />}
                  {lead.city && <Field label="Город" value={lead.city} />}
                  <Field label="Контакт" value={lead.contact} />
                </dl>

                {lead.comment && (
                  <p className="mt-3 whitespace-pre-line rounded-xl bg-ink/[0.03] p-3 text-sm text-ink/80">
                    {lead.comment}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <form action={updateLeadStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <select name="status" defaultValue={lead.status} className="field max-w-[180px] py-2">
                      {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((s) => (
                        <option key={s} value={s}>{LEAD_STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                    <button className="btn btn-outline btn-md">Обновить</button>
                  </form>
                  {tg && (
                    <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-md text-signal">
                      <TelegramIcon className="h-4 w-4" /> Написать клиенту
                    </a>
                  )}
                  <form action={deleteLeadAction} className="ml-auto">
                    <input type="hidden" name="id" value={lead.id} />
                    <button className="btn btn-ghost btn-md text-red-600 hover:bg-red-50">Удалить</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted">{label}:</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function statusClass(status: LeadStatus): string {
  const map: Record<LeadStatus, string> = {
    new: "bg-signal-soft text-signal",
    in_progress: "bg-amber-100 text-amber-700",
    done: "bg-emerald-100 text-emerald-700",
    canceled: "bg-ink/10 text-muted",
  };
  return `rounded-full px-3 py-1 text-xs font-semibold ${map[status]}`;
}
