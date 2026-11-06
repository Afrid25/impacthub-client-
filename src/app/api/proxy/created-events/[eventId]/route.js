import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500";

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

    const res = await fetch(`${API_BASE_URL}/created-events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
