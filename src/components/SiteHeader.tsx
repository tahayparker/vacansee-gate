// src/components/SiteHeader.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LogIn,
  UserRound,
  LogOut,
} from "lucide-react";
import { KeyboardKeys, AriaAnnouncer } from "@/lib/accessibility";
import { qurovaFont } from "@/lib/fonts";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { VacanseeIcon, VailaIcon, VacanseeAuIcon } from "@/components/ProjectIcons";

const projectIcons = [
  { name: "vacansee", href: "https://vacansee.vercel.app", icon: VacanseeIcon, color: "text-purple-500" },
  { name: "vaila", href: "https://vaila.vercel.app", icon: VailaIcon, color: "text-blue-500" },
  { name: "vacansee-au", href: "https://vacansee-au.vercel.app", icon: VacanseeAuIcon, color: "text-green-500" },
];
type ProjectIconType = (typeof projectIcons)[0];

const ProjectIconLink = React.forwardRef<
  React.ElementRef<"a">,
  { item: ProjectIconType; className?: string }
>(
  ({ item, className }, ref) => (
    <a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        `flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 ` +
        (className ?? "")
      }
      aria-label={item.name}
    >
      <item.icon className={`h-5 w-5 ${item.color}`} />
    </a>
  ),
);
ProjectIconLink.displayName = "ProjectIconLink";

interface SiteHeaderProps {
  maintenanceMode?: boolean;
}

