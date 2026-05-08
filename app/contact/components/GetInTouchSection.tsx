"use client";

import { useState } from "react";
import Image from "next/image";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";

const infoCards = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          fill="#8B7355"
        />
      </svg>
    ),
    title: "Address",
    lines: ["123 Serenity Lane", "Tranquil Valley, CA 94000"],
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
          fill="#8B7355"
        />
      </svg>
    ),
    title: "Phone",
    lines: ["(555) 123-4567"],
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
          fill="#8B7355"
        />
      </svg>
    ),
    title: "Email",
    lines: ["hello@serene.com"],
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
          fill="#8B7355"
        />
      </svg>
    ),
    title: "Hours",
    lines: ["Monday – Friday: 7:00 AM – 9:00 PM", "Saturday – Sunday: 8:00 AM – 8:00 PM"],
  },
];

export default function GetInTouchSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(form);
  };

  return (
    <section className="w-full" style={{ background: "#F8F4F0" }}>
      {/* ── Section Header ── */}
      <div className="w-full flex flex-col items-center gap-4 pt-16 pb-12 px-6">
        <div className="flex flex-col items-center gap-2">
          <h2
            style={{
              color: "#0F172A",
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: "140%",
              textAlign: "center",
            }}
          >
            Get in Touch
          </h2>
          <DecorativeUnderline />
        </div>
        <p
          style={{
            color: "#6B5D54",
            fontFamily: "Cambria, Georgia, serif",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "150%",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          For general questions, special requests, or corporate inquiries, our
          team is happy to assist you.{" "}
          <br className="hidden sm:block" />
          We aim to respond personally and promptly.
        </p>
      </div>

      {/* ── Full-width image + glassmorphism form ── */}
      <div className="container mx-auto px-6">
        <div
          className="relative w-full overflow-hidden"
          style={{ borderRadius: "16px", minHeight: "580px" }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/contact/touch/touch.png"
              alt="Get in touch background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "rgba(15, 23, 42, 0.55)" }}
            />
          </div>

          {/* Glassmorphism form card */}
          <div className="relative z-10 flex items-center justify-center lg:justify-end w-full h-full min-h-145 p-6 lg:p-8">
            <div
              className="w-full lg:max-w-180"
              style={{
                borderRadius: "16px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                padding: "32px 24px",
              }}
            >
              {/* Personal Information label */}
              <p
                className="mb-6"
                style={{
                  color: "#FFF",
                  fontFamily:
                    "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "130%",
                  letterSpacing: "0.5px",
                }}
              >
                Personal Information
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="name"
                    style={{
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                    }}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      padding: "12px 16px",
                      background: "transparent",
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="phone"
                    style={{
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                    }}
                  >
                    Phone Number
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      padding: "12px 16px",
                    }}
                  >
                    {/* Phone icon */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                        fill="#CBD5E1"
                      />
                    </svg>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={handleChange}
                      style={{
                        background: "transparent",
                        color: "#CBD5E1",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "142%",
                        outline: "none",
                        border: "none",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    style={{
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                    }}
                  >
                    Email Address
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      padding: "12px 16px",
                    }}
                  >
                    {/* Mail icon */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ flexShrink: 0 }}
                    >
                      <path
                        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                        fill="#CBD5E1"
                      />
                    </svg>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      style={{
                        background: "transparent",
                        color: "#CBD5E1",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "142%",
                        outline: "none",
                        border: "none",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="message"
                    style={{
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Write here..."
                    value={form.message}
                    onChange={handleChange}
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      padding: "12px 16px",
                      background: "transparent",
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                      outline: "none",
                      resize: "none",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Send button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3"
                  style={{
                    borderRadius: "8px",
                    background: "#CFB9A3",
                    padding: "16px 32px",
                    boxShadow: "0 0 20px 0 rgba(13, 22, 54, 0.60)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      color: "#0F172A",
                      fontFamily: "Cambria, Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: "150%",
                    }}
                  >
                    Send
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="#0F172A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Security note */}
                <p
                  style={{
                    color: "#CBD5E1",
                    fontFamily: "Cambria, Georgia, serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "130%",
                    textAlign: "center",
                  }}
                >
                  Your information is secure and will never be shared with third
                  parties
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Info Cards ── */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map((card) => (
            <div key={card.title} className="flex flex-col gap-3">
              {/* Icon circle */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "32px",
                  background: "#E8DFD5",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              {/* Title */}
              <p
                style={{
                  color: "#0F172A",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                {card.title}
              </p>
              {/* Lines */}
              <div className="flex flex-col">
                {card.lines.map((line, i) => (
                  <p
                    key={i}
                    style={{
                      color: "#6B5D54",
                      fontFamily: "Cambria, Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "150%",
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Google Map ── */}
      <div className="w-full">
        <div
          className="w-full overflow-hidden"
          style={{ height: "500px" }}
        >
          <iframe
            title="Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.305935303!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snl!4v1708800000000!5m2!1sen!2snl"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
