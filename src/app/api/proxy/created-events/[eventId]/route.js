import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { API_BASE_URL, readJson } from "@/lib/api";

export async function DELETE(request, { params }) {
  try {
    const requestHeaders = await headers();
    const jwtResult = await auth.api.getToken({
      headers: requestHeaders,
    });
    const token = jwtResult?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required. Please log in to delete events." },
        { status: 401 }
      );
    }

    const { eventId } = await params;

    const res = await fetch(
      `${API_BASE_URL}/created-events/${encodeURIComponent(eventId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await readJson(res);
    return NextResponse.json(result.data ?? { message: result.message }, {
      status: result.status,
    });
  } catch (error) {
    console.error("created-events proxy failed:", error);
    return NextResponse.json(
      { message: "Could not reach the API. Please try again." },
      { status: 502 }
    );
  }
}
