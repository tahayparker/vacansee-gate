import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const qurovaFont = localFont({
  src: "../../public/fonts/Qurova-SemiBold.otf",
  weight: "600",
  display: "swap",
  variable: "--font-qurova",
  preload: true,
  fallback: [
    "Montserrat",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const fontClasses = {
  montserrat: montserrat.className,
  qurova: qurovaFont.className,
  montserratVariable: montserrat.variable,
  qurovaVariable: qurovaFont.variable,
} as const;

export const fontVariables = {
  montserrat: "var(--font-montserrat)",
  qurova: "var(--font-qurova)",
} as const;

export const fontOptimization = {
  preloadFonts: () => {
    if (typeof window !== "undefined") {
      const montserratLink = document.createElement("link");
      montserratLink.rel = "preload";
      montserratLink.href =
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap";
      montserratLink.as = "style";
      document.head.appendChild(montserratLink);

      const qurovaLink = document.createElement("link");
      qurovaLink.rel = "preload";
      qurovaLink.href = "/fonts/Qurova-SemiBold.otf";
      qurovaLink.as = "font";
      qurovaLink.type = "font/otf";
      qurovaLink.crossOrigin = "anonymous";
      document.head.appendChild(qurovaLink);
    }
  },

  getFontDisplayStrategy: () => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection && connection.effectiveType) {
        return connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g"
          ? "swap"
          : "optional";
      }
    }
    return "swap";
  },
} as const;