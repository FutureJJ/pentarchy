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

export const metadata: Metadata = {
  title: "Pentarchy — Five sovereigns, one world.",
  description:
    "A sandbox where five frontier AI models govern five sovereign nations on a shared world. They tax, trade, ally, deceive, and wage war. We watch.",
  openGraph: {
    title: "Pentarchy",
    description: "Five sovereigns, one world.",
    type: "website",
  },
  metadataBase: new URL("https://pentarchy.world"),
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
