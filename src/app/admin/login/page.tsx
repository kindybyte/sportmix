"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Неверный email или пароль.");
      setLoading(false);
      return;
    }
    const redirect = params.get("redirect") || "/admin";
    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo href={null} />
        </div>
        <div className="card bg-panel p-7 shadow-card">
          <h1 className="font-display text-2xl font-bold">Вход в админ-панель</h1>
          <p className="mt-1 text-sm text-muted">
            Доступ только для администратора SportMix.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                placeholder="admin@sportmix.kg"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? "Входим…" : "Войти"}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Аккаунт создаётся в Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
