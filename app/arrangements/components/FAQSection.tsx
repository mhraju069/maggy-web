"use client";

import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";

const FAQSection = () => {
  const { t } = useLanguage();
  const s = t.arrangementsPage.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section className="py-20 bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#0F172A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {s.title}
          </h2>
          <div className="flex justify-center mt-1">
            <DecorativeUnderline />
          </div>
          <p
            className="mt-4 text-[#475569] text-base leading-relaxed mx-auto"
            style={{ fontFamily: "Cambria, Georgia, serif", maxWidth: 480 }}
          >
            {s.subtitle}
          </p>
        </div>

        {/* Accordion — each item is its own card */}
        <div className="flex flex-col" style={{ gap: 8 }}>
          {s.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  border: "1px solid #CFB9A3",
                  borderRadius: 16,
                  boxShadow: "0 0 20px 0 rgba(0, 51, 102, 0.06)",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <button
                  className="w-full flex items-center justify-between text-left"
                  style={{ padding: "16px 24px", gap: 16 }}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span
                    className="text-[#0F172A]"
                    style={{
                      fontFamily: "Cambria, Georgia, serif",
                      fontSize: 18,
                      fontWeight: isOpen ? 700 : 400,
                      lineHeight: "150%",
                    }}
                  >
                    {item.question}
                  </span>
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 32,
                      height: 32,
                      border: "1px solid #CFB9A3",
                      color: "#CFB9A3",
                      fontSize: 18,
                      lineHeight: 1,
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    ›
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 24px 16px" }}>
                    <p
                      className="text-[#475569] text-base leading-relaxed"
                      style={{
                        fontFamily: "Cambria, Georgia, serif",
                        fontWeight: 400,
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
