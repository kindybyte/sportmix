import { createClient } from "@supabase/supabase-js";

/**
 * Клиент с Service Role ключом — ТОЛЬКО на сервере (API routes).
 * Обходит RLS. Используется для безопасной вставки заявок.
 * Service Role ключ НИКОГДА не должен попадать в клиентский бандл.
 */
export function createAdminSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY не задан в переменных окружения.");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
