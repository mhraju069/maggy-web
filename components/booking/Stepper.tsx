"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface StepperProps {
  activeStep: number;
}

const Stepper: React.FC<StepperProps> = ({ activeStep }) => {
  const { t } = useLanguage();
  const flow = (t as any)?.bookingFlow?.stepper;

  const steps = [
    { id: 1, name: flow?.selectExperience || "Select Your Experience" },
    { id: 2, name: flow?.chooseTime || "Choose Your Time" },
    { id: 3, name: flow?.yourInformation || "Your Information" },
    { id: 4, name: flow?.reviewConfirm || "Review & Confirm" },
    { id: 5, name: flow?.payment || "Payment" },
  ];

  return (
    <div className="mx-auto container px-4 sm:px-6 py-4 sm:py-8">
      {/* Mobile view (< sm) */}
      <div className="sm:hidden bg-white rounded-2xl border border-[#E8E2DC] shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D1B191]">
            Step {activeStep} of {steps.length}
          </span>
          <span
            className="text-sm font-bold text-[#0F172A] truncate ml-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {steps.find((s) => s.id === activeStep)?.name || ""}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            return (
              <div
                key={step.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#D1B191]"
                    : isCompleted
                    ? "bg-[#D1B191]/70"
                    : "bg-[#E2E8F0]"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet view (>= sm) */}
      <div className="hidden sm:block bg-white rounded-[24px] border border-[#E8E2DC] shadow-sm p-6 lg:p-10">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-[16px] lg:rounded-[18px] flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-[#D1B191] text-white shadow-xl"
                        : isCompleted
                        ? "bg-[#D1B191] text-white"
                        : "bg-[#F8FAFC] text-[#94A3B8] border border-[#E2E8F0]"
                    }`}
                  >
                    <span style={{ fontFamily: "var(--font-playfair)" }}>{step.id}</span>
                  </div>
                  <span
                    className={`mt-3 lg:mt-4 text-xs lg:text-[13px] font-medium transition-colors duration-300 text-center tracking-tight max-w-[110px] ${
                      isActive ? "text-[#0F172A] font-bold" : "text-[#64748B]"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Separator Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2 lg:mx-6">
                    <div className="h-[2px] w-full bg-[#E2E8F0] rounded-full" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
