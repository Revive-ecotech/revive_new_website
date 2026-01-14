"use client";
import React, { useState } from "react";

export default function CSSAnimatedFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "eco-friendly",
      title: "Eco-Driven",
      description: "Smart recycling for a cleaner, greener planet.",
      color: "#00c851",
      bgColor: "bg-green-100",
      iconColor: "bg-green-500",
      icon: "🌱",
    },
    {
      id: "ai-powered",
      title: "Tech-Powered",
      description: "AI and data-backed solutions for smarter waste handling.",
      color: "#4285f4",
      bgColor: "bg-blue-100",
      iconColor: "bg-blue-500",
      icon: "🤖",
    },
    {
  id: "real-time",
  title: "Real-time",
  description: "Instant tracking, pickup updates, and digital documentation.",
  bgColor: "bg-orange-50",
  iconColor: "bg-orange-500",
  icon: "⏱️",
}

,
    {
      id: "personalized",
      title: "Transparent",
      description: "Fair pricing and verified transactions for every user.",
      color: "#aa66cc",
      bgColor: "bg-purple-100",
      iconColor: "bg-purple-500",
      icon: "🎯",
    },
  ];

  return (
    <div className="mt-20 bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
      {/* Background gradient that changes */}
      <div
        className="absolute inset-0 opacity-5 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${features[activeFeature].color} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#253612] mb-4">
            Why Choose Revive?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our tech-enabled platform simplifies waste management, empowers collectors, and drives sustainability through innovation and transparency.
          </p>
        </div>

        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="text-center cursor-pointer transition-all duration-300 ease-out p-6 rounded-xl hover:shadow-xl hover:scale-105 hover:-translate-y-2 group"
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div
                className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:shadow-lg relative overflow-hidden group-hover:scale-110 group-hover:rotate-12`}
              >
                <span className="text-2xl relative z-10 transition-transform duration-300 group-hover:scale-125">
                  {feature.icon}
                </span>
                <div
                  className={`absolute inset-0 ${feature.iconColor} rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                ></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-gray-700">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                {feature.description}
              </p>
            </div>
          ))}

          {/* Animated highlight line */}
          <div
            className="absolute bottom-0 h-1 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `calc(${100 / features.length}% - ${(8 * (features.length - 1)) / features.length}px)`,
              left: `calc(${(activeFeature * 100) / features.length}% + ${(activeFeature * 8)}px)`,
              backgroundColor: features[activeFeature].color,
              boxShadow: `0 0 20px ${features[activeFeature].color}40`,
            }}
          />
        </div>

        {/* Active feature info */}
        <div className="mt-8 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ease-out"
            style={{
              backgroundColor: `${features[activeFeature].color}15`,
              color: features[activeFeature].color,
            }}
          >
            <span className="text-lg">{features[activeFeature].icon}</span>
            <span className="font-semibold">Currently viewing: {features[activeFeature].title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
