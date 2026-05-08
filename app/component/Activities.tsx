"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import { useState } from "react";
import { RiArrowLeftLine, RiArrowRightWideLine } from "react-icons/ri";

const slideImages = [
  "/images/home/activities/activity1.png",
  "/images/home/activities/activity2.png",
  "/images/home/activities/activity3.png",
];

const Activities = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();
  const slides = t.activities.items.map((item, i) => ({
    ...item,
    kicker: t.activities.kicker,
    image: slideImages[i],
  }));

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{ background: "#E8DFD6" }}
    >
      {/* Prev arrow — left edge */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-white/60 hover:bg-white transition text-[#6b5945]"
      >
        <RiArrowLeftLine size={24} />
      </button>

      {/* Content row */}
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-16 lg:py-24">
        {/* Left: fixed-size image */}
        <div className="relative w-full lg:flex-shrink-0 lg:w-[720px] h-[280px] sm:h-[400px] lg:h-[600px]">
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right text */}
        <div className="flex flex-col gap-5 max-w-[512px]">
          {/* Kicker */}
          <p
            style={{
              color: "#8b7355",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "16px",
              letterSpacing: "3.3px",
              textTransform: "uppercase",
            }}
          >
            {slide.kicker}
          </p>

          {/* Title */}
          <h2
            style={{
              color: "#6b5945",
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 400,
              lineHeight: "1.33",
              letterSpacing: "0.96px",
            }}
          >
            {slide.title}
          </h2>

          {/* Subtitle */}
          <p
            style={{
              color: "#6b5945",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "16px",
              fontWeight: 700,
              lineHeight: "24px",
            }}
          >
            {slide.subtitle}
          </p>

          {/* Body */}
          <p
            style={{
              color: "#9d8b7a",
              fontFamily: "Cambria, Georgia, serif",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "32px",
            }}
          >
            {slide.body}
          </p>
        </div>
      </div>

      {/* Next arrow — right edge */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#CFB9A3] hover:bg-[#bfa890] transition text-[#1d1a17]"
      >
        <RiArrowRightWideLine size={24} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all rounded-full ${
              i === current ? "w-8 h-2 bg-[#CFB9A3]" : "w-2 h-2 bg-[#6b5945]/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Activities;
