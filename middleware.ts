import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Enforce canonical host and HTTPS in production
const CANONICAL_HOST = process.env.NEXT_PUBLIC_CANONICAL_HOST || "miniteamproject.pl";

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const currentHost = url.hostname;
  const isLocalhost = currentHost === "localhost" || currentHost.endsWith(".local");

  // Skip redirects on localhost/dev
  if (isLocalhost) {
    return NextResponse.next();
  }

  // Force HTTPS based on forwarded proto/header (reliable behind proxies)
  const proto = req.headers.get("x-forwarded-proto");
  if (proto === "http") {
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // Normalize host to canonical (e.g., remove www)
  if (currentHost !== CANONICAL_HOST) {
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
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

