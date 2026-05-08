"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

const MembershipCTA = () => {
  const { t } = useLanguage();
  const s = t.membershipsPage.cta;

  return (
    <section className="py-24" style={{ background: "#E8DFD5" }}>
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#0F172A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {s.title}
            </h2>
            <div className="flex justify-center w-full">
              <DecorativeUnderline />
            </div>
          </div>

          <p
            className="text-[#475569] text-lg leading-relaxed"
            style={{ fontFamily: "Cambria, Georgia, serif" }}
          >
            {s.subtitle}
          </p>

          <Link
            href="/contact"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
            style={{
              padding: "16px 32px",
              border: "1px solid #5D360F",
              borderRadius: 12,
            }}
          >
            <span
              className="text-base font-bold"
              style={{
                color: "#5D360F",
                fontFamily: "Cambria, Georgia, serif",
              }}
            >
              {s.button}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5D360F"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MembershipCTA;
