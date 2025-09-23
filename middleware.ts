import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const CANONICAL_HOST = process.env.NEXT_PUBLIC_CANONICAL_HOST || "miniteamproject.pl";

// Minimal, safe redirect: only www -> bare domain. No protocol enforcement here.
export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const currentHostHeader = req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname;
  const host = currentHostHeader.split(",")[0].trim();

  const WWW_HOST = `www.${CANONICAL_HOST}`;
  if (host === WWW_HOST) {
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

