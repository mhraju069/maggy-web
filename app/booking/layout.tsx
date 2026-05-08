"use client";

import Stepper from "@/components/booking/Stepper";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { usePathname } from "next/navigation";
import React from "react";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine active step based on pathname
  let activeStep = 1;
  const path = pathname.split("/").pop();

  if (["choose-time"].includes(path || "")) activeStep = 2;
  else if (["information"].includes(path || "")) activeStep = 3;
  else if (["review"].includes(path || "")) activeStep = 4;
  else if (["payment", "confirmation"].includes(path || "")) activeStep = 5;
  else activeStep = 1; // Default for selection pages (/booking, /booking/sauna, etc.)

  return (
    <div className="min-h-screen bg-[#FBF6F3] pt-[88px]">
      <Navbar />
      <div className="pb-8">
        <Stepper activeStep={activeStep} />
      </div>
      <div className="container mx-auto px-6">
        <main className="bg-[#FCF2E9] py-16 md:py-24 rounded-[32px] overflow-hidden">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
