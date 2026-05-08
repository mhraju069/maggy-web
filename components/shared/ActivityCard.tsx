"use client";

import Image from "next/image";
import { AiOutlineClockCircle } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";

interface Activity {
  name: string;
  time: string;
  capacity: string;
  location: string;
  duration: string;
  price: string;
  image: string;
}

interface ActivityCardProps {
  activity: Activity;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ActivityCard({
  activity,
  isSelected,
  onClick,
}: ActivityCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 24,
        background: "#FFFFFF",
        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
        overflow: "hidden",
        alignSelf: "stretch",
        cursor: "pointer",
        transition: "all 0.5s ease",
        border: isSelected ? "2px solid #CFB9A3" : "2px solid transparent",
        outline: isSelected ? "4px solid rgba(207, 185, 163, 0.2)" : "none",
        transform: isSelected ? "translateY(-4px)" : "none",
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 283,
          flexShrink: 0,
        }}
      >
        <Image
          src={activity.image}
          alt={activity.name}
          fill
          style={{
            objectFit: "cover",
            borderRadius: "16px 16px 0 0",
          }}
        />
      </div>

      {/* Card Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "24px 24px 32px 24px",
          flex: 1,
        }}
      >
        {/* Name */}
        <h3
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 24,
            fontWeight: 700,
            color: "#0F172A",
            lineHeight: "140%",
            margin: 0,
          }}
        >
          {activity.name}
        </h3>

        {/* Meta rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Time */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 24,
                height: 24,
                borderRadius: 999,
                background: "rgba(255, 107, 74, 0.10)",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <AiOutlineClockCircle size={16} color="#8B7355" />
            </div>
            <span
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 16,
                fontWeight: 400,
                color: "#475569",
                lineHeight: "150%",
              }}
            >
              {activity.time}
            </span>
          </div>

          {/* People */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 24,
                height: 24,
                borderRadius: 999,
                background: "rgba(255, 107, 74, 0.10)",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <LuUsers size={16} color="#8B7355" />
            </div>
            <span
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 16,
                fontWeight: 400,
                color: "#475569",
                lineHeight: "150%",
              }}
            >
              {activity.capacity}
            </span>
          </div>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 24,
                height: 24,
                borderRadius: 999,
                background: "rgba(255, 107, 74, 0.10)",
                padding: 4,
                flexShrink: 0,
              }}
            >
              <IoLocationOutline size={16} color="#8B7355" />
            </div>
            <span
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 16,
                fontWeight: 400,
                color: "#475569",
                lineHeight: "150%",
              }}
            >
              {activity.location}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom row: duration + price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Cambria, Georgia, serif",
              fontSize: 18,
              fontWeight: 400,
              color: "#6B5D54",
              lineHeight: "150%",
            }}
          >
            {activity.duration}
          </span>
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 24,
              fontWeight: 700,
              color: "#6B5D54",
              lineHeight: "150%",
              textAlign: "right",
            }}
          >
            {activity.price}
          </span>
        </div>
      </div>
    </div>
  );
}
