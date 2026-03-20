import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Added to build a lean version for Cloud Run
};

export default nextConfig;
