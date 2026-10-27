"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineGlobe } from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import {
  MdEventNote,
  MdMiscellaneousServices,
  MdPayment,
  MdPerson,
  MdSettings,
  MdTune,
  MdVpnKey, MdWarning,
  MdOutlineSupportAgent,
  MdCardMembership,
  MdGroup,
} from "react-icons/md";

import { useState, useEffect } from "react";
import { authService } from "@/lib/api/services/authService";
import { clearAuthSession, getStoredUser } from "@/lib/api/token";
import { formatImageUrl } from "@/lib/api/config";
import NotificationBell from "@/components/shared/NotificationBell";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { adminTranslations } from "@/lib/i18n/dashboardTranslations";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const at = adminTranslations[language] || adminTranslations.en;

  const NAV = [
    { href: "/admin/reservations", label: at.sidebar.reservations, Icon: MdEventNote },
    { href: "/admin/availability", label: at.sidebar.availability, Icon: MdTune },
    { href: "/admin/services", label: at.sidebar.services, Icon: MdMiscellaneousServices },
    { href: "/admin/subscriptions", label: at.sidebar.subscriptions, Icon: MdCardMembership },
    { href: "/admin/payments", label: at.sidebar.payments, Icon: MdPayment },
    { href: "/admin/access-codes", label: at.sidebar.accessCodes, Icon: MdVpnKey },
    { href: "/admin/exceptions", label: at.sidebar.exceptions, Icon: MdWarning },
    { href: "/admin/support-messages", label: at.sidebar.supportMessages, Icon: MdOutlineSupportAgent },
    { href: "/admin/users", label: at.sidebar.users, Icon: MdGroup },
    { href: "/admin/settings", label: at.sidebar.settings, Icon: MdSettings },
    { href: "/admin/profile", label: at.sidebar.profile, Icon: MdPerson },
  ];

  const logout = async () => {
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

  const [adminUser, setAdminUser] = useState<{ name: string; email: string; image: string | null }>({
    name: "Admin User",
    email: "admin@haven.com",
    image: null,
  });

  useEffect(() => {
    const syncProfile = () => {
      const cached = getStoredUser();
      if (cached) {
        setAdminUser({
          name: cached.name || cached.first_name || "Admin User",
          email: cached.email || "admin@haven.com",
          image: cached.image || null,
        });
      }
    };

    syncProfile();
    window.addEventListener("user_profile_updated", syncProfile);
    window.addEventListener("storage", syncProfile);

    // Fetch fresh profile from server
    authService
      .getProfile()
      .then((user) => {
        if (user) {
          setAdminUser({
            name: user.name || "Admin User",
            email: user.email || "admin@haven.com",
            image: user.image || null,
          });
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener("user_profile_updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  return (
    <div className="min-h-screen flex font-cambria bg-white">
      {/* ── SIDEBAR ── */}
      <aside className="w-[200px] flex-shrink-0 flex flex-col py-6 px-3 border-r border-[#F1EDE8] bg-white">
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
              href === "/admin"
                ? pathname === "/admin"
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
            {at.sidebar.viewWebsite}
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
          >
            <HiArrowRightOnRectangle className="w-4 h-4 flex-shrink-0" />
            {at.sidebar.logout}
          </button>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col bg-[#FCF2E9] min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-end gap-4 px-8 py-4 bg-white border-b border-[#F1EDE8]">
          <LanguageSwitcher />

          <div className="h-6 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />

          {/* Real-time Notification Bell */}
          <NotificationBell />

          <div className="h-6 w-px bg-[#E2E8F0] mx-1 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#CFB9A3] flex items-center justify-center text-white font-bold text-sm shadow-xs uppercase overflow-hidden border border-[#E8E2DC]">
              {adminUser.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formatImageUrl(adminUser.image)}
                  alt={adminUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(adminUser.name || "A").charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1d1a17] leading-none">{adminUser.name}</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">{adminUser.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
