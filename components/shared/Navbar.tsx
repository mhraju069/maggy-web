"use client";

import BookNow from "@/components/shared/BookNow";
import { authService } from "@/lib/api/services/authService";
import { clearAuthSession, getStoredRole, getStoredToken, getStoredUser, setStoredUser } from '@/lib/api/token';
import { formatImageUrl } from '@/lib/api/config';
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { LuLayoutDashboard } from "react-icons/lu";

const languageOptions: { label: string; value: Language }[] = [
  { label: "EN", value: "en" },
  { label: "NL", value: "nl" },
  { label: "DE", value: "de" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");

  useEffect(() => {
    const checkAuth = () => {
      const token = getStoredToken();
      setIsLoggedIn(!!token);
      const role = getStoredRole();
      setDashboardPath(role === "admin" ? "/admin" : "/dashboard");
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      clearAuthSession();
    }
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", name: t.navbar.home },
    { href: "/about", name: t.navbar.philosophy },
    { href: "/lunchroom", name: t.navbar.restaurant },
    { href: "/menu", name: t.navbar.menu },
    { href: "/wellness", name: t.navbar.wellness },
    { href: "/eventspace", name: t.navbar.events || "Events" },
    { href: "/arrangements", name: t.navbar.arrangements },
    { href: "/activities", name: t.navbar.activities },
    { href: "/memberships", name: t.navbar.memberships },
    { href: "/contact", name: t.navbar.contact },
  ];

  const activeLanguageLabel =
    languageOptions.find((o) => o.value === language)?.label ?? "EN";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#FCF2E9]">
      <div className="mx-auto flex h-[88px] max-w-[1550px] items-center justify-between px-4 sm:px-6">
        {/* ── Left: Logo + Language ── */}
        <div className="flex items-center gap-3 sm:gap-4 xl:gap-6 shrink-0">
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105"
          >
            <div className="relative h-[48px] w-[48px] sm:h-[54px] sm:w-[54px] overflow-hidden rounded-[41px]">
              <Image
                src="/images/logo.png"
                alt="Heaven on Earth Logo"
                fill
                sizes="54px"
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
              <span className="text-[15px] sm:text-[16px] font-bold text-[#1A1A1A] font-serif">
                {activeLanguageLabel}
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${isLanguageOpen
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
              <div className="absolute left-0 top-full mt-2 w-20 rounded-md border border-[#E5D6C7] bg-white/95 py-1 shadow-lg z-50">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setLanguage(option.value as Language);
                      setIsLanguageOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-[14px] font-semibold font-serif transition-colors hover:text-[#CA7521] ${language === option.value
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

        {/* ── Center: Nav Links (Desktop >= 1280px) ── */}
        <div className="hidden xl:flex flex-1 items-center justify-center gap-0.5 2xl:gap-1.5 px-1 2xl:px-2 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-1.5 2xl:px-2.5 py-1.5 text-[12.5px] 2xl:text-[14px] font-medium font-serif whitespace-nowrap transition-colors ${pathname === link.href
                ? "bg-[#F5D8BB] text-[#0F172A]"
                : "text-[#2D2D2D] hover:text-[#CA7521]"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ── Right: Auth Actions + Book Now (Desktop >= 1280px) ── */}
        <div className="hidden xl:flex items-center gap-2 2xl:gap-3 shrink-0">
          {/* Account Dropdown (Hoverable / Clickable) */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-[#CFB9A3] bg-transparent px-2.5 2xl:px-3.5 py-2 text-[12.5px] 2xl:text-[14px] font-bold font-serif text-[#0F172A] whitespace-nowrap shrink-0 transition-all hover:bg-[#F5D8BB]/30 hover:border-[#C4AD96] cursor-pointer"
            >
              {isLoggedIn ? (
                <>
                  <LuLayoutDashboard size={15} />
                  <span>{t.navbar.dashboard || "Account"}</span>
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{t.navbar.login || "Log In"}</span>
                </>
              )}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform group-hover:rotate-180"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#0F172A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full pt-1.5 hidden group-hover:block hover:block z-50 min-w-[170px]">
              <div className="rounded-xl border border-[#E5D6C7] bg-white p-1.5 shadow-xl">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardPath}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-serif font-medium text-[#0F172A] hover:bg-[#FCF2E9] hover:text-[#CA7521] transition-colors"
                    >
                      <LuLayoutDashboard size={15} />
                      <span>{t.navbar.dashboard || "Dashboard"}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-serif font-medium text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <HiArrowRightOnRectangle size={15} />
                      <span>{t.navbar.logout || "Log Out"}</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-serif font-medium text-[#0F172A] hover:bg-[#FCF2E9] hover:text-[#CA7521] transition-colors"
                  >
                    <HiArrowRightOnRectangle size={15} />
                    <span>{t.navbar.login}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          <BookNow
            href="/booking"
            label={t.navbar.bookNow}
            className="!px-4 2xl:!px-6 !py-2 2xl:!py-2.5 !text-[13px] 2xl:!text-[14px]"
          />
        </div>

        {/* ── Mobile & Tablet Hamburger Button (< 1280px) ── */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E5D6C7] text-[#1A1A1A] xl:hidden shrink-0"
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

      {/* ── Mobile & Tablet Menu Drawer (< 1280px) ── */}
      {isMenuOpen && (
        <div className="border-t border-[#E5D6C7] bg-[#FCF2E9] xl:hidden max-h-[calc(100vh-88px)] overflow-y-auto">
          <div className="mx-auto flex flex-col gap-2 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-md px-4 py-2.5 text-[16px] font-medium font-serif transition-colors ${pathname === link.href
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
                  className={`px-3 py-1.5 rounded-md text-[14px] font-semibold font-serif border transition-colors ${language === option.value
                    ? "bg-[#CFB9A3] text-[#0F172A] border-[#CFB9A3]"
                    : "bg-transparent text-[#1A1A1A] border-[#E5D6C7] hover:border-[#CFB9A3]"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2.5">
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardPath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2.5 rounded-md border border-[#CFB9A3] bg-transparent px-8 py-3.5 text-[16px] font-bold font-serif text-[#0F172A] transition-all hover:bg-[#F5D8BB]/30 active:scale-95"
                  >
                    <LuLayoutDashboard size={18} />
                    <span>{t.navbar.dashboard || "Dashboard"}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2.5 rounded-md border border-[#E2E8F0] bg-white px-8 py-3.5 text-[16px] font-bold font-serif text-[#64748B] hover:text-red-600 hover:border-red-200 active:scale-95 cursor-pointer"
                  >
                    <HiArrowRightOnRectangle size={18} />
                    <span>{t.navbar.logout || "Log Out"}</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-3 rounded-md border border-[#CFB9A3] bg-transparent px-8 py-3.5 text-[16px] font-bold font-serif text-[#0F172A] transition-all hover:border-[#C4AD96] hover:text-[#0F172A] active:scale-95"
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
              )}
              <BookNow href="/booking" className="w-full justify-center" label={t.navbar.bookNow} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
