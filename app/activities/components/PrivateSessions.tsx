"use client";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

const PrivateSessions = () => {
  const { t } = useLanguage();
  const s = t.activitiesPage.privateSessions;

  return (
    <section className="py-24" style={{ background: "#E8DFD5" }}>
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: 48,
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: "140%",
              }}
            >
              {s.title}
            </h2>
            <div className="flex justify-center w-full">
              <DecorativeUnderline />
            </div>
          </div>

          <p
            style={{
              fontFamily: "Cambria, Georgia, serif",
              fontSize: 18,
              color: "#475569",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            {s.body}
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
              style={{
                color: "#5D360F",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 16,
                fontWeight: 700,
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

export default PrivateSessions;
