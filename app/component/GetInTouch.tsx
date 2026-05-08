"use client";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";

const GetInTouch = () => {
  const { t } = useLanguage();
  return (
    <section
      className="w-full min-h-screen flex items-center overflow-hidden"
      style={{ background: "#f5f1ed" }}
    >
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-16 lg:py-24">
        {/* Left: image with blob clip-path */}
        <div
          className="relative w-full lg:flex-shrink-0 lg:w-[480px] h-[340px] sm:h-[440px] lg:h-[580px]"
          style={{
            clipPath:
              "path('M240,0 C340,0 420,70 420,180 C420,290 360,370 300,460 C240,550 120,590 50,540 C-20,490 0,360 0,240 C0,120 20,50 80,20 C130,0 180,0 240,0 Z')",
            overflow: "hidden",
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
        <div className="flex flex-col gap-8 w-full lg:max-w-[605px] text-center lg:text-left">
          {/* Title */}
          <div className="flex flex-col gap-3">
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
            {t.getInTouch.contacts.map((item) => (
              <div key={item.label} className="flex flex-col gap-0">
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
                    fontSize: "20px",
                    fontWeight: 400,
                    lineHeight: "30px",
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
