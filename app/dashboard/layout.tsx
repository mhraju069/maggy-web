"use client";
import { formatImageUrl } from '@/lib/api/config';
import { clearAuthSession } from '@/lib/api/token';
import { authService } from '@/lib/api/services/authService';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    HiOutlineBookOpen,
    HiOutlineGlobe,
    HiOutlineHome,
    HiOutlineKey,
    HiOutlineUser,
} from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { DashboardProvider, useDashboard } from "./DashboardContext";
import NotificationBell from "@/components/shared/NotificationBell";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dashboardTranslations } from "@/lib/i18n/dashboardTranslations";

function DashboardHeader() {
  const { dashboardData } = useDashboard();
  const profile = dashboardData?.profile;
  const initial = profile?.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-8 py-3.5 bg-white border-b border-[#F1EDE8]">
      {/* Left / Title area */}
      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
        <span></span>
      </div>

      {/* Right side: Language Switcher, Notification Bell & Profile */}
      <div className="flex items-center gap-4 ml-auto">
        <LanguageSwitcher />

        <div className="h-6 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />

        <NotificationBell />

        <div className="h-6 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />

        {/* Profile Info */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#F8F4F0] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#CFB9A3] flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-[#E8E2DC] flex-shrink-0">
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
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-[#1d1a17] leading-none">
              {profile?.name || "Member"}
            </p>
            <p className="text-xs text-[#94A3B8] mt-0.5 max-w-[150px] truncate">
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
    <div className="min-h-screen flex font-cambria bg-white">
      {/* ── SIDEBAR ── */}
      <aside className="w-[190px] flex-shrink-0 flex flex-col py-6 px-3 border-r border-[#F1EDE8] bg-white">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <Image
            src="/images/logo.png"
            alt="Haven on Earth"
            width={48}
            height={48}
            className="object-contain rounded-full"
          />
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#CFB9A3] text-white"
                    : "text-[#64748B] hover:bg-[#F8F4F0] hover:text-[#1d1a17]"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}

          {/* Divider right below Profile */}
          <hr className="border-t border-[#E8E2DC] my-2" />

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#F8F4F0] hover:text-[#1d1a17] transition-colors"
          >
            <HiOutlineGlobe className="w-4 h-4 flex-shrink-0" />
            {dt.sidebar.viewWebsite}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
          >
            <HiArrowRightOnRectangle className="w-4 h-4 flex-shrink-0" />
            {dt.sidebar.logout}
          </button>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col bg-[#FCF2E9] min-h-screen">
        <DashboardHeader />

        {/* Page content */}
        <main className="flex-1 p-8 overflow-y-auto">
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
