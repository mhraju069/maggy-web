"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";

const languageOptions: { label: string; value: Language }[] = [
  { label: "NL", value: "nl" },
  { label: "EN", value: "en" },
  { label: "DE", value: "de" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = languageOptions.find((opt) => opt.value === language) || languageOptions[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2DC] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#1d1a17] transition-all shadow-xs cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="uppercase tracking-wider">{activeOption.label}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 text-[#8B7355] ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-24 rounded-xl border border-[#E8E2DC] bg-white py-1 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
          {languageOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setLanguage(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-3.5 py-1.5 text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                language === option.value
                  ? "text-[#8B7355] bg-[#FAF8F5] font-bold"
                  : "text-[#475569] hover:bg-[#F8F4F0] hover:text-[#1d1a17]"
              }`}
            >
              <span>{option.label}</span>
              {language === option.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

