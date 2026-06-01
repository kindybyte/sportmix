"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Supabase-клиент для браузера (используется в админке для загрузки фото и auth). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
