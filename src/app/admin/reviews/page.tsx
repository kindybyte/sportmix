import { createServerSupabase } from "@/lib/supabase/server";
import type { Review } from "@/lib/types";
import { saveReviewAction, deleteReviewAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const sb = createServerSupabase();
  const { data } = await sb
    .from("reviews")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const reviews = (data as Review[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Отзывы</h1>
      <p className="mt-1 text-muted">Отзывы показываются на главной странице в блоке доверия.</p>

      {/* Добавить */}
      <form action={saveReviewAction} className="card mt-8 p-6">
        <h2 className="font-display text-lg font-bold">Новый отзыв</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_90px_90px]">
            <div>
              <label className="label">Имя *</label>
              <input name="name" required className="field" placeholder="Алексей" />
            </div>
            <div>
              <label className="label">Город</label>
              <input name="city" className="field" placeholder="Москва" />
            </div>
            <div>
              <label className="label">Оценка</label>
              <select name="rating" defaultValue="5" className="field">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n}★</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Порядок</label>
              <input name="sort_order" type="number" defaultValue={reviews.length + 1} className="field" />
            </div>
          </div>
          <div>
            <label className="label">Текст отзыва *</label>
            <textarea name="text" required rows={3} className="field resize-y" placeholder="Качество пошива отличное, размеры в норму…" />
          </div>
          <input type="hidden" name="is_visible" value="on" />
          <div>
            <button className="btn btn-signal btn-md">Добавить отзыв</button>
          </div>
        </div>
      </form>

      {/* Список */}
      {reviews.length === 0 ? (
        <div className="card mt-6 grid place-items-center py-12 text-muted">Отзывов пока нет.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <form key={r.id} action={saveReviewAction} className="card p-5">
              <input type="hidden" name="id" value={r.id} />
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_90px_90px]">
                  <div>
                    <label className="label text-xs">Имя</label>
                    <input name="name" defaultValue={r.name} className="field py-2" />
                  </div>
                  <div>
                    <label className="label text-xs">Город</label>
                    <input name="city" defaultValue={r.city ?? ""} className="field py-2" />
                  </div>
                  <div>
                    <label className="label text-xs">Оценка</label>
                    <select name="rating" defaultValue={String(r.rating)} className="field py-2">
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n}★</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">Порядок</label>
                    <input name="sort_order" type="number" defaultValue={r.sort_order} className="field py-2" />
                  </div>
                </div>
                <textarea name="text" defaultValue={r.text} rows={3} className="field resize-y" />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="is_visible" defaultChecked={r.is_visible} className="h-4 w-4 accent-signal" />
                    Показывать
                  </label>
                  <button className="btn btn-outline btn-md">Сохранить</button>
                  <button
                    formAction={deleteReviewAction}
                    className="btn btn-ghost btn-md ml-auto text-red-600 hover:bg-red-50"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
