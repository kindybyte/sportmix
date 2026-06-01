import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Серверный клиент с сессией пользователя (cookies).
 * Используется в админке и middleware для проверки авторизации.
 */
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Вызов из Server Component — игнорируем, обновлением занимается middleware.
          }
        },
      },
    }
  );
}

/**
 * Анонимный read-only клиент без cookies — для публичных страниц.
 * Позволяет статическую генерацию / ISR без привязки к сессии.
 * Возвращает null, если переменные окружения ещё не заданы — тогда
 * страницы рендерятся с пустыми данными, а не падают.
 */
export function createPublicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}
