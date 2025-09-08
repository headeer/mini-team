// import { clerkMiddleware } from "@clerk/nextjs/server";

// Temporarily disable Clerk middleware
export default function middleware() {
  // No-op middleware
}

export const config = {
  matcher: [
    // Run on all paths except static files and Next internals
    "/((?!.*\\..*|_next).*)",
    "/",
    // And also API routes
    "/(api|trpc)(.*)",
  ],
};

