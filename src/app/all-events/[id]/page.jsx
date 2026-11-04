export const instant = false;

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";

export default async function EventDetailsPage({ params }) {
  const { id } = await params;
  let event = null;

  try {
    const res = await fetch(`http://localhost:4500/all-events/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      event = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch event:", e);
  }

  if (!event) {
    return (
      <div className="min-h-svh bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Link
              href="/all-events"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/90 mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Events
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Event Not Found
            </h1>
            <p className="text-sm text-muted-foreground">
              The event you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/all-events"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/90 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Event Image */}
          <div className="relative rounded-2xl bg-primary/10 border border-border overflow-hidden aspect-video">
            {event.thumbnail ? (
              <Image
                src={event.thumbnail}
                alt={event.title}
                fill
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-surface border border-border">
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

          {/* Right: Event Details */}
          <div className="flex flex-col h-full">
            <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-sm">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-5"
              >
                {event.eventType}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {event.title}
              </h1>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {event.description ||
                "A great event starts with clear details."}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {formattedDate}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formattedTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <p className="text-sm text-foreground">{event.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm text-foreground">
                    Organized by Community Volunteers
                  </p>
                </div>
              </div>

              {/* Join Event Button */}
              <button
                className="w-full flex justify-center items-center gap-2 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Join This Event
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 shadow-sm">
            <h2 className="font-heading font-semibold text-foreground mb-4">
              About this initiative
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description ||
              "Join us in making a difference. Share the details of your initiative and invite people to make a difference."}
            </p>
          </div>

          <div className="rounded-2xl bg-[#0f2a22] border border-[#2d4a3f]/50 p-6 sm:p-8 shadow-sm">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Your participation matters
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Meet volunteers, support your community, and make a meaningful
              difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
