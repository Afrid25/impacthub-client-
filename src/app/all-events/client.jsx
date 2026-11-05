"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const eventTypes = [
  "All Categories",
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Food Distribution",
  "Education",
  "Other",
];

export default function AllEventsClient({
  initialEvents,
}) {
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events
    .filter((event) => {
      if (!searchQuery) return true;
      return event.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    })
    .filter((event) => {
      if (filterType === "All Categories") return true;
      return event.eventType === filterType;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date) - new Date(b.date);
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="px-4 sm:px-6 lg:px-8 py-8">
        <span className="text-xs font-medium text-primary tracking-wider uppercase mb-2 block">
          Take Action Today
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          All Events
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Find volunteering opportunities, join local causes, and make
          meaningful change in your community.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-2xl bg-surface border border-border p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="date">Date: Upcoming</option>
                <option value="name">Sort: A-Z</option>
              </select>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Search #
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing {filteredEvents.length} community events
            </span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Sort: Event date</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="ml-1 rounded-lg border border-border bg-surface-elevated px-2 py-1 text-xs text-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="date">Event date</option>
                <option value="name">Event name</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-3 w-3 text-muted-foreground"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-error mb-4">Failed to load events.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground mb-4">No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
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
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
