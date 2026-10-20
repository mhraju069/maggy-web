"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";

export default function SaunaOfferings() {
  const { t } = useLanguage();
  const spaces = t.wellnessPage?.spaces;

  const images = [
    "/images/wellness/bookings/private-sauna-v2.png",
    "/images/wellness/bookings/shared-sauna-v2.png",
    "/images/wellness/bookings/saltroom-v2.png",
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center">
          <h2
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-2"
          >
            {spaces?.title || "Three Spaces, Your Way to Relax"}
          </h2>
          <DecorativeUnderline />
          <p
            className="text-[#475569] text-lg md:text-xl max-w-[700px] mt-6 font-serif"
          >
            {spaces?.subtitle ||
              "Discover three unique spaces designed for relaxation, connection and natural well-being."}
          </p>
        </div>

        {/* 3 Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {spaces?.items?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col bg-[#FCF2E9] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={images[idx % images.length]}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between text-center">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-[#0F172A] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-base font-serif text-[#475569] leading-relaxed">
                    {item.body}
                  </p>
                </div>
                <div className="mt-6">
                  {idx === 2 ? (
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Link
                        href="/wellness/saltroom"
                        className="inline-flex items-center justify-center px-4 py-2.5 bg-[#8B7355] text-white font-serif font-bold text-sm rounded-lg hover:bg-[#725e44] transition-colors"
                      >
                        Explore Salt Room
                      </Link>
                      <Link
                        href="/booking/arrangements"
                        className="inline-flex items-center justify-center px-4 py-2.5 border border-[#8B7355] text-[#8B7355] font-serif font-bold text-sm rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors"
                      >
                        {t.wellnessPage?.cta?.button || "Reserve"}
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={idx === 0 ? "/booking/sauna?type=private" : "/booking/sauna?type=shared"}
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#8B7355] text-white font-serif font-bold rounded-lg hover:bg-[#725e44] transition-colors"
                    >
                      {t.wellnessPage?.cta?.button || "Reserve"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
