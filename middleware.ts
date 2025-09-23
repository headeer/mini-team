import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Align with hosting (Vercel) which is redirecting apex -> www
const CANONICAL_HOST = process.env.NEXT_PUBLIC_CANONICAL_HOST || "www.miniteamproject.pl";

// Minimal, safe redirect: only apex -> www. No protocol enforcement here.
export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const currentHostHeader = req.headers.get("x-forwarded-host") || req.headers.get("host") || url.hostname;
  const host = currentHostHeader.split(",")[0].trim();

  // If we're on the apex without www, send to the canonical www host
  const APEX_HOST = CANONICAL_HOST.replace(/^www\./, "");
  if (host === APEX_HOST) {
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

