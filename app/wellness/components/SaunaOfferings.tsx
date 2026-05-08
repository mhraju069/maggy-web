"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import SaunaCard from "@/components/shared/SaunaCard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

// Dummy data for sauna offerings
const saunaData = [
  {
    id: 1,
    title: "Private Sauna",
    description:
      "Your own exclusive sanctuary for ultimate privacy and relaxation.",
    image: "/images/wellness/bookings/private-sauna.png",
    rating: 4.9,
    capacity: "Up to 6 persons",
    duration: "2-hour sessions",
    paymentType: "Prepayment required",
    price: 210,
    bookingLink: "/booking?type=private",
  },
  {
    id: 2,
    title: "Shared Sauna",
    description: "Join our wellness experience in a peaceful, shared space.",
    image: "/images/wellness/bookings/shared-sauna.png",
    rating: 4.9,
    capacity: "Limited capacity",
    duration: "Flexible sessions",
    paymentType: "Pay upon arrival",
    price: 140,
    bookingLink: "/booking?type=shared",
  },
];

export default function SaunaOfferings() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header with View All Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            {/* Title with Decorative Underline */}
            <h2
              style={{ fontFamily: "var(--font-playfair)" }}
              className="text-[clamp(32px,4vw,48px)] font-bold text-[#0F172A] mb-2"
            >
              {t.wellnessPage?.saunaOfferings?.title || "Sauna & Wellness"}
            </h2>
            {/* Decorative Underline */}
            <DecorativeUnderline />
            {/* Subtitle */}
            <p
              className="text-[#475569] text-lg md:text-xl max-w-[600px] mt-6"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {t.wellnessPage?.saunaOfferings?.subtitle ||
                "Choose between private exclusivity or shared serenity"}
            </p>
          </div>

          {/* View All Button */}
          <Link
            href="/suites"
            className="mt-6 md:mt-0 inline-flex items-center gap-3 px-6 py-3 border border-[#CFB9A3] text-[#0F172A] font-semibold rounded-sm hover:bg-[#CFB9A3] hover:bg-opacity-10 transition-colors"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            View All Suites
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

        {/* Sauna Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {saunaData.map((sauna) => (
            <SaunaCard
              key={sauna.id}
              title={sauna.title}
              description={sauna.description}
              image={sauna.image}
              rating={sauna.rating}
              capacity={sauna.capacity}
              duration={sauna.duration}
              paymentType={sauna.paymentType}
              price={sauna.price}
              bookingLink={sauna.bookingLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
