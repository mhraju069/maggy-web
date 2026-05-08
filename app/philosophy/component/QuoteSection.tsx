"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function QuoteSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-[#8B7355] py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-[1100px] mx-auto text-center">
          <blockquote>
            <p
              style={{
                fontSize: "clamp(24px, 3.5vw, 48px)",
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontWeight: 500,
                lineHeight: "150%",
                color: "#FFFFFF",
                marginBottom: "1.5rem",
              }}
            >
              {t.philosophyPage.quote.text}
            </p>
            <footer
              style={{
                fontSize: "clamp(14px, 1.5vw, 18px)",
                fontFamily: "Cambria, Georgia, serif",
                fontWeight: 400,
                lineHeight: "150%",
                color: "rgba(255, 255, 255, 0.80)",
              }}
            >
              — {t.philosophyPage.quote.author}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
