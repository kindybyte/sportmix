import "server-only";

/**
 * Простой in-memory rate limiter (по IP).
 * Достаточно для защиты от спама на одном инстансе.
 * Для масштабирования замените на Upstash Redis / @vercel/kv.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  /** Максимум запросов за окно. */
  limit?: number;
  /** Окно в миллисекундах. */
  windowMs?: number;
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: RateLimitOptions = {}
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** Извлечь IP клиента из заголовков запроса. */
export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}
