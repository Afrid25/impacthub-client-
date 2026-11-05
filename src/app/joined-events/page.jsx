
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import JoinedEventsList from "@/components/joined/joinedEventsList";

async function JoinedEventsContent() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const user = session?.user;

  if (!user?.email) {
    redirect("/login");
  }

  // Forward the Better Auth session cookie so Express can verify the user.
  const res = await fetch(
    `http://localhost:4500/joined-events/${encodeURIComponent(user.email)}`,
    {
      cache: "no-store",
      headers: { cookie: requestHeaders.get("cookie") || "" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load joined events");
  }

  const data = await res.json();
  const joinedEvents = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-3 font-heading text-3xl font-bold">
            Joined Events
          </h1>
          <p className="text-sm text-muted-foreground">
            Here are the events you have joined.
            You can view details and manage your participation.
          </p>
        </div>
        <JoinedEventsList events={joinedEvents} />
      </div>
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-muted-foreground">
          Loading joined events...
        </div>
      }
    >
      <JoinedEventsContent />
    </Suspense>
  );
}
