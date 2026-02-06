import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for food images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Experimental features
  experimental: {
    // Enable server actions for form handling
  },
};

export default nextConfig;
