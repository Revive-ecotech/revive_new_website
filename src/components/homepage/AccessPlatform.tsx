import React from "react";
import { User, Truck } from "lucide-react";

const AccessPlatform = () => {
  return (
    <section className="py-20 bg-[#F8FAF7]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold text-[#23411F]">
            Access Our Platform
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Access our secure web portals to schedule pickups, manage
            collections, and track recycling activities from any device.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Customer Portal */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 hover:shadow-2xl transition duration-300">

            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <User className="text-green-700" size={40} />
            </div>

            <h3 className="text-3xl font-bold text-center text-[#23411F]">
              Customer Portal
            </h3>

            <p className="text-gray-600 text-center mt-4 leading-8">
              Schedule scrap pickups, track pickup requests, view recycling
              history, and manage your account from anywhere.
            </p>

            <div className="mt-8 text-center">
              <a
                href="https://reviveuserapp.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-4 rounded-xl transition duration-300"
              >
                Open Customer Portal
              </a>
            </div>
          </div>

          {/* Rider Portal */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 hover:shadow-2xl transition duration-300">

            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Truck className="text-blue-700" size={40} />
            </div>

            <h3 className="text-3xl font-bold text-center text-[#23411F]">
              Rider Portal
            </h3>

            <p className="text-gray-600 text-center mt-4 leading-8">
              View assigned pickups, verify customer collections, complete
              pickup tasks, and manage collection operations efficiently.
            </p>

            <div className="mt-8 text-center">
              <a
                href="https://revive-rider-app.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-xl transition duration-300"
              >
                Open Rider Portal
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-base">
            🌍 Both portals are Progressive Web Apps (PWAs) and can be accessed
            directly from your browser on desktop, tablet, or mobile devices.
          </p>
        </div>

      </div>
    </section>
  );
};

export default AccessPlatform;