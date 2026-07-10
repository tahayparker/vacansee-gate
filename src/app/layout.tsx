import type { Metadata, Viewport } from "next";
import { montserrat, qurovaFont, fontOptimization } from "@/lib/fonts";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlasmaBackground from "@/components/PlasmaBackground";

export const metadata: Metadata = {
  title: "vacansee Login Gate",
  description: "Sign in to access vacansee services",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${qurovaFont.variable}`}>
      <body className={`${montserrat.className} bg-background text-foreground min-h-screen antialiased`}>
        <PlasmaBackground />
        <SiteHeader />
        <main className="pt-16 pb-16 min-h-screen flex flex-col items-center w-full px-4 sm:px-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}