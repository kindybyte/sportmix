import { createServerSupabase } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";
import {
  saveCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const sb = createServerSupabase();
  const { data } = await sb
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  const categories = (data as Category[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Категории</h1>
      <p className="mt-1 text-muted">Управляйте разделами каталога и порядком их отображения.</p>

      {/* Добавить категорию */}
      <form action={saveCategoryAction} className="card mt-8 p-6">
        <h2 className="font-display text-lg font-bold">Новая категория</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_120px_auto] sm:items-end">
          <div>
            <label className="label" htmlFor="new-title">Название</label>
            <input id="new-title" name="title" required className="field" placeholder="Худи" />
          </div>
          <div>
            <label className="label" htmlFor="new-sort">Порядок</label>
            <input id="new-sort" name="sort_order" type="number" defaultValue={(categories.length + 1)} className="field" />
          </div>
          <input type="hidden" name="is_visible" value="on" />
          <button type="submit" className="btn btn-signal btn-lg">Добавить</button>
        </div>
      </form>

      {/* Список */}
      <div className="mt-6 space-y-3">
        {categories.length === 0 ? (
          <div className="card grid place-items-center py-12 text-muted">Категорий пока нет.</div>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="card p-4">
              <form action={saveCategoryAction} className="grid gap-3 sm:grid-cols-[1fr_100px_auto_auto] sm:items-end">
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="slug" value={c.slug} />
                <div>
                  <label className="label text-xs">Название</label>
                  <input name="title" defaultValue={c.title} className="field py-2" />
                </div>
                <div>
                  <label className="label text-xs">Порядок</label>
                  <input name="sort_order" type="number" defaultValue={c.sort_order} className="field py-2" />
                </div>
                <label className="flex items-center gap-2 pb-2.5 text-sm">
                  <input type="checkbox" name="is_visible" defaultChecked={c.is_visible} className="h-4 w-4 accent-signal" />
                  Видна
                </label>
                <button type="submit" className="btn btn-outline btn-md">Сохранить</button>
              </form>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
                <span className="text-xs text-muted">/{c.slug}</span>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs font-medium text-red-600 hover:underline">Удалить</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
