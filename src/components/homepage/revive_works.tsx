"use client";

import LottieStep from "@/components/LottieStep";
import TestimonialsSection from "@/components/TestimonialsSection";
import CSSAnimatedFeatures from "@/components/CSSAnimatedFeatures";

// Lottie animations
import phoneCameraAnimation from "../../../public/animations/phone-camera.json";
import dataAnalysisAnimation from "../../../public/animations/data-analysis.json";
import insightsAnimation from "../../../public/animations/insights.json";

const ReviveWorks = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ---------- HEADER ---------- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#253612]">
            How Revive App Works
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A simple three-step process that transforms waste into value while
            promoting responsible recycling.
          </p>
        </div>

        {/* ---------- STEPS ---------- */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          
          <LottieStep
            title="List Your Scrap"
            description="Upload details or images of your recyclable materials through the app — whether from industries, businesses, or households."
            animationData={phoneCameraAnimation}
            bgColor="bg-gradient-to-br from-green-100 to-green-50"
            width={280}
            height={200}
          />

          <LottieStep
            title="Smart Match & Collection"
            description="Our system instantly connects you with verified scrap collectors and recyclers, ensuring transparent pricing and efficient pickup."
            animationData={dataAnalysisAnimation}
            bgColor="bg-gradient-to-br from-orange-100 to-orange-50"
            width={280}
            height={200}
          />

          <LottieStep
            title="Earn & Impact"
            description="Track your scrap’s journey, receive fair payments, and contribute to a cleaner, sustainable circular economy."
            animationData={insightsAnimation}
            bgColor="bg-gradient-to-br from-blue-100 to-blue-50"
            width={280}
            height={200}
          />
        </div>

        {/* ---------- FEATURES ---------- */}
        <div className="mt-20">
          <CSSAnimatedFeatures />
        </div>
      </div>

      {/* ---------- TESTIMONIALS ---------- */}
      <div className="mt-24">
        <TestimonialsSection />
      </div>
    </section>
  );
};

export default ReviveWorks;
