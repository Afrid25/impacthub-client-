// Shared helpers for calling the Express API.

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!rawApiUrl && process.env.NODE_ENV === "production") {
  console.error(
    "NEXT_PUBLIC_API_URL is not set. Add it in your hosting environment variables."
  );
}

// Remove trailing slashes so `${API_BASE_URL}/all-events` never becomes
// "https://api.example.com//all-events" (that route does not exist on Express).
export const API_BASE_URL = (rawApiUrl || "http://localhost:4500").replace(
  /\/+$/,
  ""
);

// Read a fetch Response as JSON without ever throwing.
// Express (or a hosting platform) can answer with an HTML page, for example a
// 404, a redirect or a deployment-protection page. Calling res.json() on that
// throws "Unexpected token '<'", so we check the content type first.
export async function readJson(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      const data = await res.json();
      return {
        ok: res.ok,
        status: res.status,
        data,
        message: data?.message,
      };
    } catch {
      // fall through to the generic error below
    }
  }

  return {
    ok: false,
    // A "successful" non-JSON answer is still a failure for an API call.
    status: res.ok ? 502 : res.status,
    data: null,
    message: `The server sent an unexpected response (HTTP ${res.status}).`,
  };
}
