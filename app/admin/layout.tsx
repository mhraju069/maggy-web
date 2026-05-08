"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineBell, HiOutlineGlobe } from "react-icons/hi";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import {
    MdDashboard, MdEventNote,
    MdMiscellaneousServices,
    MdPayment,
    MdPerson,
    MdSettings,
    MdTune,
    MdVpnKey, MdWarning,
} from "react-icons/md";

const NAV = [
  { href: "/admin",                label: "Dashboard",             Icon: MdDashboard },
  { href: "/admin/reservations",   label: "Reservations",          Icon: MdEventNote },
  { href: "/admin/availability",   label: "Availability & Capacity", Icon: MdTune },
  { href: "/admin/services",       label: "Services",              Icon: MdMiscellaneousServices },
  { href: "/admin/payments",       label: "Payments",              Icon: MdPayment },
  { href: "/admin/access-codes",   label: "Access Codes",          Icon: MdVpnKey },
  { href: "/admin/exceptions",     label: "Exceptions",            Icon: MdWarning },
  { href: "/admin/settings",       label: "Settings",              Icon: MdSettings },
  { href: "/admin/profile",        label: "Profile",               Icon: MdPerson },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = () => { document.cookie = "role=; path=/; max-age=0"; router.push("/login"); };

  return (
    <div className="min-h-screen flex font-cambria bg-white">

      {/* ── SIDEBAR ── same styling as user dashboard */}
      <aside className="w-[200px] flex-shrink-0 flex flex-col py-6 px-3 border-r border-[#F1EDE8] bg-white">
        {/* Logo + admin badge */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image
            src="/images/logo.png"
            alt="Haven on Earth"
            width={48}
            height={48}
            className="object-contain rounded-full"
          />
          <span className="text-[10px] bg-[#CFB9A3] text-white px-3 py-0.5 rounded-full font-semibold tracking-wide">
            Administrator
          </span>
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
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
        </nav>

        {/* Secondary nav */}
        <div className="flex flex-col gap-0.5 mt-4">
          <hr className="border-t border-[#E2E8F0] mb-2" />
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:bg-[#F8F4F0] hover:text-[#1d1a17] transition-colors"
          >
            <HiOutlineGlobe className="w-4 h-4 flex-shrink-0" />
            View Website
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
          >
            <HiArrowRightOnRectangle className="w-4 h-4 flex-shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col bg-[#FCF2E9] min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-end gap-4 px-8 py-4 bg-white border-b border-[#F1EDE8]">
          <button className="relative text-[#94A3B8] hover:text-[#8b7355] transition-colors">
            <HiOutlineBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#CFB9A3] flex items-center justify-center text-white font-bold text-sm">A</div>
            <div>
              <p className="text-sm font-semibold text-[#1d1a17] leading-none">Admin User</p>
              <p className="text-xs text-[#94A3B8] mt-0.5">admin@haven.com</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
