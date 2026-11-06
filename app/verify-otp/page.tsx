"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { authService, parseApiErrorMessage } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { authTranslations } from "@/lib/i18n/authTranslations";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const tAuth = authTranslations[language]?.verifyOtp || authTranslations.en.verifyOtp;

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !otpCode.trim()) {
      setError(tAuth.errors.fillAll);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp({
        email: email.trim(),
        otp_code: otpCode.trim(),
      });

      if (response.status === false) {
        setError(parseApiErrorMessage(response) || tAuth.errors.failed);
      } else {
        const msg = response.log || tAuth.successMsg;
        setSuccessMessage(msg);
        const redirectParam = searchParams.get("redirect");
        setTimeout(() => {
          router.push(`/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`);
        }, 1500);
      }
    } catch (err: unknown) {
      const msg = parseApiErrorMessage((err as { data?: unknown })?.data || err);
      setError(msg || tAuth.errors.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1240px] w-full grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden">
      {/* Left Side: Image Overlay */}
      <div className="relative h-[450px] md:h-[650px] flex flex-col justify-center p-12 lg:p-16 text-white">
        <Image
          src="/images/login/login.png"
          alt="Luxury Sanctuary"
          fill
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl lg:text-5xl font-displayPlayFair leading-[1.2] mb-8 whitespace-pre-line">
            {tAuth.heroTitle}
          </h2>
          <p className="text-base lg:text-lg leading-relaxed font-light mb-6">
            {tAuth.heroSubtitle}
          </p>
          <div className="w-16 h-[1.5px] bg-white/60" />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col justify-center p-8 md:p-16 lg:px-24 bg-white">
        <div className="mb-10">
          <div className="w-12 h-12 rounded-full bg-[#F4EFEA] flex items-center justify-center text-[#8B7355] mb-4">
            <FiShield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-displayPlayFair font-bold text-[#1d1a17] mb-3">
            {tAuth.title}
          </h1>
          <p className="text-base text-[#8b7355] font-light">
            {tAuth.subtitle}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-[13px] text-[#1d1a17] font-medium" htmlFor="email">
              {tAuth.emailLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9d8b7a]">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tAuth.emailPlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-sm focus:outline-none focus:border-[#8b7355] text-sm text-[#1d1a17]"
              />
            </div>
          </div>

          {/* OTP Code */}
          <div className="space-y-2">
            <label className="text-[13px] text-[#1d1a17] font-medium" htmlFor="otp_code">
              {tAuth.otpLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9d8b7a]">
                <FiShield className="w-5 h-5" />
              </div>
              <input
                id="otp_code"
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={tAuth.otpPlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-sm focus:outline-none focus:border-[#8b7355] text-sm font-mono text-[#1d1a17] tracking-widest placeholder:tracking-normal"
              />
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-sm">
              {successMessage}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-4 bg-[#D1BC9D] hover:bg-[#8B7355] disabled:opacity-60 text-white font-bold rounded-sm transition-colors uppercase tracking-widest text-sm"
            >
              <span>{loading ? tAuth.verifying : tAuth.verifyButton}</span>
              {!loading && <FiArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Link back to Signup / Login */}
          <div className="text-center pt-6 space-y-2">
            <p className="text-[#9d8b7a] text-sm">
              {tAuth.didNotReceive}{" "}
              <Link href="/signup" className="text-[#d1bc9d] hover:underline font-medium ml-1">
                {tAuth.signUpAgain}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function VerifyOtpFallback() {
  const { language } = useLanguage();
  const tAuth = authTranslations[language]?.verifyOtp || authTranslations.en.verifyOtp;
  return <div className="p-8 text-center text-[#8b7355]">{tAuth.loadingForm}</div>;
}

export default function VerifyOtpPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-cambria">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 md:px-6">
        <Suspense fallback={<VerifyOtpFallback />}>
          <VerifyOtpContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
