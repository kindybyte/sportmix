import { createServerSupabase } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";
import { saveSettingsAction } from "@/app/admin/actions";
import { LogoUploadField } from "@/components/admin/LogoUploadField";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const sb = createServerSupabase();
  const { data } = await sb.from("settings").select("*").eq("id", 1).maybeSingle();
  const s = (data as Settings) ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold">Настройки</h1>
      <p className="mt-1 text-muted">Контакты и описание компании, которые видят клиенты на сайте.</p>

      <form action={saveSettingsAction} className="mt-8 space-y-6">
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold">Компания</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label" htmlFor="company_name">Название компании</label>
              <input id="company_name" name="company_name" defaultValue={s?.company_name ?? "SportMix"} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="about_text">Описание компании</label>
              <textarea id="about_text" name="about_text" rows={4} defaultValue={s?.about_text ?? ""} className="field resize-y" />
            </div>
            <LogoUploadField initialUrl={s?.logo_url ?? null} />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-bold">Контакты</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="telegram_username">Telegram (username)</label>
              <input id="telegram_username" name="telegram_username" defaultValue={s?.telegram_username ?? ""} className="field" placeholder="sportmix" />
            </div>
            <div>
              <label className="label" htmlFor="whatsapp_number">WhatsApp (номер)</label>
              <input id="whatsapp_number" name="whatsapp_number" defaultValue={s?.whatsapp_number ?? ""} className="field" placeholder="+996 700 000 000" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="city">Город / производство</label>
              <input id="city" name="city" defaultValue={s?.city ?? ""} className="field" placeholder="Бишкек, Кыргызстан" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="delivery_text">Условия доставки</label>
              <textarea id="delivery_text" name="delivery_text" rows={3} defaultValue={s?.delivery_text ?? ""} className="field resize-y" />
            </div>
          </div>
        </section>

        <div className="sticky bottom-0 flex justify-end rounded-2xl border border-line bg-paper/90 p-4 backdrop-blur">
          <button type="submit" className="btn btn-signal btn-lg">Сохранить настройки</button>
        </div>
      </form>

      <div className="card mt-6 p-5 text-sm text-muted">
        <p className="font-medium text-ink">Telegram-бот для заявок</p>
        <p className="mt-1">
          Токен бота и chat_id задаются в переменных окружения
          (<code className="rounded bg-ink/5 px-1">TELEGRAM_BOT_TOKEN</code>,{" "}
          <code className="rounded bg-ink/5 px-1">TELEGRAM_CHAT_ID</code>) и не хранятся в базе из соображений безопасности.
        </p>
      </div>
    </div>
  );
}
