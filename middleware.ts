// Minimal passthrough middleware to avoid Edge bundling issues on Vercel
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  return Response.next();
}

export const config = {
  // Disable matching to effectively noop middleware
  matcher: [],
};
