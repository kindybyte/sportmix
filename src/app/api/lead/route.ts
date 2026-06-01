import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { buildLeadText, sendTelegram } from "@/lib/telegram";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clean(v: string | undefined | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export async function POST(req: Request) {
  // 1. Rate limit (5 заявок в минуту с одного IP)
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Слишком много заявок. Повторите через ${limit.retryAfter} сек.` },
      { status: 429 }
    );
  }

  // 2. Парсинг и валидация
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // honeypot или невалидные данные
    const first = parsed.error.issues[0];
    if (first?.message === "spam") {
      // Тихо «принимаем» спам, но ничего не делаем
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: first?.message ?? "Проверьте правильность заполнения формы." },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // 3. Сохранение в БД (service role обходит RLS)
  const supabase = createAdminSupabase();
  const { error: dbError } = await supabase.from("leads").insert({
    product_id: clean(data.product_id),
    product_title: clean(data.product_title),
    product_article: clean(data.product_article),
    client_name: data.client_name.trim(),
    city: clean(data.city),
    contact: data.contact.trim(),
    color: clean(data.color),
    size: clean(data.size),
    quantity: clean(data.quantity),
    comment: clean(data.comment),
    type: data.type,
    status: "new",
  });

  if (dbError) {
    console.error("[lead] db error:", dbError.message);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку. Попробуйте позже." },
      { status: 500 }
    );
  }

  // 4. Уведомление в Telegram (не блокирует ответ при сбое)
  const text = buildLeadText({
    type: data.type,
    product_title: data.product_title,
    product_article: data.product_article,
    color: data.color,
    size: data.size,
    quantity: data.quantity,
    client_name: data.client_name,
    city: data.city,
    contact: data.contact,
    comment: data.comment,
  });
  await sendTelegram(text);

  return NextResponse.json({ ok: true });
}