export default function SiteHeader({
  maintenanceMode = false,
}: SiteHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthHovered, setIsAuthHovered] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname ?? "";

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    setIsMounted(true);
    let isSubscribed = true;
    const fetchUserAndListen = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (isSubscribed) {
          setUser(user ?? null);
          setLoadingAuth(false);
        }
      } catch (error) {
        console.error("Error fetching initial user:", error);
        if (isSubscribed) setLoadingAuth(false);
      }
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          if (isSubscribed) {
            console.log("Auth state changed:", _event);
            setUser(session?.user ?? null);
            setLoadingAuth(false);
            if (_event === "SIGNED_IN" || _event === "SIGNED_OUT") {
              setIsMenuOpen(false);
            }
          }
        },
      );
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    let unsubscribeListener: (() => void) | undefined;
    fetchUserAndListen()
      .then((cleanup) => {
        unsubscribeListener = cleanup;
      })
      .catch((error) => {
        console.error("Error setting up auth listener:", error);
        if (isSubscribed) setLoadingAuth(false);
      });

    return () => {
      isSubscribed = false;
      unsubscribeListener?.();
    };
  }, [supabase]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    setLoadingAuth(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        setLoadingAuth(false);
        return;
      }

      console.log("Signed out successfully");

      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.warn("Could not clear storage:", storageError);
      }

      try {
        document.cookie.split(";").forEach((c) => {
          const cookieName = c.split("=")[0].trim();
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        });
      } catch (cookieError) {
        console.warn("Could not clear cookies:", cookieError);
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Exception during sign out:", error);
      setLoadingAuth(false);
    }
  };

  const menuToggleTransition: Transition = { duration: 0.2 };
  const mobilePanelTransition: Transition = { duration: 0.2, ease: "easeOut" };
  const mobileBackdropTransition: Transition = { duration: 0.2, ease: "linear" };
  const authLabelTransition: Transition = { duration: 0.2, ease: "easeInOut" };
  const userDisplayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <header
        className={
          "fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 bg-black/5 backdrop-blur-lg border-b border-white/10"
        }
        role="banner"
        aria-label="Main navigation"
      >
        {/* Left side: Brand (vacansee-gate) */}
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
            <VacanseeAuIcon className="h-6 w-6 text-green-500" />
            <span className={`sm:inline text-xl mt-1 ${qurovaFont.className}`}>
              vacansee-gate
            </span>
          </Link>
        </div>

        {/* Right side: Project icons + Auth */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Project Icons - always visible */}
          <div className="hidden md:flex items-center gap-3 ml-4">
            {projectIcons.map((projectIcon) => (
              <ProjectIconLink key={projectIcon.href} item={projectIcon} />
            ))}
          </div>

          {/* Auth - conditionally visible */}
          {!maintenanceMode && isMounted && (
            <>
              {/* Auth Status - DESKTOP */}
              <div className="hidden md:flex items-center ml-2 h-10">
                <AnimatePresence mode="wait" initial={false}>
                  {loadingAuth ? (
                    <motion.div
                      key="auth-loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-8 h-8 flex items-center justify-center"
                    >
                      <LoadingSpinner size="small" />
                    </motion.div>
                  ) : user ? (
                    <motion.div
                      key="profile-container-desktop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center"
                      onHoverStart={() => setIsAuthHovered(true)}
                      onHoverEnd={() => setIsAuthHovered(false)}
                    >
                      <Link
                        href="/profile"
                        className={
                          `relative flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out overflow-hidden ` +
                          (isAuthHovered || currentPath === "/profile"
                            ? `bg-white/10 px-3 py-1.5 `
                            : `p-2 hover:hover:bg-white/10 `) +
                          (isAuthHovered || currentPath === "/profile"
                            ? "text-white"
                            : "text-white/80")
                        }
                        aria-label="Profile"
                      >
                        <span className="flex items-center justify-center">
                          {user.user_metadata?.avatar_url ||
                          user.user_metadata?.picture ? (
                            <Image
                              src={
                                user.user_metadata?.avatar_url ||
                                user.user_metadata?.picture
                              }
                              alt="Profile"
                              width={20}
                              height={20}
                              className="rounded-full flex-shrink-0"
                            />
                          ) : (
                            <UserRound className="h-5 w-5 flex-shrink-0" />
                          )}
                          <AnimatePresence>
                            {(isAuthHovered || currentPath === "/profile") && (
                              <motion.span
                                key="profile-label"
                                initial={{
                                  width: 0,
                                  opacity: 0,
                                  marginLeft: 0,
                                }}
                                animate={{
                                  width: "auto",
                                  opacity: 1,
                                  marginLeft: "0.375rem",
                                }}
                                exit={{
                                  width: 0,
                                  opacity: 0,
                                  marginLeft: 0,
                                }}
                                transition={authLabelTransition}
                                className="text-sm font-medium whitespace-nowrap"
                                style={{ lineHeight: "normal" }}
                              >
                                Profile
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin-button-desktop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onHoverStart={() => setIsAuthHovered(true)}
                      onHoverEnd={() => setIsAuthHovered(false)}
                      className="flex"
                    >
                      <Link
                        href="/auth/login"
                        className={
                          `relative flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out overflow-hidden ` +
                          (isAuthHovered
                            ? `bg-white/10 px-3 py-1.5 `
                            : `p-2 hover:hover:bg-white/10 `) +
                          (isAuthHovered ? "text-white" : "text-white/70")
                        }
                      >
                        <LogIn className="h-5 w-5 flex-shrink-0" />
                        <AnimatePresence>
                          {isAuthHovered && (
                            <motion.span
                              key="auth-label"
                              initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                              animate={{
                                width: "auto",
                                opacity: 1,
                                marginLeft: "0.375rem",
                              }}
                              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                              transition={authLabelTransition}
                              className="text-sm font-medium whitespace-nowrap"
                              style={{ lineHeight: "normal" }}
                            >
                              Sign In
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
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
            </>
          )}
          {/* Placeholder if not mounted AND not in maintenance mode */}
          {!maintenanceMode && !isMounted && (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse md:hidden"></div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu panel and backdrop */}
      {!maintenanceMode && (
        <>
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
                  {/* Project icons in mobile menu */}
                  <div className="mb-4 flex items-center justify-center gap-4">
                    {projectIcons.map((projectIcon) => (
                      <ProjectIconLink
                        key={projectIcon.href}
                        item={projectIcon}
                        className="w-12 h-12"
                      />
                    ))}
                  </div>
                  <hr className="bg-white/20 my-3 border-0 h-px" />
                  <div className="mt-auto">
                    {loadingAuth ? (
                      <div className="flex justify-center items-center p-3 h-[76px]">
                        <LoadingSpinner size="small" />
                      </div>
                    ) : user ? (
                      <div>
                        <Link
                          href="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 w-full p-3 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 ease-in-out mb-2"
                        >
                          {user.user_metadata?.avatar_url ||
                          user.user_metadata?.picture ? (
                            <Image
                              src={
                                user.user_metadata?.avatar_url ||
                                user.user_metadata?.picture
                              }
                              alt={userDisplayName}
                              width={32}
                              height={32}
                              className="rounded-full flex-shrink-0 object-cover"
                            />
                          ) : (
                            <UserRound className="h-8 w-8 flex-shrink-0" />
                          )}
                          <span className="flex-grow text-base font-medium">
                            Profile
                          </span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full p-3 rounded-md text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors duration-200 ease-in-out"
                        >
                          <LogOut className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-grow text-base text-left">
                            Sign Out
                          </span>
                        </button>
                      </div>
                    ) : (
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 w-full p-3 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 ease-in-out"
                      >
                        <LogIn className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-grow text-base">Sign In</span>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}