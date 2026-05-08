"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineEye, HiOutlineLockClosed, HiOutlineMail, HiOutlineUser } from "react-icons/hi";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white min-h-screen flex flex-col font-cambria">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 md:px-6">
        <div className="max-w-[1240px] w-full grid grid-cols-1 md:grid-cols-2 bg-white overflow-hidden">

          {/* Left Side: Image with Text Overlay (Matches Login Design) */}
          <div className="relative h-[450px] md:h-[650px] flex flex-col justify-center p-12 lg:p-16 text-white">
            <Image
              src="/images/login/login.png"
              alt="Luxury Room"
              fill
              className="absolute inset-0 w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 max-w-md">
              <h2 className="text-4xl lg:text-5xl font-displayPlayFair leading-[1.2] mb-8">
                Welcome to the <br /> Circle of Stillness.
              </h2>
              <p className="text-base lg:text-lg leading-relaxed font-light mb-6">
                Membership unlocks exclusive arrangements, priority reservations, and personalized wellness concierge services.
              </p>
              <div className="w-16 h-[1.5px] bg-white/60" />
            </div>
          </div>

          {/* Right Side: Signup Form (Same Style as Login) */}
          <div className="flex flex-col justify-center p-8 md:p-16 lg:px-24 bg-white">
            <div className="mb-10">
              <h1 className="text-3xl lg:text-4xl font-displayPlayFair font-bold text-[#1d1a17] mb-3">
                Member Access
              </h1>
              <p className="text-base text-[#8b7355] font-light">
                Create your account. Your Heaven awaits.
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[13px] text-[#1d1a17] font-medium" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9d8b7a]">
                    <HiOutlineUser className="w-5 h-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-sm focus:outline-none focus:border-[#8b7355] text-sm text-[#1d1a17] placeholder:text-[#9d8b7a]/50"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[13px] text-[#1d1a17] font-medium" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9d8b7a]">
                    <HiOutlineMail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-sm focus:outline-none focus:border-[#8b7355] text-sm text-[#1d1a17] placeholder:text-[#9d8b7a]/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[13px] text-[#1d1a17] font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9d8b7a]">
                    <HiOutlineLockClosed className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="w-full pl-10 pr-12 py-3 border border-[#E2E8F0] rounded-sm focus:outline-none focus:border-[#8b7355] text-sm text-[#1d1a17]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9d8b7a] hover:text-[#8b7355]"
                  >
                    <HiOutlineEye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Signup Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-[#D1BC9D] hover:bg-[#8B7355] text-white font-bold rounded-sm transition-colors uppercase tracking-widest text-sm"
                >
                  <span>Sign Up</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Redirect to Login */}
              <div className="text-center pt-6">
                <p className="text-[#9d8b7a] text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#d1bc9d] hover:underline font-medium ml-1">
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
