import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Enforce canonical host and HTTPS in production
const CANONICAL_HOST = process.env.NEXT_PUBLIC_CANONICAL_HOST || "miniteamproject.pl";

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const currentHostHeader = req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname;
  const currentHost = currentHostHeader.split(",")[0].trim();
  const isLocalhost = currentHost === "localhost" || currentHost.endsWith(".local");

  // Skip redirects on localhost/dev
  if (isLocalhost) {
    return NextResponse.next();
  }

  // Canonicalize host only (avoid protocol redirects to prevent proxy loops)
  if (currentHost !== CANONICAL_HOST) {
    const target = new URL(url);
    target.hostname = CANONICAL_HOST;
    return NextResponse.redirect(target, 308);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Run on all paths except static files and Next internals
    "/((?!.*\\..*|_next).*)",
    "/",
    // And also API routes
    "/(api|trpc)(.*)",
  ],
};

