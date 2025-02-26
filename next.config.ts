import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.clerk.com",

    },
    {
      protocol: "https",
      hostname: "ucarecdn.com",
    },
  ],
 }
};

export default nextConfig;
