"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

export default function ExperiencePhilosophy() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontWeight: 700,
              lineHeight: "140%",
              color: "#0F172A",
              marginBottom: "1rem",
            }}
          >
            {t.philosophyPage.experienceCTA.title}
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              fontFamily: "Cambria, Georgia, serif",
              fontWeight: 400,
              lineHeight: "150%",
              color: "#475569",
              marginBottom: "2rem",
            }}
          >
            {t.philosophyPage.experienceCTA.subtitle}
          </p>
          <Link
            href="/wellness"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              backgroundColor: "#CFB9A3",
              color: "#0F172A",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "150%",
              textDecoration: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 0 20px 0 rgba(202, 117, 33, 0.30)",
            }}
            className="hover:shadow-[0_0_28px_0_rgba(202,117,33,0.40)] hover:scale-105"
          >
            {t.philosophyPage.experienceCTA.button}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
