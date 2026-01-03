"use client";

import Lottie from "lottie-react";
import reviewAnimation from "../../public/animations/Review_Animation.json";

export default function TestimonialsSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ---------------- LEFT SIDE ---------------- */}
          <div className="relative overflow-hidden rounded-3xl">
            
            {/* ✅ SAFE Decorative circles */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-200 rounded-full opacity-40 pointer-events-none" />

            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-24 h-24 bg-blue-200 rounded-full opacity-40 pointer-events-none" />

            {/* Main testimonial card */}
            <div className="relative bg-white p-8 rounded-3xl shadow-xl">
              
              {/* Lottie container */}
              <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
                <Lottie
                  animationData={reviewAnimation}
                  style={{ width: 320, height: 280 }}
                  loop
                  autoplay
                />
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                &quot;Revive helped our factory manage scrap seamlessly — no
                middlemen, no confusion. Payments and pickups are now transparent
                and on time.&quot;
              </p>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  L
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Rajesh K., Operations Head, Andhra Paper Mills
                  </h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT SIDE ---------------- */}
          <div>
            <div className="mb-12 relative">
              
              {/* Floating animation */}
              <div className="absolute -top-4 -right-4 w-24 h-24 opacity-60 pointer-events-none">
                <Lottie animationData={reviewAnimation} loop autoplay />
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Real Changes
                <br />
                <span className="text-[#386642]">Real Results</span>
              </h2>

              <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm">
                read all 3,147+ reviews <span className="text-xl">→</span>
              </button>
            </div>

            {/* Extra testimonials */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;As a local scrap collector, I now earn fair prices and
                  regular income. The Revive app makes me feel valued.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Suresh P., Scrap Collector
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &quot;Our school campaign with Revive taught students about
                  waste segregation in a fun, practical way.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    T
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      Anusha R., Teacher
                    </h4>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">⭐</span>
                      ))}
                      <span className="text-gray-300 text-xs">⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <button className="bg-[#386642] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition">
                Join Thousands of Happy Customers
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
