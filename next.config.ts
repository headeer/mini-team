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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow Clerk JS and related assets
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev https://embed.tawk.to https://cdn.sanity.io",
              // Some browsers use script-src-elem as a separate check
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev https://embed.tawk.to https://cdn.sanity.io",
              // Clerk requires connecting to its APIs; Sanity used on client in some places
              "connect-src 'self' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev wss://*.clerk.com wss://*.clerkstage.dev wss://*.clerk.accounts.dev https://cdn.sanity.io https://*.sanity.io https://*.apicdn.sanity.io https://embed.tawk.to https://va.tawk.to",
              // Clerk widgets may render in iframes
              "frame-src 'self' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev https://embed.tawk.to",
              // Allow web workers (Clerk uses blob workers for polling)
              "worker-src 'self' blob:",
              // Images from Clerk and Sanity
              "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.com https://cdn.sanity.io https://embed.tawk.to",
              // Allow inline styles used by Clerk UI theming
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'"
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
