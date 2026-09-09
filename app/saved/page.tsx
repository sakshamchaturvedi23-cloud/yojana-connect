"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  ExternalLink,
  Trash2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { HeaderNav } from "@/components/HeaderNav";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { fetchBookmarks, removeBookmarkApi, BookmarkItem } from "@/lib/api";

export default function SavedSchemesPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useLanguage();

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookmarks() {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          const res = await fetchBookmarks();
          if (res.success && Array.isArray(res.data)) {
            setBookmarks(res.data);
            return;
          }
        }

        // Fallback or guest cache in localStorage
        const cached = localStorage.getItem("yojana_saved_schemes");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setBookmarks(parsed);
          }
        } else {
          setBookmarks([]);
        }
      } catch {
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookmarks();
  }, [isAuthenticated]);

  const handleRemove = async (schemeId: string) => {
    setRemovingId(schemeId);
    try {
      if (isAuthenticated) {
        await removeBookmarkApi(schemeId);
      }

      // Update local state
      const updated = bookmarks.filter(
        (b) => b.schemeId !== schemeId && b.scheme?.id !== schemeId
      );
      setBookmarks(updated);
      try {
        localStorage.setItem("yojana_saved_schemes", JSON.stringify(updated));
      } catch {
        // Ignore
      }
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen w-full bg-neutral-950 text-white flex flex-col selection:bg-white selection:text-black">
      {/* Global Header Navigation */}
      <HeaderNav />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        {/* Header Title Section */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3 backdrop-blur-md">
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved Schemes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t("saved.title")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
            {t("saved.subtitle")}
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-white" />
            <p className="text-xs uppercase tracking-widest font-semibold">
              Loading Saved Schemes...
            </p>
          </div>
        ) : bookmarks.length === 0 ? (
          /* Empty State Card */
          <div className="relative p-[1px] rounded-3xl overflow-hidden group border border-white/10 group-hover:border-transparent transition-colors duration-300 shadow-2xl">
            {/* Animated Conic Glow */}
            <div className="absolute -inset-[100%] m-auto bg-[conic-gradient(from_0deg,#ff007a,#7928ca,#0070f3,#00dfd8,#ff007a)] animate-rgb-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] pointer-events-none" />

            <div className="relative rounded-[23px] bg-neutral-900/60 backdrop-blur-2xl p-10 sm:p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-neutral-800 border border-white/15 flex items-center justify-center mb-6 shadow-inner">
                <Bookmark className="w-7 h-7 text-neutral-400" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {t("saved.emptyTitle")}
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mb-8 leading-relaxed">
                {t("saved.emptyDesc")}
              </p>

              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black font-bold text-sm px-6 py-3 hover:bg-neutral-200 transition active:scale-95 shadow-lg"
              >
                <span>{t("saved.exploreBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Bookmarked Schemes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map((item) => {
              const scheme = item.scheme;
              const title = scheme?.name || `Scheme #${item.schemeId}`;
              const desc = scheme?.description || "Government initiative providing citizen benefits and support.";
              const category = scheme?.category || "Citizen Welfare";
              const officialUrl = scheme?.officialUrl || scheme?.sourceUrl || "https://www.india.gov.in/my-government/schemes";
              const targetId = scheme?.id || item.schemeId;
              const isRemoving = removingId === targetId;

              return (
                <div
                  key={targetId}
                  className="bg-neutral-900/50 border border-white/[0.08] backdrop-blur-xl rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

                  <div className="relative z-10">
                    {/* Header Row: Category Badge & Remove Action */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                        {category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(targetId)}
                        disabled={isRemoving}
                        className="text-neutral-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer disabled:opacity-50"
                        title={t("saved.removeBtn")}
                        aria-label="Remove saved scheme"
                      >
                        {isRemoving ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Scheme Title */}
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed mb-6">
                      {desc}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="relative z-10 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Official Scheme</span>
                    </span>

                    <a
                      href={officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition shadow-sm"
                    >
                      <span>{t("saved.viewOfficial")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
    </AuthGuard>
  );
}

