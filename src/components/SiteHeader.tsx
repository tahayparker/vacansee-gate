// src/components/SiteHeader.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  DoorOpen,
  CalendarCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { KeyboardKeys, AriaAnnouncer } from "@/lib/accessibility";
import { qurovaFont } from "@/lib/fonts";

const projectLinks = [
  { name: "vacansee", href: "https://vacansee.vercel.app", icon: DoorOpen, color: "text-purple-500" },
  { name: "vaila", href: "https://vaila.vercel.app", icon: CalendarCheck, color: "text-purple-500" },
  { name: "vacansee-au", href: "https://vacansee-au.vercel.app", icon: DoorOpen, color: "text-purple-500" },
];

interface SiteHeaderProps {
  maintenanceMode?: boolean;
}

export default function SiteHeader({
  maintenanceMode = false,
}: SiteHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname ?? "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  const menuToggleTransition: Transition = { duration: 0.2 };
  const mobilePanelTransition: Transition = { duration: 0.2, ease: "easeOut" };
  const mobileBackdropTransition: Transition = { duration: 0.2, ease: "linear" };
  const labelTransition: Transition = { duration: 0.2, ease: "easeInOut" };

  return (
    <>
      <header
        className={
          "fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 bg-black/5 backdrop-blur-lg border-b border-white/10"
        }
        role="banner"
        aria-label="Main navigation"
      >
        {/* Left side: Brand */}
        <div className="flex-shrink-0 z-10 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-semibold transition-opacity hover:opacity-80"
            onClick={(e) => {
              if (maintenanceMode && currentPath !== "/maintenance") {
                e.preventDefault();
                router.push("/maintenance");
              }
            }}
          >
            <DoorOpen className="h-6 w-6 text-purple-500" />
            <span className={`sm:inline text-xl mt-1 ${qurovaFont.className}`}>
              vacansee-gate
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Project Icons - DESKTOP */}
          <div className="hidden md:flex items-center gap-1 ml-4 h-10">
            {projectLinks.map((project) => {
              const isHovered = hoveredHref === project.href;
              return (
                <motion.div
                  key={project.href}
                  onHoverStart={() => setHoveredHref(project.href)}
                  onHoverEnd={() => setHoveredHref(null)}
                  className="flex"
                >
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      `relative flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out overflow-hidden ` +
                      (isHovered
                        ? `bg-white/10 px-3 py-1.5 `
                        : `p-2 hover:bg-white/10 `) +
                      (isHovered ? "text-white" : "text-white/70")
                    }
                  >
                    <project.icon className={`h-5 w-5 flex-shrink-0 ${project.color}`} />
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                          animate={{
                            width: "auto",
                            opacity: 1,
                            marginLeft: "0.375rem",
                          }}
                          exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                          transition={labelTransition}
                          className="text-sm font-medium whitespace-nowrap"
                          style={{ lineHeight: "normal" }}
                        >
                          {project.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden ml-1">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={(e) => {
                if (
                  e.key === KeyboardKeys.ENTER ||
                  e.key === KeyboardKeys.SPACE
                ) {
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                  AriaAnnouncer.getInstance().announce(
                    isMenuOpen ? "Menu closed" : "Menu opened",
                  );
                }
              }}
              className="relative z-[65] flex flex-col justify-center items-center gap-[7px] p-2 rounded-full transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="w-5 h-px bg-white block rounded-full"
                animate={
                  isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }
                }
                transition={menuToggleTransition}
              />
              <motion.span
                className="w-5 h-px bg-white block rounded-full"
                animate={
                  isMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }
                }
                transition={menuToggleTransition}
              />
            </motion.button>
          </div>
          
          {!isMounted && (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse md:hidden"></div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu panel and backdrop */}
      <AnimatePresence>
        {isMounted && isMenuOpen && (
          <motion.div
            key="mobile-backdrop"
            className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={mobileBackdropTransition}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMounted && isMenuOpen && (
          <motion.div
            key="mobile-menu-panel"
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
            className={
              "fixed inset-x-4 top-20 z-50 md:hidden bg-gradient-to-br from-black/80 to-black/90 backdrop-blur-xl border border-white/15 shadow-xl rounded-lg overflow-hidden"
            }
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={mobilePanelTransition}
          >
            <div className="max-h-[calc(100vh-6rem)] overflow-y-auto p-4 flex flex-col">
              <div className="flex flex-col gap-2">
                {projectLinks.map((project) => (
                  <a
                    key={project.href}
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 w-full p-3 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 ease-in-out"
                  >
                    <project.icon className={`h-5 w-5 flex-shrink-0 ${project.color}`} />
                    <span className="flex-grow text-base">
                      {project.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}