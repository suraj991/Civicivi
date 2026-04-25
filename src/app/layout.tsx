import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CiviCivi — Government Data That Means Something To You",
  description:
    "CiviCivi explains how bills and policies affect you personally. Know your impact, understand your government.",
  keywords: ["civic", "policy", "bills", "government", "personalized impact", "democracy"],
  openGraph: {
    title: "CiviCivi",
    description: "Government data tells us what happened. CiviCivi tells you what it means for you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
