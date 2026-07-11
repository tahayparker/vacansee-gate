"use client";

import { useState, FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2, Mail, Lock, ArrowLeft, DoorOpen, CalendarCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { qurovaFont } from "@/lib/fonts";
import Link from "next/link";

type AuthMode = "login" | "forgot-password" | "reset-password";

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [session, setSession] = useState<any>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      setSession(data.session);
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const redirectUrl = `${window.location.origin}/auth/login?mode=reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setMode("login");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("Password updated successfully! Redirecting...");
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    }
    setIsLoading(false);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  // Check for reset password mode from URL
  if (typeof window !== "undefined") {
    const modeParam = searchParams.get("mode");
    if (modeParam === "reset-password" && mode !== "reset-password") {
      setMode("reset-password");
    }
  }

  // Generate URL with token passing hash if session exists
  const getAuthLink = (baseUrl: string) => {
    if (!session) return baseUrl;
    // Route to our custom SSO page which explicitly handles the hash
    return `${baseUrl}/auth/sso#access_token=${session.access_token}&refresh_token=${session.refresh_token}`;
  };

  if (isSuccess) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-6"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Sign in successful!</h2>
            <p className="text-white/60">You can now access all projects.</p>
          </div>

          <div className="w-full h-px bg-white/10 my-2" />

          <div className="w-full space-y-3">
            <a href={getAuthLink("https://vacansee.vercel.app")} className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-3 text-white">
                <DoorOpen className="text-purple-500 w-5 h-5" />
                <span className="font-medium">vacansee</span>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </a>
            
            <a href={getAuthLink("https://vaila.vercel.app")} className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-3 text-white">
                <CalendarCheck className="text-purple-500 w-5 h-5" />
                <span className="font-medium">vaila</span>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </a>

            <a href={getAuthLink("https://vacansee-au.vercel.app")} className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-3 text-white">
                <DoorOpen className="text-purple-500 w-5 h-5" />
                <span className="font-medium">vacansee-au</span>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </a>

            <a href={getAuthLink("https://vacansee-au.vercel.app")} className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group">
              <div className="flex items-center gap-3 text-white">
                <DoorOpen className="text-purple-500 w-5 h-5" />
                <span className="font-medium">JR</span>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 z-10 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Back button for non-login modes */}
        {(mode === "forgot-password" || mode === "reset-password") && (
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setSuccessMessage(null);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200"
              aria-label="Back to login"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Sign In</span>
            </button>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="space-y-2 text-center text-white mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            vacansee Login Gate
          </h1>
          <p className="text-md text-white/60">
            {mode === "login" && "Enter your credentials to continue"}
            {mode === "forgot-password" && "Enter your email to reset your password"}
            {mode === "reset-password" && "Enter your new password"}
          </p>
        </motion.div>



        {mode === "login" && (
          <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pl-10 pr-12 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot-password");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full border border-solid border-white/30 transition-colors flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/50 font-medium text-base h-12 px-5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-red-500/60 bg-red-950/50 p-4 text-left text-sm text-red-200 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-green-500/60 bg-green-950/50 p-4 text-left text-sm text-green-200 flex items-start gap-3"
              >
                <span>{successMessage}</span>
              </motion.div>
            )}
          </motion.form>
        )}

        {mode === "forgot-password" && (
          <motion.form variants={itemVariants} onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pl-10 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full border border-solid border-white/30 transition-colors flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/50 font-medium text-base h-12 px-5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </motion.button>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-red-500/60 bg-red-950/50 p-4 text-left text-sm text-red-200 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-green-500/60 bg-green-950/50 p-4 text-left text-sm text-green-200 flex items-start gap-3"
              >
                <span>{successMessage}</span>
              </motion.div>
            )}
          </motion.form>
        )}

        {mode === "reset-password" && (
          <motion.form variants={itemVariants} onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2 text-left">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pl-10 pr-12 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-3 pl-10 pr-12 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full border border-solid border-white/30 transition-colors flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/50 font-medium text-base h-12 px-5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </motion.button>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-red-500/60 bg-red-950/50 p-4 text-left text-sm text-red-200 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-green-500/60 bg-green-950/50 p-4 text-left text-sm text-green-200 flex items-start gap-3"
              >
                <span>{successMessage}</span>
              </motion.div>
            )}
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}