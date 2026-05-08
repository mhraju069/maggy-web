"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const CheckIcon = () => (
  <IoMdCheckmarkCircleOutline size={20} color="#CFB9A3" />
);

/* ─── Static data (replace with API call later) ─── */
type PaymentType = "full" | "partial" | "spot";

interface Arrangement {
  id: number;
  image: string;
  rating: number;
  title: string;
  combo: string;
  description: string;
  includes: string[];
  paymentType: PaymentType;
  price: string;
}

const arrangements: Arrangement[] = [
  {
    id: 1,
    image: "/images/arrangements/cardimages/img1.png",
    rating: 4.9,
    title: "Wellness Escape",
    combo: "Sauna + Massage + Lunch",
    description:
      "A complete day of relaxation combining our finest wellness services.",
    includes: [
      "2-hour private sauna session",
      "60-minute therapeutic massage",
      "Seasonal lunch menu",
      "Herbal tea selection",
    ],
    paymentType: "full",
    price: "$210",
  },
  {
    id: 2,
    image: "/images/arrangements/cardimages/img2.png",
    rating: 4.9,
    title: "Active Retreat",
    combo: "Yoga + Sauna + Dining",
    description: "Balance mind and body with movement, heat, and nourishment.",
    includes: [
      "Morning yoga session",
      "Shared sauna access",
      "Healthy lunch bowl",
      "Meditation guide",
    ],
    paymentType: "partial",
    price: "$210",
  },
  {
    id: 3,
    image: "/images/arrangements/cardimages/img3.png",
    rating: 4.9,
    title: "Group Experience",
    combo: "Private Sauna + Activities + Catering",
    description:
      "Perfect for celebrations, team building, or gatherings with loved ones.",
    includes: [
      "Private sauna (up to 18 persons)",
      "Guided wellness activity",
      "Premium catering service",
      "Dedicated host",
    ],
    paymentType: "spot",
    price: "$210",
  },
  {
    id: 4,
    image: "/images/arrangements/cardimages/img1.png",
    rating: 4.9,
    title: "Wellness Escape",
    combo: "Sauna + Massage + Lunch",
    description:
      "A complete day of relaxation combining our finest wellness services.",
    includes: [
      "2-hour private sauna session",
      "60-minute therapeutic massage",
      "Seasonal lunch menu",
      "Herbal tea selection",
    ],
    paymentType: "full",
    price: "$210",
  },
  {
    id: 5,
    image: "/images/arrangements/cardimages/img2.png",
    rating: 4.9,
    title: "Active Retreat",
    combo: "Yoga + Sauna + Dining",
    description: "Balance mind and body with movement, heat, and nourishment.",
    includes: [
      "Morning yoga session",
      "Shared sauna access",
      "Healthy lunch bowl",
      "Meditation guide",
    ],
    paymentType: "partial",
    price: "$210",
  },
  {
    id: 6,
    image: "/images/arrangements/cardimages/img3.png",
    rating: 4.9,
    title: "Group Experience",
    combo: "Private Sauna + Activities + Catering",
    description:
      "Perfect for celebrations, team building, or gatherings with loved ones.",
    includes: [
      "Private sauna (up to 18 persons)",
      "Guided wellness activity",
      "Premium catering service",
      "Dedicated host",
    ],
    paymentType: "spot",
    price: "$210",
  },
];

import ArrangementCard from "@/components/shared/ArrangementCard";

// ... existing code ...

const ArrangementsGrid = () => {
  const { t } = useLanguage();
  const bookLabel = t.arrangementsPage?.grid?.bookButton || "Book Arrangement";

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {arrangements.map((item) => {
            return (
              <div key={item.id} className="flex flex-col">
                <ArrangementCard {...item} />
                {/* Book button — Figma: border 1px #CFB9A3, border-radius 12px, padding 16px 32px */}
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full transition-colors hover:bg-[#FCF2E9] mt-4"
                  style={{
                    border: "1px solid #CFB9A3",
                    borderRadius: 12,
                    padding: "16px 32px",
                  }}
                >
                  <span
                    className="text-base font-bold"
                    style={{
                      color: "#CFB9A3",
                      fontFamily: "Cambria, Georgia, serif",
                    }}
                  >
                    {bookLabel}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#CFB9A3"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArrangementsGrid;
