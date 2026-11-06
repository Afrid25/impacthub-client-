import React, { Suspense } from "react";
import AllEventsClient from "./client";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

  

function AllEventsSkeleton() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-surface border border-border p-6 shadow-sm flex flex-col h-full space-y-4"
          >
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-11 w-full rounded-xl mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

//
async function AllEventsContent() {
  let data = [];

  try {
    const res = await fetch(`${API_BASE_URL}/all-events`, {
      cache: "no-store",
    });

    if (res.ok) {
      data = (await res.json()) || [];
    } else {
      console.error("Failed to fetch events:", res.status);
    }
  } catch (error) {
    if (error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }

    console.error("Failed to fetch events:", error);
  }

  return (
    <AllEventsClient
      initialEvents={Array.isArray(data) ? data : []}
    />
  );
}

export default function AllEventsPage() {
  return (
    <Suspense fallback={<AllEventsSkeleton />}>
      <AllEventsContent />
    </Suspense>
  );
}