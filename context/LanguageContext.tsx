"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Language, translations, LANGUAGE_OPTIONS } from "@/data/translations";

const STORAGE_KEY = "yojana_lang";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedTranslation(obj: Record<string, unknown>, path: string): string | null {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }
  return typeof current === "string" ? current : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang && ["en", "hi", "hinglish", "mr", "ta"].includes(savedLang)) {
        setLangState(savedLang);
      }
    } catch {
      // Ignore localStorage access restrictions
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const activeDict = translations[lang] as unknown as Record<string, unknown>;
      const value = getNestedTranslation(activeDict, key);
      if (value !== null) {
        return value;
      }

      // Fallback to English dictionary
      if (lang !== "en") {
        const enDict = translations["en"] as unknown as Record<string, unknown>;
        const enValue = getNestedTranslation(enDict, key);
        if (enValue !== null) {
          return enValue;
        }
      }

      return fallback !== undefined ? fallback : key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export { LANGUAGE_OPTIONS };
export type { Language };

