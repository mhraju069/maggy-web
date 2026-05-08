"use client";

import Image from "next/image";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const CheckIcon = () => (
  <IoMdCheckmarkCircleOutline size={20} color="#CFB9A3" />
);

type PaymentType = "full" | "partial" | "spot";

const paymentBadge: Record<PaymentType, { label: string; bg: string }> = {
  full: { label: "Full prepayment", bg: "#E59A50" },
  partial: { label: "Partial payment", bg: "#475569" },
  spot: { label: "Pay on the spot", bg: "#0F172A" },
};

interface ArrangementCardProps {
  id: number;
  image: string;
  rating: number;
  title: string;
  combo: string;
  description: string;
  includes: string[];
  paymentType: PaymentType;
  price: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ArrangementCard({
  image,
  rating,
  title,
  combo,
  description,
  includes,
  paymentType,
  price,
  isSelected,
  onClick,
}: ArrangementCardProps) {
  const badge = paymentBadge[paymentType];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[24px] overflow-hidden flex flex-col cursor-pointer transition-all duration-500 border-2 ${
        isSelected ? "border-[#CFB9A3] ring-2 ring-[#CFB9A3] ring-opacity-20 translate-y-[-4px]" : "border-transparent"
      }`}
      style={{ boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)" }}
    >
      {/* Image */}
      <div className="relative w-full h-48">
        <Image src={image} alt={title} fill className="object-cover" />
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5"
          style={{
            padding: "8px 12px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#FDC700"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span
            className="text-base font-bold text-[#0F172A]"
            style={{ fontFamily: "Inter, sans-serif", lineHeight: "150%" }}
          >
            {rating}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <h3
          className="text-2xl font-bold text-[#0F172A] leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {title}
        </h3>

        <p
          className="text-[#475569] text-base"
          style={{ fontFamily: "Cambria, Georgia, serif" }}
        >
          {combo}
        </p>

        <p
          className="text-[#475569] text-base leading-relaxed"
          style={{ fontFamily: "Cambria, Georgia, serif" }}
        >
          {description}
        </p>

        <ul className="flex flex-col gap-3 mt-1">
          {includes.map((inc, i) => (
            <li key={i} className="flex items-center gap-3">
              <span
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 31,
                  height: 31,
                  borderRadius: 999,
                  background: "rgba(255, 107, 74, 0.10)",
                }}
              >
                <CheckIcon />
              </span>
              <span
                className="text-[#475569] text-base"
                style={{ fontFamily: "Cambria, Georgia, serif" }}
              >
                {inc}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex-1" />

        {/* Badge + price */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid #E2E8F0" }}
        >
          <span
            className="text-white text-xs"
            style={{
              background: badge.bg,
              borderRadius: 12,
              padding: "7px 10px",
              fontFamily: "var(--font-playfair)",
            }}
          >
            {badge.label}
          </span>
          <span
            className="text-3xl font-bold text-[#0F172A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
