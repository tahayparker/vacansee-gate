import type { Metadata, Viewport } from "next";
import { montserrat, qurovaFont, fontOptimization } from "@/lib/fonts";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlasmaBackground from "@/components/PlasmaBackground";

export const metadata: Metadata = {
  title: "vacansee Login Gate",
  description: "Sign in to access vacansee services",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
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