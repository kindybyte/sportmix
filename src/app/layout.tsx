import type { Metadata } from "next";
import { Unbounded, Golos_Text } from "next/font/google";
import { siteUrl } from "@/lib/utils";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "SportMix — оптовый каталог мужской одежды из Кыргызстана",
    template: "%s · SportMix",
  },
  description:
    "SportMix — швейный цех в Бишкеке. Мужская одежда оптом: футболки, поло, батники, худи, спортивные костюмы. Собственное производство, отправка в Россию и СНГ.",
  keywords: [
    "мужская одежда оптом",
    "футболки оптом из Кыргызстана",
    "швейный цех Кыргызстан",
    "одежда оптом в Россию",
    "SportMix каталог",
    "поло оптом",
    "худи оптом",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "SportMix",
    title: "SportMix — оптовый каталог мужской одежды",
    description:
      "Собственное производство в Кыргызстане. Отправка в Россию и СНГ. Футболки, поло, батники, худи, спортивные костюмы оптом.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
