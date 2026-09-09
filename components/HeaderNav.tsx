"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User as UserIcon, Bookmark, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export function HeaderNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const displayName = user?.name || "Citizen";
  const displayEmail = user?.email || "";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "C";

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-neutral-950/75 backdrop-blur-xl transition-all">
      <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5 max-w-7xl mx-auto w-full">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-3 group" href="/">
            <Image
              src="/images/yojana-symbol.png"
              alt="Yojana Connect"
              width={32}
              height={32}
              className="h-7 sm:h-8 w-auto object-contain brightness-0 invert group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-all"
            />
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              YOJANA<span className="text-neutral-400 font-normal ml-1.5">CONNECT</span>
            </span>
          </Link>
          <span className="hidden sm:inline-block rounded-full border border-neutral-800 bg-neutral-900/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            {t("nav.citizenPortal")}
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-5 sm:gap-8 text-sm font-medium text-neutral-400">
          <Link href="/explore" className="hover:text-white transition hidden md:inline-block">
            {t("nav.schemes")}
          </Link>
          <a href="/#about" className="hover:text-white transition hidden md:inline-block">
            {t("nav.about")}
          </a>
          <a href="/#contact" className="hover:text-white transition hidden md:inline-block">
            {t("nav.contact")}
          </a>
        </nav>

        {/* Right: Language Pill & Auth Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Switch Pill */}
          <LanguageSelector />

          {/* Dynamic User Navigation */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-white/10 hover:border-white/25 bg-neutral-900/80 transition cursor-pointer"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                  {initials}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 mr-1 transition-transform duration-200 hidden sm:block ${
                    isDropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>

              {/* Frosted Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Identity Info */}
                  <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                    <p className="text-xs font-semibold text-white truncate leading-tight">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {displayEmail || "Citizen User"}
                    </p>
                  </div>

                  {/* Menu Links */}
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>{t("nav.profile")}</span>
                  </Link>

                  <Link
                    href="/saved"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>{t("nav.savedSchemes")}</span>
                  </Link>

                  <div className="border-t border-white/[0.08] my-1" />

                  {/* Red-accented Logout Button inside dropdown */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("nav.logout")}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-full border border-neutral-700 bg-neutral-900/80 px-4 py-1.5 text-xs font-semibold text-neutral-300 backdrop-blur-sm transition hover:bg-neutral-800 hover:text-white cursor-pointer active:scale-95"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/find"
                className="rounded-full bg-white px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-black transition hover:bg-neutral-200 shadow-md text-center active:scale-95"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
