"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DecorativeUnderline from "@/components/shared/DecorativeUnderline";
import { othersService, ContactInfo } from "@/lib/api/services";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GetInTouchSection() {
  const { t } = useLanguage();
  const tTouch = (t.contactPage as any)?.getInTouch;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await othersService.getContactInfo();
        setContactInfo(res?.data || null);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setSubmitError(tTouch?.errorEnterName || "Please enter your name.");
      return;
    }
    if (!form.phone.trim()) {
      setSubmitError(tTouch?.errorEnterPhone || "Please enter your phone number.");
      return;
    }
    if (!form.email.trim()) {
      setSubmitError(tTouch?.errorEnterEmail || "Please enter your email address.");
      return;
    }
    if (!form.subject.trim()) {
      setSubmitError(tTouch?.errorEnterSubject || "Please enter a subject.");
      return;
    }
    if (!form.message.trim()) {
      setSubmitError(tTouch?.errorEnterMessage || "Please enter your message.");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const res = await othersService.sendSupportMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSubmitSuccess(
        res.message ||
        tTouch?.successMessage ||
        "Your message has been sent successfully. We will get back to you shortly."
      );
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setSubmitError(
        err?.response?.data?.message ||
        err?.message ||
        tTouch?.errorGeneral ||
        "Failed to send message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
            {tTouch?.title || "Get in Touch"}
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
          {tTouch?.subtitle ||
            "For general questions, special requests, or corporate inquiries, our team is happy to assist you. We aim to respond personally and promptly."}
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
              src="/images/contact/touch/touch.jpg"
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
                {tTouch?.personalInfo || "Personal Information"}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {submitSuccess && (
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-sm text-center">
                    ✓ {submitSuccess}
                  </div>
                )}
                {submitError && (
                  <div className="p-3.5 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-200 text-sm text-center">
                    ✕ {submitError}
                  </div>
                )}

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
                    {tTouch?.name || "Name"} <span className="text-[#CFB9A3]">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={tTouch?.namePlaceholder || "Your full name"}
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
                    {tTouch?.phone || "Phone Number"} <span className="text-[#CFB9A3]">*</span>
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
                      required
                      placeholder={tTouch?.phonePlaceholder || "+1 (555) 000-0000"}
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
                    {tTouch?.email || "Email Address"} <span className="text-[#CFB9A3]">*</span>
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
                      required
                      placeholder={tTouch?.emailPlaceholder || "your@email.com"}
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

                {/* Subject */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="subject"
                    style={{
                      color: "#CBD5E1",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "142%",
                    }}
                  >
                    {tTouch?.subject || "Subject"} <span className="text-[#CFB9A3]">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder={tTouch?.subjectPlaceholder || "Subject of your message"}
                    value={form.subject}
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
                    {tTouch?.message || "Message"} <span className="text-[#CFB9A3]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder={tTouch?.messagePlaceholder || "Write here..."}
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
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 transition-opacity disabled:opacity-50"
                  style={{
                    borderRadius: "8px",
                    background: "#CFB9A3",
                    padding: "16px 32px",
                    boxShadow: "0 0 20px 0 rgba(13, 22, 54, 0.60)",
                    border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
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
                    {submitting ? (tTouch?.sending || "Sending...") : (tTouch?.send || "Send")}
                  </span>
                  {!submitting && (
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
                  )}
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
                  {tTouch?.securityNote ||
                    "Your information is secure and will never be shared with third parties"}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact Info Cards ── */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto text-center sm:text-left justify-items-center sm:justify-items-start">
          {/* Address */}
          <div className="flex flex-col items-center sm:items-start gap-3 w-full max-w-xs sm:max-w-none">
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="#8B7355"
                />
              </svg>
            </div>
            <p
              style={{
                color: "#0F172A",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "150%",
              }}
            >
              {tTouch?.address || "Address"}
            </p>
            <div className="flex flex-col">
              <p
                style={{
                  color: "#6B5D54",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
              >
                {contactInfo?.address || "Singel 450, 1017 AW Amsterdam, Netherlands"}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center sm:items-start gap-3 w-full max-w-xs sm:max-w-none">
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  fill="#8B7355"
                />
              </svg>
            </div>
            <p
              style={{
                color: "#0F172A",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "150%",
              }}
            >
              {tTouch?.phoneLabel || "Phone"}
            </p>
            <div className="flex flex-col">
              <a
                href={contactInfo?.phone ? `tel:${contactInfo.phone}` : "#"}
                style={{
                  color: "#6B5D54",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
                className="hover:text-[#8B7355] transition-colors"
              >
                {contactInfo?.phone || "+31 20 123 4567"}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center sm:items-start gap-3 w-full max-w-xs sm:max-w-none">
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="#8B7355"
                />
              </svg>
            </div>
            <p
              style={{
                color: "#0F172A",
                fontFamily: "Cambria, Georgia, serif",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "150%",
              }}
            >
              {tTouch?.emailLabel || "Email"}
            </p>
            <div className="flex flex-col">
              <a
                href={contactInfo?.email ? `mailto:${contactInfo.email}` : "#"}
                style={{
                  color: "#6B5D54",
                  fontFamily: "Cambria, Georgia, serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "150%",
                }}
                className="hover:text-[#8B7355] transition-colors"
              >
                {contactInfo?.email || "hello@havenwellness.com"}
              </a>
            </div>
          </div>
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
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              contactInfo?.address || "Middle Badda, Dhaka"
            )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
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
