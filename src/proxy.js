
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

// Guards the PRIVATE pages only. Upcoming Events (/all-events) and Event
// Details (/all-events/[id]) must stay public, so they are not listed here.
export async function proxy(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        request.nextUrl.pathname + request.nextUrl.search
      );

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication failed:", error);

    return new NextResponse(
      "Authentication is temporarily unavailable.",
      { status: 503 }
    );
  }
}

export const config = {
  matcher: [
    "/add-events/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
  ],
};
