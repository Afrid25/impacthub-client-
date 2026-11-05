import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ManageEventList from "@/components/manage-events/manageEventsList";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500";

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

  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  // Forward the Better Auth session cookie so Express can verify the user.
  const res = await fetch(`${API_BASE_URL}/my-events`, {
    cache: "no-store",
    headers: { cookie: requestHeaders.get("cookie") || "" },
  });

  if (!res.ok) {
    throw new Error("Failed to load created events");
  }

  const data = await res.json();
  const events = Array.isArray(data) ? data : [];

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
