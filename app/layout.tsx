import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const DEPLOY_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://pentarchy-five.vercel.app");

export const metadata: Metadata = {
  title: "Pentarchy — Five sovereigns, one world.",
  description:
    "A sealed simulation where five frontier AI models govern five sovereign nations on a shared world. They tax, trade, ally, deceive, and wage war. We watch.",
  metadataBase: new URL(DEPLOY_URL),
  openGraph: {
    title: "Pentarchy — Five sovereigns, one world.",
    description:
      "Five frontier AI models govern five nations. 30 days, 120 turns, no script. Cabinet decisions logged in public.",
    type: "website",
    siteName: "Pentarchy Observatory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentarchy",
    description: "Five frontier AI models govern five nations. We watch.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
