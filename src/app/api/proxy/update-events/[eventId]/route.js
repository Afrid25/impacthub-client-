import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { API_BASE_URL, readJson } from "@/lib/api";

export async function PATCH(request, { params }) {
  try {
    const requestHeaders = await headers();
    const jwtResult = await auth.api.getToken({
      headers: requestHeaders,
    });
    const token = jwtResult?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required. Please log in to edit events." },
        { status: 401 }
      );
    }

    const { eventId } = await params;
    const body = await request.json().catch(() => null);

    const res = await fetch(
      `${API_BASE_URL}/update-events/${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await readJson(res);
    return NextResponse.json(result.data ?? { message: result.message }, {
      status: result.status,
    });
  } catch (error) {
    console.error("update-events proxy failed:", error);
    return NextResponse.json(
      { message: "Could not reach the API. Please try again." },
      { status: 502 }
    );
  }
}
