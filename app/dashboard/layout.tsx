"use client";
import { formatImageUrl } from '@/lib/api/config';
import { clearAuthSession } from '@/lib/api/token';
import { authService } from '@/lib/api/services/authService';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    HiOutlineBookOpen,
    HiOutlineGlobe,
    HiOutlineHome,
    HiOutlineKey,
    HiOutlineUser,
    HiOutlineMenu,
    HiOutlineX,
} from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { DashboardProvider, useDashboard } from "./DashboardContext";
import NotificationBell from "@/components/shared/NotificationBell";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dashboardTranslations } from "@/lib/i18n/dashboardTranslations";

function DashboardHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { dashboardData } = useDashboard();
  const profile = dashboardData?.profile;
  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 bg-white border-b border-[#F1EDE8] sticky top-0 z-30">
      {/* 3-line hamburger button for mobile / tablet */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-xl text-[#1d1a17] hover:bg-[#F8F4F0] border border-[#E8E2DC] transition-colors focus:outline-none"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          <span>Member Portal</span>
        </div>
      </div>

      {/* Right side: Language Switcher, Notification Bell & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <LanguageSwitcher />

        <div className="h-6 w-px bg-[#E2E8F0] mx-0.5 sm:mx-1" />

        <NotificationBell />

        <div className="h-6 w-px bg-[#E2E8F0] mx-0.5 sm:mx-1" />

        {/* Profile Info */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 sm:gap-3 p-1 rounded-xl hover:bg-[#F8F4F0] transition-colors"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#CFB9A3] flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-[#E8E2DC] flex-shrink-0">
            {profile?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formatImageUrl(profile.image)}
                alt={profile?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-[#1d1a17] leading-none">
              {profile?.name || "Member"}
            </p>
            <p className="text-xs text-[#94A3B8] mt-0.5 max-w-[130px] truncate">
              {profile?.email || ""}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const dt = dashboardTranslations[language] || dashboardTranslations.en;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar whenever pathname changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const NAV = [
    { href: "/dashboard",              label: dt.sidebar.home,        Icon: HiOutlineHome },
    { href: "/dashboard/my-booking",   label: dt.sidebar.myBookings,  Icon: HiOutlineBookOpen },
    { href: "/dashboard/access-codes", label: dt.sidebar.accessCodes, Icon: HiOutlineKey },
    { href: "/dashboard/profile",      label: dt.sidebar.profile,     Icon: HiOutlineUser },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      clearAuthSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <div className="min-h-screen flex font-cambria bg-[#FCF2E9]">
      {/* ── BACKDROP OVERLAY FOR MOBILE (< lg) ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] lg:w-[210px] flex flex-col py-6 px-4 border-r border-[#F1EDE8] bg-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between lg:justify-center mb-8 px-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Haven on Earth"
              width={46}
              height={46}
              className="object-contain rounded-full"
            />
          </Link>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#1d1a17] hover:bg-[#F8F4F0]"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV.map(({ href, label, Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#CFB9A3] text-white shadow-xs"
                    : "text-[#64748B] hover:bg-[#F8F4F0] hover:text-[#1d1a17]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}

          {/* Divider right below Profile */}
          <hr className="border-t border-[#E8E2DC] my-2" />

          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#F8F4F0] hover:text-[#1d1a17] transition-colors"
          >
            <HiOutlineGlobe className="w-4 h-4 flex-shrink-0" />
            <span>{dt.sidebar.viewWebsite}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
          >
            <HiArrowRightOnRectangle className="w-4 h-4 flex-shrink-0" />
            <span>{dt.sidebar.logout}</span>
          </button>
        </nav>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FCF2E9] min-h-screen">
        <DashboardHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
