"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Language, Translations, translations } from "./translations";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("haven_language") as Language;
      if (stored && (stored === "en" || stored === "nl" || stored === "de")) {
        setLanguageState(stored);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("haven_language", lang);
      window.dispatchEvent(new Event("languageChange"));
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
