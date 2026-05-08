"use client";
import Navbar from "@/components/shared/Navbar";

interface PageHeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  overlayOpacity?: number; // 0 to 1, default 0.55
}

export default function PageHero({
  backgroundImage,
  title,
  subtitle,
  overlayOpacity = 0.55,
}: PageHeroProps) {
  return (
    <section
      className="relative w-full min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Navbar */}
      <div className="relative z-20">
        <div className="container mx-auto px-6">
          <Navbar />
        </div>
      </div>

      {/* Centered hero text */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 gap-6">
        <h1
          style={{
            color: "#FFFFFF",
            fontFamily:
              "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.90)",
            fontFamily: "Cambria, Georgia, serif",
            fontSize: "clamp(16px, 2vw, 24px)",
            fontWeight: 400,
            lineHeight: "150%",
            maxWidth: "640px",
          }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
