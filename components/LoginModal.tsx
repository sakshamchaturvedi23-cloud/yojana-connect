"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Lock, Mail, User as UserIcon, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function LoginModal() {
  const { isLoginOpen, setLoginOpen, login, register, loginAsDemo } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLoginOpen) {
        setLoginOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoginOpen, setLoginOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isLoginOpen) {
      setError(null);
      setIsSubmitting(false);
      setMode("login");
    }
  }, [isLoginOpen]);

  if (!isLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!emailOrUsername.trim()) {
        setError("Please enter your email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await register({
          fullName: fullName.trim(),
          email: emailOrUsername.trim(),
          password,
          confirmPassword,
        });

        if (!res.success) {
          setError(res.error || "Registration failed. Please try again.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Registration failed.";
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!emailOrUsername.trim() || !password.trim()) {
        setError("Please provide both email/phone and password.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await login({
          emailOrUsername: emailOrUsername.trim(),
          password,
          rememberMe,
        });

        if (!res.success) {
          setError(res.error || t("auth.invalidCredentials"));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : t("auth.invalidCredentials");
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDemoClick = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginAsDemo();
    } catch {
      setError("Failed to initialize demo session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setLoginOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-md bg-neutral-900/90 border border-white/10 backdrop-blur-2xl text-white rounded-3xl p-7 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setLoginOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-white/15 flex items-center justify-center mb-3 shadow-inner">
            <Image
              src="/images/yojana-symbol.png"
              alt="Yojana Connect"
              width={28}
              height={28}
              className="object-contain brightness-0 invert"
            />
          </div>
          <h2 id="modal-title" className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            {mode === "login"
              ? t("auth.loginTitle")
              : t("auth.signUpTitle", "Citizen Registration")}
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs">
            {mode === "login"
              ? t("auth.loginSubtitle")
              : t("auth.signUpSubtitle", "Create your citizen account to find and track eligible schemes")}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {t("auth.fullName", "Full Legal Name")}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {mode === "login"
                ? t("auth.emailOrPhone")
                : t("auth.email", "Email Address")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={mode === "signup" ? "email" : "text"}
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="aarav.sharma@example.com"
                className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {t("auth.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                {t("auth.confirmPassword", "Confirm Password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-neutral-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-white focus:ring-0 focus:ring-offset-0"
                />
                <span>{t("auth.rememberMe")}</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 rounded-xl bg-white text-black py-2.5 px-4 font-bold text-sm hover:bg-neutral-200 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {mode === "login"
                    ? t("auth.signingIn")
                    : t("auth.signingUp", "Creating account...")}
                </span>
              </>
            ) : (
              <span>
                {mode === "login"
                  ? t("auth.signInBtn")
                  : t("auth.signUpBtn", "Create Account")}
              </span>
            )}
          </button>
        </form>

        {/* Demo Citizen Action (Only on login mode) */}
        {mode === "login" && (
          <>
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-neutral-900 px-3 text-[11px] uppercase tracking-wider text-neutral-500 absolute">
                {t("auth.or")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoClick}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-200 py-2.5 px-4 text-xs font-semibold transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t("auth.useDemo")}</span>
            </button>
          </>
        )}

        {/* Switch Between Login & Sign Up Modes */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            className="text-xs text-neutral-400 hover:text-white transition cursor-pointer underline underline-offset-4"
          >
            {mode === "login"
              ? t("auth.dontHaveAccount", "Don't have an account? Create one")
              : t("auth.alreadyHaveAccount", "Already have an account? Sign In")}
          </button>
        </div>

        {/* Guest Footnote */}
        <p className="mt-4 text-center text-[11px] text-neutral-500 leading-normal">
          {t("auth.guestNotice")}
        </p>
      </div>
    </div>
  );
}
