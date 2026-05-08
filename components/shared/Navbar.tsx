"use client";

import BookNow from "@/components/shared/BookNow";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navHrefs = [
  "/",
  "/philosophy",
  "/wellness",
  "/arrangements",
  "/memberships",
  "/activities",
  "/contact",
];
const languageOptions: { label: string; value: Language }[] = [
  { label: "EN", value: "en" },
  { label: "NL", value: "nl" },
  { label: "DE", value: "de" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = navHrefs.map((href, i) => ({
    href,
    name: [
      t.navbar.home,
      t.navbar.philosophy,
      t.navbar.wellness,
      t.navbar.arrangements,
      t.navbar.memberships,
      t.navbar.activities,
      t.navbar.contact,
    ][i],
  }));

  const activeLanguageLabel =
    languageOptions.find((o) => o.value === language)?.label ?? "EN";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#FCF2E9]">
      <div className="mx-auto flex h-[88px] container items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <div className="relative h-[54px] w-[54px] overflow-hidden rounded-[41px]">
              <Image
                src="/images/logo.png"
                alt="Haven on Earth Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLanguageOpen((prev) => !prev)}
              className="flex items-center gap-1.5 cursor-pointer group"
              aria-haspopup="listbox"
              aria-expanded={isLanguageOpen}
            >
              <span className="text-[16px] font-bold text-[#1A1A1A] font-serif">
                {activeLanguageLabel}
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${
                  isLanguageOpen
                    ? "translate-y-0.5 rotate-180"
                    : "group-hover:translate-y-0.5"
                }`}
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="#1A1A1A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isLanguageOpen && (
              <div className="absolute left-0 top-full mt-2 w-20 rounded-md border border-[#E5D6C7] bg-white/95 py-1 shadow-lg">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setLanguage(option.value as Language);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[14px] font-semibold font-serif transition-colors hover:text-[#CA7521] ${
                      language === option.value
                        ? "text-[#CA7521]"
                        : "text-[#1A1A1A]"
                    }`}
                    role="option"
                    aria-selected={language === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-3 text-[16px] font-medium font-serif transition-colors ${
                pathname === link.href
                  ? "bg-[#F5D8BB] text-[#0F172A]"
                  : "text-[#2D2D2D] hover:text-[#CA7521]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-md border border-[#CFB9A3] bg-transparent px-8 py-4 text-[16px] font-bold font-serif text-[#0F172A] transition-all hover:border-[#C4AD96] hover:text-[#0F172A] active:scale-95"
          >
            {t.navbar.login}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#0F172A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <BookNow href="/booking" />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E5D6C7] text-[#1A1A1A] lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7H20M4 12H20M4 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#E5D6C7] bg-[#FCF2E9] lg:hidden">
          <div className="container mx-auto flex flex-col gap-2 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-md px-4 py-2 text-[16px] font-medium font-serif transition-colors ${
                  pathname === link.href
                    ? "bg-[#F5D8BB] text-[#0F172A]"
                    : "text-[#2D2D2D] hover:text-[#CA7521]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Language switcher — mobile */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E5D6C7] mt-1">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setLanguage(option.value as Language);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-md text-[14px] font-semibold font-serif border transition-colors ${
                    language === option.value
                      ? "bg-[#CFB9A3] text-[#0F172A] border-[#CFB9A3]"
                      : "bg-transparent text-[#1A1A1A] border-[#E5D6C7] hover:border-[#CFB9A3]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 rounded-md border border-[#CFB9A3] bg-transparent px-8 py-4 text-[16px] font-bold font-serif text-[#0F172A] transition-all hover:border-[#C4AD96] hover:text-[#0F172A] active:scale-95"
              >
                {t.navbar.login}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <BookNow href="/booking" className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
