"use client";

import Link from "next/link";

interface CTASectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function CTASection({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundColor = "#8B7355",
  textColor = "#FFFFFF",
}: CTASectionProps) {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor }}>
      <div className="container mx-auto px-6 text-center">
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            color: textColor,
          }}
          className="text-[clamp(32px,4vw,48px)] font-bold mb-4"
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "Cambria, Georgia, serif",
            color: textColor,
            opacity: 0.9,
          }}
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
        >
          {subtitle}
        </p>
        <Link
          href={buttonLink}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0F172A] font-bold rounded-sm hover:bg-opacity-90 transition-colors shadow-md"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {buttonText}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 5L19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
