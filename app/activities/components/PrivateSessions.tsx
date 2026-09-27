"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

const PrivateSessions = () => {
  const { t } = useLanguage();
  const partner = t.activitiesPage?.partner;
  const s = t.activitiesPage?.privateSessions;

  const title = partner?.title || s?.title || "Become a Partner of Heaven on Earth";
  const body =
    partner?.description ||
    s?.body ||
    "Would you like to organise your own workshops, ceremonies, retreats or other events at our venue? We would love to collaborate with inspiring professionals who want to share their work in a unique setting. Contact us to explore the possibilities.";
  const buttonText = t.navbar?.contact || s?.button || "Contact Us";

  return (
    <section className="py-16 sm:py-20 lg:py-24 pb-20 sm:pb-24 lg:pb-28 bg-[#E8DFD5]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center">
            <h2
              className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#0F172A] break-words max-w-full"
              style={{
                fontFamily: "var(--font-playfair)",
                lineHeight: "140%",
              }}
            >
              {title}
            </h2>
            <div className="flex justify-center w-full mt-2">
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
            {body}
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
              {buttonText}
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
