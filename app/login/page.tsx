"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";

// Hardcoded credentials
const USERS = [
  { username: "user",  password: "123", role: "user",  redirect: "/dashboard" },
  { username: "admin", password: "123", role: "admin", redirect: "/admin" },
];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const match = USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (!match) {
      setError("Invalid username or password.");
      setLoading(false);
      return;
    }

    // Set role cookie (read by middleware to protect routes)
    document.cookie = `role=${match.role}; path=/; SameSite=Lax`;

    router.push(match.redirect);
  };

  return (
    <div className="min-h-screen flex flex-col font-cambria bg-white">
      <Navbar />
      <div className="h-[88px]" />

      <main className="flex-grow flex min-h-screen">

        {/* LEFT — image fills full height, text centered */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/images/login/login.png"
            alt="Luxury sanctuary interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-10 text-white">
            <h2 className="font-displayPlayFair text-4xl lg:text-5xl leading-[1.2] mb-5">
              Welcome to the <br /> Circle of Stillness.
            </h2>
            <p className="text-sm leading-relaxed opacity-90 max-w-sm mb-5">
              Membership unlocks exclusive arrangements, priority reservations,
              and personalized wellness concierge services.
            </p>
            <div className="w-12 h-px bg-white/60" />
          </div>
        </div>

        {/* RIGHT — login form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-6 px-8 py-4 bg-white self-stretch">
          <div className="w-full max-w-[500px]">

            <div className="mb-6">
              <h1 className="font-displayPlayFair text-[32px] font-bold text-[#1d1a17] mb-2 leading-tight">
                Member Access
              </h1>
              <p className="text-sm text-[#64748B] font-light">
                Welcome back. Your Heaven awaits.
              </p>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="username"
                  className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineMail className="w-4 h-4" />
                  </span>
                  <input
                    id="username"
                    type="text"
                    placeholder="user or admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#E2E8F0] rounded-sm text-sm text-[#1d1a17] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#8b7355] transition-colors"
                    style={{ fontFamily: "Cambria, serif" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineLockClosed className="w-4 h-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 border border-[#E2E8F0] rounded-sm text-sm text-[#1d1a17] focus:outline-none focus:border-[#8b7355] transition-colors"
                    style={{ fontFamily: "Cambria, serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-[#94A3B8] hover:text-[#8b7355]"
                  >
                    <IoEyeOutline className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-1 bg-[#CFB9A3] hover:bg-[#bfa77f] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                style={{ boxShadow: "0 0 20px 0 rgba(202,117,33,0.30)" }}
              >
                {loading ? "Logging in…" : "Log In"}
                {!loading && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* Sign up link */}
              <p className="text-center text-xs text-[#64748B] pt-3 border-t border-[#f1f5f9]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-[#CFB9A3] hover:text-[#8b7355] font-semibold ml-0.5 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
