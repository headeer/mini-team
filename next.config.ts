import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "http",
        hostname: "miniteamproject.pl",
      },
      {
        protocol: "http",
        hostname: "www.miniteamproject.pl",
      },
      {
        protocol: "https",
        hostname: "www.miniteamproject.pl",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
