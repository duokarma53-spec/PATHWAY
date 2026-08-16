import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  basePath: "/PATHWAY/admin",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
