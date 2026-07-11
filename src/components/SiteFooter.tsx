// src/components/SiteFooter.tsx
import React from "react";

export default function SiteFooter() {
  return (
    <footer
      className={
        "w-full border-t border-white/10 " +
        "px-4 sm:px-6 md:px-8 py-4 " +
        "bg-black/5 backdrop-blur-sm "
      }
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-end">
        <p className="text-sm text-white/60">Made with 🖤 by TP</p>
      </div>
    </footer>
  );
}
