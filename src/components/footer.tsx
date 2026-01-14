"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    const subject = "Newsletter Subscription - Revive Eco Tech";
    const body = `Hello Revive Eco Tech Team,

Please add the following email to the newsletter mailing list:

${email}

Thank you.`;

    window.location.href = `mailto:reviveecotech@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setEmail("");
  };

  return (
    <footer className="flex flex-col font-sans px-4 sm:px-8 xl:px-10 mx-auto mb-8">
      <div className="flex flex-col bg-[#386641] rounded-2xl md:rounded-[4rem] mt-5 pt-10 pb-12 md:pt-20 md:pb-24 px-4 sm:px-8 lg:px-16">

        {/* ---------- TOP ---------- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 px-4 sm:px-8 lg:px-16 xl:px-20">

          {/* Explore More */}
          <div className="flex flex-col gap-2">
            <span className="text-xl pb-1 text-white">Explore More</span>

            <Link href="/" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Home
            </Link>

            <Link href="/community" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Services
            </Link>

            <Link href="/community" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Projects
            </Link>

            <Link href="/login" className="text-base text-white font-semibold hover:underline py-1">
              Login
            </Link>
          </div>

          {/* About */}
          <div className="flex flex-col gap-2">
            <span className="text-xl pb-1 text-white">About</span>

            <Link href="/about" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Our Story
            </Link>

            <Link href="/about" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Team
            </Link>

            <Link href="/contact" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Contact
            </Link>

            <Link href="/careers" className="text-base text-white/80 hover:text-white hover:underline py-1">
              Careers
            </Link>
          </div>

          {/* Logo & Newsletter */}
          <div className="flex flex-col items-start gap-4 w-full md:w-auto">
            <Image
              src="/logo2.png"
              alt="Revive Logo"
              width={150}
              height={150}
              className="brightness-110"
            />

            <p className="text-white/70 text-sm">
              Join our newsletter to get the latest updates
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto gap-2"
            >
              <input
  type="email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email address"
  className="px-5 py-4 rounded-full 
             bg-[#4d7554] text-white 
             placeholder:text-white/80
             border border-white/30
             focus:outline-none focus:ring-2 focus:ring-white/40 
             w-full"
/>



              <button
                type="submit"
                className="bg-white text-[#386641] px-6 py-4 rounded-full hover:bg-white/90 hover:text-black transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ---------- DIVIDER ---------- */}
        <div className="px-4 sm:px-8 lg:px-16 xl:px-20 mt-12">
          <div className="bg-white/30 h-px" />
        </div>

        {/* ---------- BOTTOM ---------- */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm text-white/70 px-4 sm:px-8 lg:px-16 xl:px-20">
          <div className="flex gap-6 pb-4 md:pb-0">
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>

            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>

          <div>
            © {new Date().getFullYear()} Revive Ecotech Ltd
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
