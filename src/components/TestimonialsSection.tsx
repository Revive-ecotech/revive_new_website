"use client";

import Lottie from "lottie-react";
import { Star } from "lucide-react";
import reviewAnimation from "../../public/animations/Review_Animation.json";
import Link from "next/link";


/* ⭐ Reusable Star Rating */
function StarRating({ filled }: { filled: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < filled
              ? "fill-yellow-400 text-yellow-400"
              : "text-yellow-400"
          }`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ---------------- LEFT SIDE ---------------- */}
          <div className="relative overflow-hidden rounded-3xl">

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-200 rounded-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-40 pointer-events-none" />

            {/* Main testimonial card */}
            <div className="relative bg-white p-8 rounded-3xl shadow-xl">

              {/* Lottie */}
              <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                <Lottie
                  animationData={reviewAnimation}
                  style={{ width: 320, height: 280 }}
                  loop
                  autoplay
                />
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                &quot;Earlier we had to call 3–4 people just to move our scrap.
                With Revive, everything happens on time — pickup, payment, and
                proper records. Very smooth system.&quot;
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Rajesh Kumar, Plant Operations – Vijayawada
                  </h4>
                  <StarRating filled={5} />
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT SIDE ---------------- */}
          <div>
            <div className="mb-12 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-60 pointer-events-none">
                <Lottie animationData={reviewAnimation} loop autoplay />
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Real Changes
                <br />
                <span className="text-[#386642]">Real Results</span>
              </h2>
            </div>

            {/* Extra testimonials */}
            <div className="space-y-8">

              {/* Review 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;I collect scrap from houses daily. Earlier rates were not
                  fixed. Now I get proper price and payment comes directly.
                  Revive has made our work respectful.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Suresh Naik, Scrap Collector – Hyderabad
                    </h4>
                    <StarRating filled={4} />
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;Our students actually understood why waste separation is
                  important. Revive’s program was practical, simple, and very
                  engaging for children.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Anusha Rao, School Teacher – Visakhapatnam
                    </h4>
                    <StarRating filled={4} />
                  </div>
                </div>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-12">
              <Link
  href="/login"
  className="inline-flex items-center justify-center
             bg-[#386642] text-white font-bold
             py-4 px-8 rounded-full text-lg
             shadow-lg hover:shadow-xl
             hover:-translate-y-0.5 active:translate-y-0
             transition cursor-pointer"
>
  Join Thousands of Happy Customers
</Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
