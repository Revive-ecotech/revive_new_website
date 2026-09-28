"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="w-full pt-3">
            <div className="mx-auto">
                <div className="flex items-center justify-between">

                    {/* Left: Logo */}
                    <span>
                        <Image
                            src="/logo2.png"
                            alt="Revive Eco Logo"
                            width={120}
                            height={120}
                        />
                    </span>

                    {/* Center: Navigation */}
                    <div className="hidden md:flex md:space-x-4">

                        <Link
                            href="/"
                            className={`rounded-xl text-sm py-2 px-4 ${pathname === "/"
                                    ? "bg-[#253612] text-white"
                                    : "text-gray-700 hover:bg-[#f2f2f2]"
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            className={`rounded-xl text-sm py-2 px-4 ${pathname === "/about"
                                    ? "bg-[#253612] text-white"
                                    : "text-gray-700 hover:bg-[#f2f2f2]"
                                }`}
                        >
                            About
                        </Link>

                        <Link
                            href="/community"
                            className={`rounded-xl text-sm py-2 px-4 ${pathname === "/community"
                                    ? "bg-[#253612] text-white"
                                    : "text-gray-700 hover:bg-[#f2f2f2]"
                                }`}
                        >
                            Community
                        </Link>

                        <Link
                            href="/contact"
                            className={`rounded-xl text-sm py-2 px-4 ${pathname === "/contact"
                                    ? "bg-[#253612] text-white"
                                    : "text-gray-700 hover:bg-[#f2f2f2]"
                                }`}
                        >
                            Contact
                        </Link>

                        <Link
                            href="/careers"
                            className={`rounded-xl text-sm py-2 px-4 ${pathname === "/careers"
                                    ? "bg-[#253612] text-white"
                                    : "text-gray-700 hover:bg-[#f2f2f2]"
                                }`}
                        >
                            Careers
                        </Link>

                        {/* DELETE ACCOUNT */}
                        <Link
                            href="/delete-account"
                            className={`rounded-xl text-sm py-2 px-4 ${pathname === "/delete-account"
                                    ? "bg-red-600 text-white"
                                    : "text-red-600 hover:bg-red-50"
                                }`}
                        >
                            Delete Account
                        </Link>

                    </div>

                    {/* Right: Hamburger + Login */}
                    <div className="flex items-center space-x-4">

                        {/* Mobile Hamburger */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden flex flex-col space-y-1 p-2"
                            aria-label="Toggle menu"
                        >
                            <span className="w-6 h-0.5 bg-gray-800"></span>
                            <span className="w-6 h-0.5 bg-gray-800"></span>
                            <span className="w-6 h-0.5 bg-gray-800"></span>
                        </button>

                        {/* DESKTOP LOGIN BUTTON */}
                        <Link
                            href="/login"
                            className="hidden md:flex px-5 py-3 gap-3 items-center rounded-3xl bg-[#253612] text-white hover:bg-[#364f1b] transition"
                        >
                            Log In
                            <ArrowRight size={15} />
                        </Link>

                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="md:hidden fade-in text-base bg-white rounded-2xl px-5 pb-2 mt-2 flex flex-col space-y-5 py-5">

                    <Link
                        href="/"
                        className={`font-medium transition ${pathname === "/"
                                ? "text-[#253612] font-semibold"
                                : "text-gray-700 hover:text-[#253612]"
                            }`}
                    >
                        Home
                    </Link>

                    <Link
                        href="/about"
                        className={`font-medium transition ${pathname === "/about"
                                ? "text-[#253612] font-semibold"
                                : "text-gray-700 hover:text-[#253612]"
                            }`}
                    >
                        About
                    </Link>

                    <Link
                        href="/community"
                        className={`font-medium transition ${pathname === "/community"
                                ? "text-[#253612] font-semibold"
                                : "text-gray-700 hover:text-[#253612]"
                            }`}
                    >
                        Community
                    </Link>

                    <Link
                        href="/contact"
                        className={`font-medium transition ${pathname === "/contact"
                                ? "text-[#253612] font-semibold"
                                : "text-gray-700 hover:text-[#253612]"
                            }`}
                    >
                        Contact
                    </Link>

                    <Link
                        href="/careers"
                        className={`font-medium transition ${pathname === "/careers"
                                ? "text-[#253612] font-semibold"
                                : "text-gray-700 hover:text-[#253612]"
                            }`}
                    >
                        Careers
                    </Link>

                    {/* MOBILE DELETE ACCOUNT */}
                    <Link
                        href="/delete-account"
                        className={`font-medium transition ${pathname === "/delete-account"
                                ? "text-red-700 font-semibold"
                                : "text-red-600 hover:text-red-700"
                            }`}
                    >
                        Delete Account
                    </Link>

                    {/* MOBILE LOGIN BUTTON */}
                    <Link
                        href="/login"
                        className="w-full px-5 py-3 flex flex-row gap-3 items-center justify-center rounded-3xl bg-[#253612] text-white hover:bg-[#364f1b]"
                    >
                        Log In
                        <ArrowRight size={15} />
                    </Link>

                </div>
            )}
        </nav>
    );
};

export default Navbar;