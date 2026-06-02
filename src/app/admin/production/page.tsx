import { createServerSupabase } from "@/lib/supabase/server";
import type { ProductionPhoto } from "@/lib/types";
import { ImageField } from "@/components/admin/ImageField";
import {
  saveProductionPhotoAction,
  deleteProductionPhotoAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductionPage() {
  const sb = createServerSupabase();
  const { data } = await sb
    .from("production_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const all = (data as ProductionPhoto[]) ?? [];
  const steps = all.filter((p) => p.section === "step");
  const gallery = all.filter((p) => p.section === "gallery");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Производство</h1>
      <p className="mt-1 text-muted">
        Управляйте фотографиями на странице{" "}
        <a href="/production" target="_blank" className="text-signal hover:underline">«Производство»</a>:
        этапы (с описанием) и фотогалерея.
      </p>

      {/* ЭТАПЫ */}
      <Section
        title="Этапы производства"
        hint="Карточки с фото, заголовком и описанием (раскрой, пошив, упаковка и т.д.)."
        section="step"
        items={steps}
        withDescription
      />

      {/* ГАЛЕРЕЯ */}
      <Section
        title="Фотогалерея"
        hint="Просто фотографии цеха, упаковки, отгрузки с короткой подписью."
        section="gallery"
        items={gallery}
        withDescription={false}
      />
    </div>
  );
}

function Section({
  title,
  hint,
  section,
  items,
  withDescription,
}: {
  title: string;
  hint: string;
  section: "step" | "gallery";
  items: ProductionPhoto[];
  withDescription: boolean;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint}</p>

      {/* Добавить */}
      <form action={saveProductionPhotoAction} className="card mt-4 p-5">
        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="is_visible" value="on" />
        <div className="grid gap-4">
          <ImageField name="image_url" label="Фото" />
          <div className="grid gap-4 sm:grid-cols-[1fr_110px]">
            <div>
              <label className="label">{withDescription ? "Заголовок этапа" : "Подпись"}</label>
              <input name="title" required className="field" placeholder={withDescription ? "Пошив" : "Швейный цех"} />
            </div>
            <div>
              <label className="label">Порядок</label>
              <input name="sort_order" type="number" defaultValue={items.length + 1} className="field" />
            </div>
          </div>
          {withDescription && (
            <div>
              <label className="label">Описание</label>
              <textarea name="description" rows={2} className="field resize-y" placeholder="Швейные линии выполняют тираж в срок." />
            </div>
          )}
          <div>
            <button className="btn btn-signal btn-md">Добавить</button>
          </div>
        </div>
      </form>

      {/* Список */}
      {items.length > 0 && (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <form key={item.id} action={saveProductionPhotoAction} className="card p-5">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="section" value={section} />
              <div className="grid gap-4">
                <ImageField name="image_url" label="Фото" initialUrl={item.image_url} />
                <div className="grid gap-4 sm:grid-cols-[1fr_110px]">
                  <div>
                    <label className="label">{withDescription ? "Заголовок" : "Подпись"}</label>
                    <input name="title" defaultValue={item.title ?? ""} className="field" />
                  </div>
                  <div>
                    <label className="label">Порядок</label>
                    <input name="sort_order" type="number" defaultValue={item.sort_order} className="field" />
                  </div>
                </div>
                {withDescription && (
                  <div>
                    <label className="label">Описание</label>
                    <textarea name="description" rows={2} defaultValue={item.description ?? ""} className="field resize-y" />
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="is_visible" defaultChecked={item.is_visible} className="h-4 w-4 accent-signal" />
                    Показывать
                  </label>
                  <button className="btn btn-outline btn-md">Сохранить</button>
                  <button
                    formAction={deleteProductionPhotoAction}
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
    </section>
  );
}
