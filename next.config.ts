import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Login profile photos
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // if GitHub login used later
      },
    ],
  },
};

export default nextConfig;
