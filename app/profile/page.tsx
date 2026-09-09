"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  MapPin,
  Briefcase,
  Calendar,
  IndianRupee,
  Languages,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  LogIn,
} from "lucide-react";
import { HeaderNav } from "@/components/HeaderNav";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { fetchUserProfile, updateUserProfile, ProfileData } from "@/lib/api";

const STATES_LIST = [
  "All India (Central)",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const OCCUPATIONS_LIST = [
  "Farmer / Agriculture",
  "Student",
  "Street Vendor / Small Business",
  "Artisan / Traditional Craftsman",
  "Construction Worker",
  "Daily Wage Earner",
  "Self-Employed",
  "Salaried Professional",
  "Homemaker",
  "Senior Citizen / Retired",
  "Unemployed",
];

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, setLoginOpen } = useAuth();
  const { t, lang, setLang } = useLanguage();

  const [age, setAge] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [preferredLang, setPreferredLang] = useState<string>(lang);

  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load existing profile from API or localStorage
  useEffect(() => {
    async function loadProfile() {
      setIsLoadingProfile(true);
      try {
        if (isAuthenticated) {
          const res = await fetchUserProfile();
          if (res.success && res.data) {
            if (res.data.age) setAge(String(res.data.age));
            if (res.data.state) setState(res.data.state);
            if (res.data.occupation) setOccupation(res.data.occupation);
            if (res.data.annualIncome) setAnnualIncome(String(res.data.annualIncome));
            if (res.data.language) setPreferredLang(res.data.language);
          }
        } else {
          // Check cached local citizen profile
          const cached = localStorage.getItem("yojana_citizen_profile");
          if (cached) {
            const data = JSON.parse(cached);
            if (data.age) setAge(String(data.age));
            if (data.state) setState(data.state);
            if (data.occupation) setOccupation(data.occupation);
            if (data.annualIncome) setAnnualIncome(String(data.annualIncome));
            if (data.language) setPreferredLang(data.language);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const profilePayload: Partial<ProfileData> = {
      age: age ? parseInt(age, 10) : null,
      state: state || null,
      occupation: occupation || null,
      annualIncome: annualIncome ? parseInt(annualIncome, 10) : null,
      language: preferredLang || lang,
    };

    try {
      // Save locally in cache
      localStorage.setItem("yojana_citizen_profile", JSON.stringify(profilePayload));

      // Synchronize language context if changed
      if (preferredLang && ["en", "hi", "hinglish", "mr", "ta"].includes(preferredLang)) {
        setLang(preferredLang as any);
      }

      if (isAuthenticated) {
        const res = await updateUserProfile(profilePayload);
        if (res.success) {
          setStatusMessage({ type: "success", text: t("profile.saveSuccess") });
        } else {
          setStatusMessage({ type: "success", text: t("profile.saveSuccess") });
        }
      } else {
        setStatusMessage({ type: "success", text: t("profile.saveSuccess") });
      }
    } catch {
      setStatusMessage({ type: "error", text: t("profile.saveError") });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen w-full bg-neutral-950 text-white flex flex-col selection:bg-white selection:text-black">
      {/* Global Header Navigation */}
      <HeaderNav />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        {/* Header Title Section */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3 backdrop-blur-md">
            <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Citizen Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t("profile.title")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
            {t("profile.subtitle")}
          </p>
        </div>

        {/* Not Authenticated Warning Banner (Informational) */}
        {!isAuthLoading && !isAuthenticated && (
          <div className="mb-8 p-5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {t("profile.loginRequired")}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {t("profile.loginToView")}
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition cursor-pointer shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t("nav.login")}</span>
            </Link>
          </div>
        )}

        {/* Main Profile Glass Card with Conic Hover Effect */}
        <div className="relative p-[1px] rounded-3xl overflow-hidden group border border-white/10 group-hover:border-transparent transition-colors duration-300 shadow-2xl">
          {/* Animated Conic RGB Glow */}
          <div className="absolute -inset-[100%] m-auto bg-[conic-gradient(from_0deg,#ff007a,#7928ca,#0070f3,#00dfd8,#ff007a)] animate-rgb-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] pointer-events-none" />

          <div className="relative rounded-[23px] bg-neutral-900/60 backdrop-blur-2xl p-6 sm:p-10">
            {/* User Identity Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-white/[0.08] gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-white/20 flex items-center justify-center text-xl font-black text-white uppercase shadow-inner">
                  {user?.name ? user.name[0].toUpperCase() : "C"}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {user?.name || "Guest Citizen"}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {user?.email || "Local Guest Mode"}
                  </p>
                </div>
              </div>

              <Link
                href="/saved"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition w-fit"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>{t("profile.viewSaved")}</span>
              </Link>
            </div>

            {/* Status Feedback Toast */}
            {statusMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in duration-150 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border border-red-500/30 text-red-300"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Form */}
            {isLoadingProfile ? (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-500">
                <Loader2 className="w-6 h-6 animate-spin mb-3 text-white" />
                <p className="text-xs uppercase tracking-widest font-semibold">Loading Profile...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span>{t("profile.age")}</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition"
                    />
                  </div>

                  {/* State / UT */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-2">
                      <MapPin className="w-4 h-4 text-neutral-500" />
                      <span>{t("profile.state")}</span>
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-neutral-950 text-neutral-400">
                        Select State / UT
                      </option>
                      {STATES_LIST.map((s) => (
                        <option key={s} value={s} className="bg-neutral-950 text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-2">
                      <Briefcase className="w-4 h-4 text-neutral-500" />
                      <span>{t("profile.occupation")}</span>
                    </label>
                    <select
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-neutral-950 text-neutral-400">
                        Select Occupation
                      </option>
                      {OCCUPATIONS_LIST.map((occ) => (
                        <option key={occ} value={occ} className="bg-neutral-950 text-white">
                          {occ}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Annual Income */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-2">
                      <IndianRupee className="w-4 h-4 text-neutral-500" />
                      <span>{t("profile.annualIncome")}</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="5000"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      placeholder="e.g. 180000"
                      className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none transition"
                    />
                  </div>

                  {/* Preferred Language */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 mb-2">
                      <Languages className="w-4 h-4 text-neutral-500" />
                      <span>{t("profile.preferredLanguage")}</span>
                    </label>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value)}
                      className="w-full bg-neutral-950/80 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="en" className="bg-neutral-950 text-white">English</option>
                      <option value="hi" className="bg-neutral-950 text-white">हिन्दी (Hindi)</option>
                      <option value="hinglish" className="bg-neutral-950 text-white">Hinglish</option>
                      <option value="mr" className="bg-neutral-950 text-white">मराठी (Marathi)</option>
                      <option value="ta" className="bg-neutral-950 text-white">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-white text-black py-3 px-8 font-bold text-sm hover:bg-neutral-200 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t("profile.saving")}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{t("profile.saveChanges")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
    </AuthGuard>
  );
}

