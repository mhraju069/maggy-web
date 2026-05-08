"use client";

import Image from "next/image";
import Link from "next/link";
import { FiClock } from "react-icons/fi";
import { IoFolderOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";

interface SaunaCardProps {
  title: string;
  description: string;
  image: string;
  rating: number;
  capacity: string;
  duration: string;
  paymentType: string;
  price: number;
  bookingLink?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function SaunaCard({
  title,
  description,
  image,
  rating,
  capacity,
  duration,
  paymentType,
  price,
  bookingLink,
  onClick,
  isSelected,
}: SaunaCardProps) {
  const content = (
    <div
      onClick={onClick}
      className={`bg-white rounded-[24px] overflow-hidden flex flex-col cursor-pointer transition-all duration-500 border-2 ${
        isSelected ? "border-[#CFB9A3] ring-2 ring-[#CFB9A3] ring-opacity-20 translate-y-[-4px]" : "border-transparent"
      }`}
      style={{ boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)" }}
    >
      {/* Image Section with Rating Badge */}
      <div className="relative w-full h-64 md:h-72">
        <Image src={image} alt={title} fill className="object-cover" />
        {/* Rating Badge */}
        <div
          className="absolute top-4 right-4 bg-white/95 rounded-[14px] px-3 py-2 shadow-lg flex items-center gap-1.5"
          style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#FDC700"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span
            style={{ fontFamily: "Inter, sans-serif" }}
            className="text-base font-bold text-[#0F172A]"
          >
            {rating}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col grow gap-4">
        {/* Title */}
        <h3
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-3xl font-bold text-[#0F172A]"
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-[#475569] text-base leading-relaxed"
          style={{ fontFamily: "Cambria, Georgia, serif" }}
        >
          {description}
        </p>

        {/* Features List */}
        <div className="flex flex-col gap-4 my-2">
          {/* Capacity */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FF6B4A1A] flex items-center justify-center shrink-0">
              <LuUsers className="w-5 h-5 text-[#CFB9A3]" strokeWidth={1.5} />
            </div>
            <span
              className="text-[#475569] text-base"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {capacity}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FF6B4A1A] flex items-center justify-center shrink-0">
              <FiClock className="w-5 h-5 text-[#CFB9A3]" strokeWidth={1.5} />
            </div>
            <span
              className="text-[#475569] text-base"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {duration}
            </span>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FF6B4A1A] flex items-center justify-center shrink-0">
              <IoFolderOutline
                className="w-5 h-5 text-[#CFB9A3]"
                strokeWidth={1.5}
              />
            </div>
            <span
              className="text-[#475569] text-base"
              style={{ fontFamily: "Cambria, Georgia, serif" }}
            >
              {paymentType}
            </span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Price Section */}
        <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-sm font-bold text-[#64748B] uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>Investment</span>
          <span
            style={{ fontFamily: "var(--font-playfair)" }}
            className="text-4xl font-bold text-[#0F172A]"
          >
            ${price}
          </span>
        </div>
      </div>
    </div>
  );

  if (bookingLink) {
    return (
      <Link href={bookingLink} className="block grow">
        {content}
      </Link>
    );
  }

  return content;
}
