import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ⭐ BEST GOOGLE VERIFICATION — AUTOMATIC HEAD INJECTION
export const metadata: Metadata = {
  title: "Revive EcoTech",
  description: "Earn by recycling waste",

  verification: {
    google: "ADlb8HGH4MnniAFAryH0KHNuH_7EMyNZtTA_hGJAT18",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Firebase Recaptcha */}
        <div id="recaptcha-container"></div>

        {/* Auth Provider */}
        <AuthProvider>
          {children}
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  );
}
