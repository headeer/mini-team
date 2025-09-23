import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // SSR build, keep Next Image optimization
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
    if (!isProd) {
      return [];
    }
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow scripts from Clerk, Sanity, Tawk, and Stripe
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev https://cdn.sanity.io https://embed.tawk.to https://js.stripe.com https://static.hotjar.com https://script.hotjar.com https://www.googletagmanager.com",
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev https://cdn.sanity.io https://embed.tawk.to https://js.stripe.com https://static.hotjar.com https://script.hotjar.com https://www.googletagmanager.com",
              // API/websocket connections
              "connect-src 'self' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev wss://*.clerk.com wss://*.clerkstage.dev wss://*.clerk.accounts.dev https://cdn.sanity.io https://*.sanity.io https://*.apicdn.sanity.io https://embed.tawk.to https://va.tawk.to https://*.tawk.to wss://*.tawk.to https://api.stripe.com https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com https://www.google-analytics.com https://region1.analytics.google.com https://stats.g.doubleclick.net",
              // Frames for Clerk/Tawk widgets
              "frame-src 'self' https://*.clerk.com https://*.clerkstage.dev https://*.clerk.accounts.dev https://embed.tawk.to https://*.tawk.to https://js.stripe.com https://hooks.stripe.com",
              // Workers
              "worker-src 'self' blob:",
              // Images
              "img-src 'self' data: blob: https://img.clerk.com https://*.clerk.com https://cdn.sanity.io https://embed.tawk.to https://*.tawk.to https://*.hotjar.com https://*.hotjar.io https://www.google-analytics.com https://region1.analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://www.google.pl",
              // Styles (allow inline + common CDNs)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://*.tawk.to",
              "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to https://*.tawk.to",
              // Fonts
              "font-src 'self' data: https://fonts.gstatic.com https://js.stripe.com",
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
