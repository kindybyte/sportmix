import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { TelegramIcon, WhatsappIcon, PinIcon } from "@/components/ui/Icons";
import type { Settings } from "@/lib/types";
import { telegramLink, whatsappLink } from "@/lib/utils";

export function Footer({ settings }: { settings: Settings | null }) {
  const tg = telegramLink(settings?.telegram_username);
  const wa = whatsappLink(settings?.whatsapp_number);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="container-px grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo name={settings?.company_name ?? "SportMix"} href={null} className="[&_span]:text-paper [&_.text-muted]:text-paper/50" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
            {settings?.about_text ??
              "Швейный цех полного цикла. Мужская одежда оптом напрямую с производства в Кыргызстане."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {tg && (
              <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-signal btn-md">
                <TelegramIcon className="h-[18px] w-[18px]" /> Telegram
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-md border border-paper/30 text-paper hover:bg-paper hover:text-ink">
                <WhatsappIcon className="h-[18px] w-[18px]" /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-paper/50">
            Разделы
          </h4>
          <ul className="space-y-2.5 text-sm text-paper/80">
            <li><Link href="/catalog" className="hover:text-signal">Каталог</Link></li>
            <li><Link href="/about" className="hover:text-signal">О нас</Link></li>
            <li><Link href="/how-to-order" className="hover:text-signal">Как заказать</Link></li>
            <li><Link href="/contacts" className="hover:text-signal">Контакты</Link></li>
            <li><Link href="/favorites" className="hover:text-signal">Избранное</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-paper/50">
            Контакты
          </h4>
          <ul className="space-y-3 text-sm text-paper/80">
            <li className="flex items-start gap-2">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <span>{settings?.city ?? "Бишкек, Кыргызстан"}</span>
            </li>
            <li className="text-paper/60">
              {settings?.delivery_text ?? "Доставка в Россию и страны СНГ."}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper/50 sm:flex-row">
          <span>© {year} {settings?.company_name ?? "SportMix"}. Оптовая продажа мужской одежды.</span>
          <span>Производство — Кыргызстан · Отправка по России и СНГ</span>
        </div>
      </div>
    </footer>
  );
}
