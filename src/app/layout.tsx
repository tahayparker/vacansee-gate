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
      <body className={`${montserrat.className} bg-background text-foreground h-screen overflow-hidden antialiased flex flex-col`}>
        <PlasmaBackground />
        <SiteHeader />
        <main className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-8 relative z-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}