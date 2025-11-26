import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revive EcoTech",
  description: "Earn by recycling waste",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ⭐ Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="ADlb8HGH4MnniAFAryH0KHNuH_7EMyNZtTA_hGJAT18"
        />
      </head>

      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-[#F2F7F2] text-[#253612]
        `}
      >
        {/* Recaptcha container (Required for Firebase Phone Auth) */}
        <div id="recaptcha-container"></div>

        {/* Firebase Auth Context Provider */}
        <AuthProvider>{children}</AuthProvider>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
