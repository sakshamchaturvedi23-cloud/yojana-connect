"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage, LANGUAGE_OPTIONS, Language } from "@/context/LanguageContext";

export function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.id === lang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (id: Language) => {
    setLang(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="bg-neutral-900/80 border border-white/10 rounded-full px-3 py-1.5 text-xs text-neutral-300 backdrop-blur-md hover:border-white/20 transition flex items-center gap-2 cursor-pointer group shadow-sm"
      >
        <Globe className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        <span className="font-medium tracking-tight text-white">{currentOption.nativeLabel}</span>
        <ChevronDown
          className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-white" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-2xl bg-neutral-900/95 border border-white/15 backdrop-blur-2xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 border-b border-white/[0.08] mb-1">
            Choose Language
          </div>
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = option.id === lang;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-white/10 text-white font-semibold"
                    : "text-neutral-300 hover:bg-white/5 hover:text-white font-normal"
                }`}
                role="menuitem"
              >
                <div className="flex flex-col">
                  <span className="leading-tight">{option.nativeLabel}</span>
                  {option.label !== option.nativeLabel && (
                    <span className="text-[10px] text-neutral-500">{option.label}</span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

