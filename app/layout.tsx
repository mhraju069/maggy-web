import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Heaven on Earth | Wellness, Sauna, Lunchroom & Events",
  description: "Where heavenly food, relaxation, wellness, and special moments come together. Enjoy our cosy restaurant, relaxing sauna, and beautiful event spaces.",
  verification: {
    google: "SEZr6Iks_rKo_wWjwBPcN4NMy07LYjx2Z6eMYpkGYvA",
  },
  icons: {
    icon: [
      { url: "/images/logo.png" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
