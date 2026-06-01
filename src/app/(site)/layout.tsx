import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { getSettings } from "@/lib/queries";

export const revalidate = 120;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        companyName={settings?.company_name ?? "SportMix"}
        whatsappNumber={settings?.whatsapp_number ?? null}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
