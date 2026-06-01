import "server-only";

/** Экранирование для Telegram HTML parse_mode. */
function esc(s: string | null | undefined): string {
  if (!s) return "—";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface LeadMessage {
  type: string;
  product_title?: string | null;
  product_article?: string | null;
  color?: string | null;
  size?: string | null;
  quantity?: string | null;
  client_name: string;
  city?: string | null;
  contact: string;
  comment?: string | null;
}

export function buildLeadText(lead: LeadMessage): string {
  const header =
    lead.type === "price"
      ? "📋 <b>Запрос прайса — SportMix</b>"
      : lead.type === "cart"
        ? "🧺 <b>Заявка из избранного — SportMix</b>"
        : "🆕 <b>Новая заявка с сайта SportMix</b>";

  const lines: string[] = [header, ""];

  if (lead.type !== "price") {
    lines.push(`<b>Товар:</b> ${esc(lead.product_title)}`);
    if (lead.product_article) lines.push(`<b>Артикул:</b> ${esc(lead.product_article)}`);
    if (lead.color) lines.push(`<b>Цвет:</b> ${esc(lead.color)}`);
    if (lead.size) lines.push(`<b>Размеры:</b> ${esc(lead.size)}`);
    if (lead.quantity) lines.push(`<b>Количество:</b> ${esc(lead.quantity)}`);
    lines.push("");
  }

  lines.push(`<b>Клиент:</b> ${esc(lead.client_name)}`);
  if (lead.city) lines.push(`<b>Город:</b> ${esc(lead.city)}`);
  lines.push(`<b>Контакт:</b> ${esc(lead.contact)}`);
  if (lead.comment) lines.push(`<b>Комментарий:</b> ${esc(lead.comment)}`);

  return lines.join("\n");
}

/** Отправка сообщения владельцу в Telegram. Не бросает исключений наружу. */
export async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы — пропуск отправки.");
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("[telegram] ошибка:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] исключение:", err);
    return false;
  }
}
