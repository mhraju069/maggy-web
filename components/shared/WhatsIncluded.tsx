"use client";

import DecorativeUnderline from "./DecorativeUnderline";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface WhatsIncludedProps {
  title: string;
  subtitle: string;
  features: Feature[];
  backgroundColor?: string;
}

export default function WhatsIncluded({
  title,
  subtitle,
  features,
  backgroundColor = "#FCF2E9",
}: WhatsIncludedProps) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor }}>
      <div className="container mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-2"
          >
            {title}
          </h2>
          <div className="flex justify-center">
            <DecorativeUnderline />
          </div>
          <p
            className="text-[#6B5D54] text-lg mt-4"
            style={{ fontFamily: "Cambria, Georgia, serif" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#E8DFD5] flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <p
                className="text-[#6B5D54] text-base"
                style={{ fontFamily: "Cambria, Georgia, serif" }}
              >
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
