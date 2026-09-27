"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const GetInTouch = () => {
  const { t } = useLanguage();
  return (
    <section
      className="w-full min-h-screen flex items-center"
      style={{ background: "#f5f1ed" }}
    >
      <div className="container mx-auto px-6 max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 py-16 lg:py-24">
        {/* Left: blob image */}
        <div
          className="relative w-full max-w-[480px] lg:flex-shrink-0 lg:w-[480px] h-[340px] sm:h-[440px] lg:h-[580px] mx-auto lg:mx-0"
          style={{
            clipPath:
              "path('M270,0 C370,0 450,70 450,180 C450,290 390,370 330,460 C270,550 150,590 80,540 C10,490 30,360 30,240 C30,120 50,50 110,20 C160,0 210,0 270,0 Z')",
          }}
        >
          <Image
            src="/images/home/getintouch/image1.png"
            alt="Get in touch"
            fill
            className="object-cover"
          />
        </div>

        {/* Right: text */}
        <div className="flex flex-col gap-8 w-full lg:max-w-[605px] text-center lg:text-left lg:pl-6">
          {/* Title */}
          <div className="flex flex-col gap-3 items-center lg:items-start">
            <h2
              style={{
                color: "#0F172A",
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', Georgia, serif",
                fontSize: "48px",
                fontWeight: 700,
                lineHeight: "67.2px",
              }}
            >
              {t.getInTouch.title}
            </h2>
            <DecorativeUnderline />
          </div>

          {/* Contact items */}
          <div className="flex flex-col gap-6">
            {t.getInTouch.contacts.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <p
                  style={{
                    color: "#0F172A",
                    fontFamily: "Cambria, Georgia, serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    lineHeight: "30px",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    color: "#475569",
                    fontFamily: "Cambria, Georgia, serif",
                    fontSize: "18px",
                    fontWeight: 400,
                    lineHeight: "28px",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
