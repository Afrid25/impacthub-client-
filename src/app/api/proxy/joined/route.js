import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { API_BASE_URL, readJson } from "@/lib/api";

export async function POST(request) {
  try {
    const requestHeaders = await headers();
    const jwtResult = await auth.api.getToken({
      headers: requestHeaders,
    });
    const token = jwtResult?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required. Please log in to join events." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    const res = await fetch(`${API_BASE_URL}/joined`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await readJson(res);
    return NextResponse.json(result.data ?? { message: result.message }, {
      status: result.status,
    });
  } catch (error) {
    console.error("joined proxy failed:", error);
    return NextResponse.json(
      { message: "Could not reach the API. Please try again." },
      { status: 502 }
    );
  }
}
