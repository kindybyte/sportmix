/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const securityHeaders = [
  // Принудительный HTTPS на год + поддомены
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Запрет встраивания сайта в чужие iframe (защита от кликджекинга)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Запрет MIME-sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Меньше утечки реферера
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Отключаем ненужные браузерные API
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Supabase Storage public bucket
      ...(supabaseHost
        ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
        : []),
      // Fallback so any *.supabase.co project works even before env is parsed
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
