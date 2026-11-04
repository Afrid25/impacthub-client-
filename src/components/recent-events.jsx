"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RecentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch("http://localhost:4500/all-events", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const allEvents = data || [];
        const now = new Date();
        const upcoming = allEvents
          .filter((event) => new Date(event.date) > now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 6);
        setEvents(upcoming);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading upcoming events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-error mb-4">Failed to load upcoming events.</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            No upcoming events found.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Recent Upcoming Events
          </h2>
          <Link
            href="/all-events"
            className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
          >
            View All Events
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id || event._id}
              className="rounded-2xl bg-surface border border-border p-6 shadow-sm flex flex-col h-full"
            >
              <div className="aspect-video relative rounded-xl bg-primary/10 border border-border overflow-hidden mb-4">
                {event.thumbnail ? (
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="aspect-video h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="60"
                      viewBox="0 0 80 60"
                      fill="none"
                    >
                      <rect
                        width="80"
                        height="60"
                        rx="8"
                        fill="var(--surface)"
                        stroke="var(--border)"
                      />
                      <circle cx="50" cy="30" r="18" fill="var(--primary)" />
                      <path
                        d="M20 10 C20 10, 60 10, 75 25 C75 25, 60 40, 20 40 C20 40, 5 25, 20 10 Z"
                        fill="var(--muted-foreground)"
                        opacity={0.3}
                      />
                    </svg>
                  </div>
                )}
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mb-3">
                {event.eventType}
              </span>
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {event.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <span>•</span> {event.location}
              </p>
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                <span>•</span>
                {new Date(event.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <Link
                href={`/all-events/${event.id || event._id}`}
                className="w-full flex justify-center items-center gap-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                View Event
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
