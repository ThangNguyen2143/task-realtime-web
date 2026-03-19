import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  if (request.url == "/")
    return NextResponse.redirect(new URL("/workspace", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: "/about/:path*",
};
