"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-16">
          {/* Logo and Description Section */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="relative h-[54px] w-[54px] overflow-hidden rounded-[41px] mb-4">
              <Image
                src="/images/logo.png"
                alt="Heaven Logo"
                fill
                className="object-cover"
              />
            </div>
            <p
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontFamily: "var(--font-geist-sans), sans-serif",
                lineHeight: "1.6",
                color: "rgba(255, 255, 255, 0.60)",
                marginBottom: "1.5rem",
              }}
            >
              {t.footer.tagline}
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center hover:bg-[#334155] transition-colors"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M16 8C16 3.582 12.418 0 8 0C3.582 0 0 3.582 0 8C0 11.9933 2.92533 15.3027 6.75 15.9027V10.3127H4.71867V7.99933H6.75V6.238C6.75 4.23333 7.94467 3.12533 9.772 3.12533C10.6467 3.12533 11.5627 3.282 11.5627 3.282V5.25067H10.5533C9.55933 5.25067 9.24933 5.86733 9.24933 6.5V8H11.468L11.1133 10.3133H9.24933V15.9033C13.0747 15.3027 16 11.9927 16 8Z"
                    fill="white"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center hover:bg-[#334155] transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_8389_6241)">
                    <path
                      d="M8 1.442C10.136 1.442 10.3893 1.45 11.2333 1.48867C13.4013 1.58733 14.414 2.616 14.5127 4.768C14.5513 5.61133 14.5587 5.86467 14.5587 8.00067C14.5587 10.1373 14.5507 10.39 14.5127 11.2333C14.4133 13.3833 13.4033 14.414 11.2333 14.5127C10.3893 14.5513 10.1373 14.5593 8 14.5593C5.864 14.5593 5.61067 14.5513 4.76733 14.5127C2.594 14.4133 1.58667 13.38 1.488 11.2327C1.44933 10.3893 1.44133 10.1367 1.44133 8C1.44133 5.864 1.45 5.61133 1.488 4.76733C1.58733 2.616 2.59733 1.58667 4.76733 1.488C5.61133 1.45 5.864 1.442 8 1.442ZM8 0C5.82733 0 5.55533 0.00933333 4.702 0.048C1.79667 0.181333 0.182 1.79333 0.0486667 4.70133C0.00933333 5.55533 0 5.82733 0 8C0 10.1727 0.00933333 10.4453 0.048 11.2987C0.181333 14.204 1.79333 15.8187 4.70133 15.952C5.55533 15.9907 5.82733 16 8 16C10.1727 16 10.4453 15.9907 11.2987 15.952C14.2013 15.8187 15.82 14.2067 15.9513 11.2987C15.9907 10.4453 16 10.1727 16 8C16 5.82733 15.9907 5.55533 15.952 4.702C15.8213 1.79933 14.2073 0.182 11.2993 0.0486667C10.4453 0.00933333 10.1727 0 8 0ZM8 3.892C5.73133 3.892 3.892 5.73133 3.892 8C3.892 10.2687 5.73133 12.1087 8 12.1087C10.2687 12.1087 12.108 10.2693 12.108 8C12.108 5.73133 10.2687 3.892 8 3.892ZM8 10.6667C6.52733 10.6667 5.33333 9.47333 5.33333 8C5.33333 6.52733 6.52733 5.33333 8 5.33333C9.47267 5.33333 10.6667 6.52733 10.6667 8C10.6667 9.47333 9.47267 10.6667 8 10.6667ZM12.2707 2.77C11.74 2.77 11.31 3.2 11.31 3.73C11.31 4.26 11.74 4.69 12.2707 4.69C12.8007 4.69 13.23 4.26 13.23 3.73C13.23 3.2 12.8007 2.77 12.2707 2.77Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_8389_6241">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#1E293B] rounded-full flex items-center justify-center hover:bg-[#334155] transition-colors"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="11"
                  viewBox="0 0 14 11"
                  fill="none"
                >
                  <path
                    d="M4.19333 10.8356C9.22467 10.8356 11.9767 6.66693 11.9767 3.05227C11.9767 2.9336 11.9767 2.8156 11.9687 2.69893C12.5041 2.31128 12.9662 1.83134 13.3333 1.2816C12.834 1.50293 12.3044 1.64811 11.762 1.71227C12.3331 1.37031 12.7605 0.832498 12.9647 0.198932C12.4278 0.517523 11.8405 0.742085 11.228 0.862932C10.8156 0.424109 10.27 0.133488 9.67575 0.0360687C9.08149 -0.061351 8.47168 0.039865 7.94075 0.324045C7.40982 0.608224 6.98739 1.05951 6.73886 1.60804C6.49034 2.15656 6.42958 2.77172 6.566 3.35827C5.47839 3.30376 4.4144 3.02115 3.4431 2.52878C2.47179 2.03641 1.61488 1.34528 0.928 0.500266C0.578212 1.1024 0.471059 1.81521 0.628357 2.49358C0.785655 3.17194 1.19558 3.76485 1.77467 4.1516C1.33951 4.139 0.913756 4.02193 0.533333 3.81027V3.84493C0.533593 4.47646 0.752263 5.08847 1.15227 5.57717C1.55227 6.06587 2.10898 6.40119 2.728 6.52627C2.32521 6.63608 1.9026 6.65204 1.49267 6.57293C1.66744 7.11658 2.00778 7.592 2.46608 7.93268C2.92438 8.27335 3.47772 8.46225 4.04867 8.47293C3.48141 8.91864 2.83186 9.24816 2.13715 9.44262C1.44244 9.63709 0.716215 9.6927 0 9.60627C1.25107 10.4092 2.70679 10.835 4.19333 10.8329"
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontFamily: "var(--font-geist-sans), Cambria",
                fontWeight: "700",
                lineHeight: "130%",
                marginBottom: "1.5rem",
              }}
            >
              {t.footer.quickLinks.title}
            </h3>
            <ul className="space-y-3">
              {t.footer.quickLinks.links.map((link: any, index: number) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 16px)",
                      fontFamily: "var(--font-geist-sans), Cambria",
                      fontWeight: "400",
                      lineHeight: "130%",
                      color: "rgba(255, 255, 255, 0.60)",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontFamily: "var(--font-geist-sans), Cambria",
                fontWeight: "700",
                lineHeight: "130%",
                marginBottom: "1.5rem",
              }}
            >
              {t.footer.connect.title}
            </h3>
            <ul className="space-y-3">
              {t.footer.connect.links.map((link: any, index: number) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: "clamp(14px, 1.5vw, 16px)",
                      fontFamily: "var(--font-geist-sans), Cambria",
                      fontWeight: "400",
                      lineHeight: "130%",
                      color: "rgba(255, 255, 255, 0.60)",
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontFamily: "var(--font-geist-sans), Cambria",
                fontWeight: "700",
                lineHeight: "130%",
                marginBottom: "1.5rem",
              }}
            >
              {t.footer.contact.title}
            </h3>
            <ul className="space-y-3">
              <li
                style={{
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  fontFamily: "var(--font-geist-sans), Cambria",
                  fontWeight: "400",
                  lineHeight: "130%",
                  color: "rgba(255, 255, 255, 0.60)",
                }}
              >
                {t.footer.contact.address}
              </li>
              <li
                style={{
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  fontFamily: "var(--font-geist-sans), Cambria",
                  fontWeight: "400",
                  lineHeight: "130%",
                  color: "rgba(255, 255, 255, 0.60)",
                }}
              >
                {t.footer.contact.country}
              </li>
              <li>
                <a
                  href={`tel:${t.footer.contact.phone}`}
                  style={{
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    fontFamily: "var(--font-geist-sans), Cambria",
                    fontWeight: "400",
                    lineHeight: "130%",
                    color: "rgba(255, 255, 255, 0.60)",
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://${t.footer.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    fontFamily: "var(--font-geist-sans), Cambria",
                    fontWeight: "400",
                    lineHeight: "130%",
                    color: "rgba(255, 255, 255, 0.60)",
                  }}
                  className="hover:text-white transition-colors"
                >
                  {t.footer.contact.website}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3
              style={{
                fontSize: "clamp(14px, 1.5vw, 16px)",
                fontFamily: "var(--font-geist-sans), Cambria",
                fontWeight: "700",
                lineHeight: "130%",
                marginBottom: "1.5rem",
              }}
            >
              {t.footer.openingHours.title}
            </h3>
            <ul className="space-y-3">
              {t.footer.openingHours.hours.map((hour: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between"
                  style={{
                    fontSize: "clamp(14px, 1.5vw, 16px)",
                    fontFamily: "var(--font-geist-sans), Cambria",
                    fontWeight: "400",
                    lineHeight: "130%",
                    color: "rgba(255, 255, 255, 0.60)",
                  }}
                >
                  <span>{hour.day}</span>
                  <span>{hour.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p
            style={{
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontFamily: "var(--font-geist-sans), Cambria",
              fontWeight: "400",
              textAlign: "center",
              color: "rgba(255, 255, 255, 0.60)",
            }}
          >
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
