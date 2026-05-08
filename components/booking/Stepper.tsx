"use client";

import React from "react";

const steps = [
  { id: 1, name: "Select Your Experience" },
  { id: 2, name: "Choose Your Time" },
  { id: 3, name: "Your Information" },
  { id: 4, name: "Review & Confirm" },
  { id: 5, name: "Payment" },
];

interface StepperProps {
  activeStep: number;
}

const Stepper: React.FC<StepperProps> = ({ activeStep }) => {
  return (
    <div className="mx-auto container px-6 py-8">
      <div className="bg-white rounded-[24px] border border-[#E8E2DC] shadow-sm p-10">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-14 h-14 rounded-[18px] flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
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
                    className={`mt-4 text-[13px] font-medium transition-colors duration-300 text-center tracking-tight ${
                      isActive ? "text-[#0F172A] font-bold" : "text-[#64748B]"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Separator Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-6">
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
