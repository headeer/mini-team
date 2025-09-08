import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Run on all paths except static files and Next internals
    "/((?!.*\\..*|_next).*)",
    "/",
    // And also API routes
    "/(api|trpc)(.*)",
  ],
};

