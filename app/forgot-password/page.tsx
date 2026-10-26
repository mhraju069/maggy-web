"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { authService, parseApiErrorMessage } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.forgotPassword({ email: email.trim() });
      if (response.status !== false) {
        setSuccess(response.log || "Password reset OTP sent to your email.");
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
        }, 1200);
      } else {
        setError(response.log || "Failed to send reset code. Please try again.");
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-cambria bg-white">
      <Navbar />
      <div className="h-[88px]" />

      <main className="flex-grow flex min-h-screen">
        {/* LEFT — Brand Sanctuary Image */}
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
              Reset Your <br /> Sanctuary Access.
            </h2>
            <p className="text-sm leading-relaxed opacity-90 max-w-sm mb-5">
              Enter your email to receive a secure 4-digit verification code to reset your password.
            </p>
            <div className="w-12 h-px bg-white/60" />
          </div>
        </div>

        {/* RIGHT — Forgot Password form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-6 px-8 py-4 bg-white self-stretch">
          <div className="w-full max-w-[480px]">
            <div className="mb-6">
              <h1 className="font-displayPlayFair text-[32px] font-bold text-[#1d1a17] mb-2 leading-tight">
                Forgot Password
              </h1>
              <p className="text-sm text-[#64748B] font-light">
                We will send a 4-digit OTP code to verify your identity.
              </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <p className="text-emerald-700 text-xs font-medium">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-[#CFB9A3] hover:bg-[#bfa77f] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
                style={{ boxShadow: "0 0 20px 0 rgba(202,117,33,0.30)" }}
              >
                {loading ? "Sending OTP…" : "Send Reset Code"}
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

              {/* Back to login */}
              <p className="text-center text-xs text-[#64748B] pt-4 border-t border-[#f1f5f9]">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-[#CFB9A3] hover:text-[#8b7355] font-semibold ml-0.5 transition-colors"
                >
                  Back to Log In
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
