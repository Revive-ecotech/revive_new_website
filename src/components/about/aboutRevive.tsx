import React from 'react'
import Image from 'next/image'

const AboutRevive = () => {
  return (
    <div className="bg-[#386641] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Text Section */}
          <div className="lg:w-1/2 text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8">
              About Revive
            </h2>

            <div className="space-y-6">
              <p className="text-base md:text-lg leading-relaxed">
                Revive helps you recycle your waste while offering the best
                exchange rates. We&apos;re committed to turning your scrap into
                value through reliable, high-quality recycling services.
              </p>

              <p className="text-sm md:text-base leading-relaxed opacity-90">
                Our mission is to create a sustainable ecosystem where waste
                becomes a valuable resource, benefiting both individuals and the
                environment.
              </p>
            </div>
          </div>

          {/* Circle Section */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Main Circle (FIXED SIZE) */}
              <div className="w-56 h-56 md:w-64 md:h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Image
                  src="/logo.png"
                  alt="Revive Ecotech Logo"
                  width={160}
                  height={160}
                  className="rounded-full"
                />
              </div>

              {/* Decorative Circles */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-white bg-opacity-20 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-white bg-opacity-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutRevive
