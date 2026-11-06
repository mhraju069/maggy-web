"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { authService, parseApiErrorMessage } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { HiOutlineKey, HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { IoEyeOutline } from "react-icons/io5";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { authTranslations } from "@/lib/i18n/authTranslations";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const { language } = useLanguage();
  const tAuth = authTranslations[language]?.resetPassword || authTranslations.en.resetPassword;

  const [email, setEmail] = useState(initialEmail);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setError(tAuth.errors.enterEmail);
      return;
    }
    setError(null);
    setResending(true);
    try {
      const res = await authService.forgotPassword({ email: email.trim() });
      if (res.status !== false) {
        setSuccess(tAuth.resendSuccess);
      } else {
        setError(res.log || tAuth.errors.failed);
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg || tAuth.errors.failed);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError(tAuth.errors.enterEmail);
      return;
    }
    if (!otpCode.trim() || otpCode.trim().length !== 4) {
      setError(tAuth.errors.enterOtp);
      return;
    }
    if (newPassword.length < 6) {
      setError(tAuth.errors.minPassword);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(tAuth.errors.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.resetPassword({
        email: email.trim(),
        otp_code: otpCode.trim(),
        new_password: newPassword,
      });

      if (response.status !== false) {
        setSuccess(response.log || tAuth.successMsg);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(response.log || tAuth.errors.failed);
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg || tAuth.errors.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-cambria bg-white">
      <Navbar />
      <div className="h-[88px]" />

      <main className="flex-grow flex min-h-screen">
        {/* LEFT — Brand Image */}
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
            <h2 className="font-displayPlayFair text-4xl lg:text-5xl leading-[1.2] mb-5 whitespace-pre-line">
              {tAuth.heroTitle}
            </h2>
            <p className="text-sm leading-relaxed opacity-90 max-w-sm mb-5">
              {tAuth.heroSubtitle}
            </p>
            <div className="w-12 h-px bg-white/60" />
          </div>
        </div>

        {/* RIGHT — Reset form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center gap-6 px-8 py-6 bg-white self-stretch">
          <div className="w-full max-w-[480px]">
            <div className="mb-6">
              <h1 className="font-displayPlayFair text-[32px] font-bold text-[#1d1a17] mb-2 leading-tight">
                {tAuth.title}
              </h1>
              <p className="text-sm text-[#64748B] font-light">
                {tAuth.subtitle}
              </p>
            </div>

            <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                >
                  {tAuth.emailLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineMail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder={tAuth.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#E2E8F0] rounded-sm text-sm text-[#1d1a17] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#8b7355] transition-colors"
                  />
                </div>
              </div>

              {/* OTP Code */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="otp"
                    className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                  >
                    {tAuth.otpLabel}
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-xs text-[#8b7355] hover:underline disabled:opacity-50"
                  >
                    {resending ? tAuth.sending : tAuth.resendCode}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineKey className="w-4 h-4" />
                  </span>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={4}
                    placeholder={tAuth.otpPlaceholder}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#E2E8F0] rounded-sm text-sm font-mono tracking-widest text-[#1d1a17] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#8b7355] transition-colors"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="new_password"
                  className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                >
                  {tAuth.newPasswordLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineLockClosed className="w-4 h-4" />
                  </span>
                  <input
                    id="new_password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={tAuth.newPasswordPlaceholder}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 border border-[#E2E8F0] rounded-sm text-sm text-[#1d1a17] focus:outline-none focus:border-[#8b7355] transition-colors"
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

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm_password"
                  className="text-[11px] font-medium text-[#1d1a17] uppercase tracking-wide"
                >
                  {tAuth.confirmPasswordLabel}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-[#94A3B8] pointer-events-none">
                    <HiOutlineLockClosed className="w-4 h-4" />
                  </span>
                  <input
                    id="confirm_password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={tAuth.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#E2E8F0] rounded-sm text-sm text-[#1d1a17] focus:outline-none focus:border-[#8b7355] transition-colors"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-[#CFB9A3] hover:bg-[#bfa77f] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
                style={{ boxShadow: "0 0 20px 0 rgba(202,117,33,0.30)" }}
              >
                {loading ? tAuth.resettingPassword : tAuth.resetPasswordButton}
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

              {/* Back to Login link */}
              <p className="text-center text-xs text-[#64748B] pt-4 border-t border-[#f1f5f9]">
                {tAuth.rememberPassword}{" "}
                <Link
                  href="/login"
                  className="text-[#CFB9A3] hover:text-[#8b7355] font-semibold ml-0.5 transition-colors"
                >
                  {tAuth.backToLogin}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
