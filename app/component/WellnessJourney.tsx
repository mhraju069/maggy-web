"use client";
import BookNow from "@/components/shared/BookNow";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const WellnessJourney = () => {
  const { t } = useLanguage();
  return (
    <section
      className="relative w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/home/journey/wellnessjourney.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "390px",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6 max-w-xl lg:max-w-3xl">
        <h2
          style={{
            color: "#FFFFFF",
            fontFamily:
              "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            lineHeight: "67.2px",
          }}
        >
          {t.wellnessJourney.title}
        </h2>
        <p
          style={{
            color: "#F3F4F6",
            fontFamily: "Cambria, Georgia, serif",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "27px",
          }}
        >
          {t.wellnessJourney.subtitle}
        </p>
        <div className="mt-2">
          <BookNow href="/booking" />
        </div>
      </div>
    </section>
  );
};

export default WellnessJourney;
