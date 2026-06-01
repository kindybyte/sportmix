import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { PriceRequestButton } from "@/components/lead/PriceRequestButton";
import {
  TelegramIcon,
  WhatsappIcon,
  PinIcon,
  ArrowRight,
} from "@/components/ui/Icons";
import { telegramLink, whatsappLink } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты SportMix: Telegram, WhatsApp. Производство — Бишкек, Кыргызстан. Доставка мужской одежды оптом в Россию и СНГ.",
  alternates: { canonical: "/contacts" },
};

export default async function ContactsPage() {
  const settings = await getSettings();
  const tg = telegramLink(settings?.telegram_username);
  const wa = whatsappLink(settings?.whatsapp_number);

  return (
    <div className="container-px py-12 lg:py-16">
      <div className="max-w-2xl">
        <span className="eyebrow mb-3">Контакты</span>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Свяжитесь с нами</h1>
        <p className="mt-4 text-lg text-muted">
          Быстрее всего ответим в мессенджерах. Напишите — пришлём прайс,
          ответим по наличию и доставке.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tg && (
          <a href={tg} target="_blank" rel="noopener noreferrer" className="card group p-6 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-card">
            <TelegramIcon className="h-8 w-8 text-signal" />
            <h3 className="mt-4 font-display text-lg font-semibold">Telegram</h3>
            <p className="mt-1 text-muted">@{settings?.telegram_username}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-signal">
              Написать <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="card group p-6 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-card">
            <WhatsappIcon className="h-8 w-8 text-signal" />
            <h3 className="mt-4 font-display text-lg font-semibold">WhatsApp</h3>
            <p className="mt-1 text-muted">{settings?.whatsapp_number}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-signal">
              Написать <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        )}
        <div className="card p-6">
          <PinIcon className="h-8 w-8 text-signal" />
          <h3 className="mt-4 font-display text-lg font-semibold">Производство</h3>
          <p className="mt-1 text-muted">{settings?.city ?? "Бишкек, Кыргызстан"}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-ink p-8 text-paper sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Доставка в Россию и СНГ</h2>
            <p className="mt-3 text-paper/70">
              {settings?.delivery_text ??
                "Отправляем заказы транспортными компаниями по России и странам СНГ. Сроки и стоимость доставки рассчитываем индивидуально под ваш город и объём партии."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {tg && (
              <a href={tg} target="_blank" rel="noopener noreferrer" className="btn btn-signal btn-lg">
                <TelegramIcon className="h-5 w-5" /> Telegram
              </a>
            )}
            <PriceRequestButton className="btn-lg border border-paper/30 text-paper hover:bg-paper hover:text-ink">
              Получить прайс
            </PriceRequestButton>
          </div>
        </div>
      </div>
    </div>
  );
}
