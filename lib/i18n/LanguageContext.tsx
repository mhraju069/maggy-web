"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Language, Translations, translations } from "./translations";
import { authService } from "@/lib/api/services/authService";
import { getStoredToken } from "@/lib/api/token";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Sync with user profile and localStorage on load
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initial check from localStorage
    const stored = localStorage.getItem("haven_language") as Language;
    if (stored && (stored === "en" || stored === "nl" || stored === "de")) {
      setLanguageState(stored);
    }

    // 2. If logged in, fetch user data or read stored user profile to respect user.language
    const token = getStoredToken();
    if (token) {
      // Check stored user_info first for quick sync
      const rawUser = localStorage.getItem("user_info");
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          const userLang = (parsed?.language || "").toLowerCase() as Language;
          if (userLang && (userLang === "en" || userLang === "nl" || userLang === "de")) {
            if (userLang !== stored) {
              localStorage.setItem("haven_language", userLang);
              setLanguageState(userLang);
            }
          }
        } catch { }
      }

      // Also fetch latest profile from backend to ensure accurate user language
      authService
        .getProfile()
        .then((profile) => {
          if (profile && profile.language) {
            const userLang = profile.language.toLowerCase() as Language;
            if (userLang && (userLang === "en" || userLang === "nl" || userLang === "de")) {
              const currentLang = localStorage.getItem("haven_language");
              if (currentLang !== userLang) {
                localStorage.setItem("haven_language", userLang);
                setLanguageState(userLang);
                window.dispatchEvent(new Event("languageChange"));
              }
            }
          }
        })
        .catch(() => { });
    }
  }, []);

  const handleSetLanguage = async (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("haven_language", lang);

      // If user is logged in, also persist language update to backend user profile
      const token = getStoredToken();
      if (token) {
        try {
          // Update in user_info storage immediately
          const rawUser = localStorage.getItem("user_info");
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            localStorage.setItem("user_info", JSON.stringify({ ...parsed, language: lang }));
          }

          // Send PATCH to /api/auth/user/
          await authService.updateProfile({ language: lang });
        } catch (err) {
          console.warn("Could not save language to backend profile:", err);
        }
      }

      window.dispatchEvent(new Event("languageChange"));
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language] as unknown as Translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
