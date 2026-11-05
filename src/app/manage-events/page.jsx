import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ManageEventList from "@/components/manage-events/manageEventsList";

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
  const res = await fetch("http://localhost:4500/my-events", {
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
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-muted-foreground">
          Loading your events...
        </div>
      }
    >
      <ManageEventsContent />
    </Suspense>
  );
}
