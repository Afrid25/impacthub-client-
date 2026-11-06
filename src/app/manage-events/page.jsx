import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ManageEventList from "@/components/manage-events/manageEventsList";
import { Skeleton } from "@/components/ui/skeleton";
import { API_BASE_URL, readJson } from "@/lib/api";

function ManageEventsSkeleton() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-surface p-4 sm:p-5 flex flex-col gap-5 md:flex-row md:gap-6"
          >
            <Skeleton className="h-52 w-full rounded-xl md:w-[36%] lg:w-[32%]" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-end gap-2 pt-4">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function ManageEventsContent() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  // The route guard (proxy.js) normally redirects first. This covers a session
  // that expired between the guard and this render.
  if (!session?.user) {
    redirect("/login?callbackUrl=/manage-events");
  }

  let events = [];
  let loadError = null;

  try {
    // Express verifies this JWT; the identity is never taken from the browser.
    const { token } = await auth.api.getToken({ headers: requestHeaders });

    const res = await fetch(`${API_BASE_URL}/my-events`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await readJson(res);

    if (result.ok && Array.isArray(result.data)) {
      events = result.data;
    } else {
      loadError = result.message || "Could not load your events.";
    }
  } catch (error) {
    if (error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    console.error("Failed to load created events:", error);
    loadError = "Could not reach the server. Please try again.";
  }

  // Show a normal error message instead of throwing. A thrown error inside a
  // Server Component reaches the browser as the unreadable "React error #441".
  if (loadError) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-surface p-10 text-center">
            <h1 className="mb-2 font-heading text-2xl font-bold">
              We couldn&apos;t load your events
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">{loadError}</p>
            <Link
              href="/manage-events"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <ManageEventList events={events} />
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <Suspense fallback={<ManageEventsSkeleton />}>
      <ManageEventsContent />
    </Suspense>
  );
}
