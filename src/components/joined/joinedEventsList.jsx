"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, MapPin } from "lucide-react";
import LeaveEventButton from "@/components/joined/leaveEventButton";

const formatEventDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export default function JoinedEventsList({ events }) {
  const [eventsList, setEventsList] = useState(events);

  const handleLeave = (leavingId) => {
    setEventsList((prev) =>
      prev.filter((e) => (e._id || e.id) !== leavingId)
    );
  };

  return (
    <div className="space-y-5">
      {eventsList.length > 0 ? (
        <div className="space-y-5">
          {eventsList.map((event, index) => (
            <div
              key={event._id || event.id || index}
              className="group overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-5"
            >
              <div className="flex flex-col gap-5 md:flex-row md:gap-6">
                {/* Left: Image */}
                <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-muted md:w-[36%] lg:w-[32%]">
                  <div className="relative h-52 md:h-full md:min-h-[220px]">
                    {event.thumbnail ? (
                      // Plain <img> (same as Manage Events card) so thumbnails from
                      // any host render; next/image only allows images.unsplash.com.
                      <img
                        src={event.thumbnail}
                        alt={event.title || "Community event"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No event image available
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                  <span className="mb-3 w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {event.eventType}
                  </span>
                  <h2 className="mb-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
                    {event.title}
                  </h2>
                  <p className="mb-5 line-clamp-3 text-sm leading-7 text-muted-foreground">
                    {event.description || "No description available."}
                  </p>
                  <div className="mb-4 border-t border-border/70" />
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} className="shrink-0 text-primary" />
                      <span>
                        {formatEventDate(event.date || event.data)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="shrink-0 text-primary" />
                      <span>
                        {event.location || "Location unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-end pt-3">
                    <div className="flex gap-2 flex-wrap">
                      {event.eventId ? (
                        <Link
                          href={`/all-events/${event.eventId}`}
                          className="flex items-center gap-1"
                        >
                          <button
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-surface text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            <Eye className="h-4 w-4" /> View Details
                          </button>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border/30 bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed transition-colors"
                        >
                          <Eye className="h-4 w-4" /> View Details
                        </button>
                      )}
                      <LeaveEventButton
                        joiningId={event._id || event.id}
                        onLeave={() =>
                          handleLeave(event._id || event.id)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t joined any events yet. Join an event to see it here.
          </p>
        </div>
      )}
    </div>
  );
}
