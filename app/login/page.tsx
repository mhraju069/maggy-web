"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { authService, parseApiErrorMessage } from "@/lib/api";
import { getStoredRole, getStoredToken } from "@/lib/api/token";
import { appleProvider, auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isInactive, setIsInactive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      if (redirectUrl && redirectUrl.startsWith("/")) {
        router.replace(redirectUrl);
      } else {
        const role = getStoredRole();
        const target = role === "admin" ? "/admin" : "/dashboard";
        router.replace(target);
      }
    }
  }, [redirectUrl, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setSocialLoading("google");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authService.firebaseLogin(idToken, "user");

      if (response.status === false) {
        setError(response.log || "Google login failed.");
      } else if (response.access || response.token || response.status === true) {
        if (redirectUrl && redirectUrl.startsWith("/")) {
          router.push(redirectUrl);
        } else {
          const targetRoute = response.user?.role === "admin" ? "/admin" : "/dashboard";
          router.push(targetRoute);
        }
      } else {
        setError(response.log || "Authentication failed. Please try again.");
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg || "Failed to sign in with Google.");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleLogin = async () => {
    setError(null);
    setSocialLoading("apple");
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authService.firebaseLogin(idToken, "user");

      if (response.status === false) {
        setError(response.log || "Apple login failed.");
      } else if (response.access || response.token || response.status === true) {
        if (redirectUrl && redirectUrl.startsWith("/")) {
          router.push(redirectUrl);
        } else {
          const targetRoute = response.user?.role === "admin" ? "/admin" : "/dashboard";
          router.push(targetRoute);
        }
      } else {
        setError(response.log || "Authentication failed. Please try again.");
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg || "Failed to sign in with Apple.");
    } finally {
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsInactive(false);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password: password,
      });

      if (response.status === false) {
        const logMsg = response.log || "Invalid email or password.";
        setError(logMsg);
        if (logMsg.toLowerCase().includes("inactive") || logMsg.toLowerCase().includes("otp")) {
          setIsInactive(true);
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}${redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : ""}`);
          }, 1500);
        }
      } else if (response.access || response.token || response.status === true) {
        if (redirectUrl && redirectUrl.startsWith("/")) {
          router.push(redirectUrl);
        } else {
          const targetRoute = response.user?.role === "admin" ? "/admin" : "/dashboard";
          router.push(targetRoute);
        }
      } else {
        setError(response.log || "Login failed. Please check your credentials.");
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg);
      if (msg.toLowerCase().includes("inactive") || msg.toLowerCase().includes("otp")) {
        setIsInactive(true);
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(email.trim())}`);
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
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
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineMail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
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
                <div className="flex justify-end mt-0.5">
                  <Link
                    href={`/forgot-password${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`}
                    className="text-xs text-[#8b7355] hover:text-[#6f5c43] hover:underline transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Error message alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex flex-col gap-2 mt-1">
                  <p className="text-red-700 text-xs">{error}</p>
                  {isInactive && (
                    <Link
                      href={`/verify-otp?email=${encodeURIComponent(email.trim())}`}
                      className="inline-block text-xs font-semibold text-[#8b7355] hover:underline"
                    >
                      → Verify OTP Now
                    </Link>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!socialLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-1 bg-[#CFB9A3] hover:bg-[#bfa77f] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
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

              {/* Divider */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="border-t border-[#E2E8F0] w-full" />
                <span className="bg-white px-3 text-[11px] text-[#94A3B8] uppercase tracking-wider">
                  or continue with
                </span>
                <div className="border-t border-[#E2E8F0] w-full" />
              </div>

              {/* Social Login Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || !!socialLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#E2E8F0] hover:border-[#8b7355] hover:bg-[#FAF8F5] rounded-sm text-xs font-medium text-[#1d1a17] transition-all disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  <FaGoogle className="w-4 h-4 text-[#EA4335]" />
                  <span>{socialLoading === "google" ? "Connecting to Google…" : "Continue with Google"}</span>
                </button>

                {/* Apple Sign-In (Kept for future use when Apple Developer credentials are ready)
                <button
                  type="button"
                  onClick={handleAppleLogin}
                  disabled={loading || !!socialLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-[#E2E8F0] hover:border-[#8b7355] hover:bg-[#FAF8F5] rounded-sm text-xs font-medium text-[#1d1a17] transition-all disabled:opacity-60 cursor-pointer"
                >
                  <FaApple className="w-4 h-4 text-[#000000]" />
                  <span>{socialLoading === "apple" ? "Connecting…" : "Continue with Apple"}</span>
                </button>
                */}
              </div>

              {/* Sign up link */}
              <p className="text-center text-xs text-[#64748B] pt-3 border-t border-[#f1f5f9]">
                Don&apos;t have an account?{" "}
                <Link
                  href={`/signup${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}

