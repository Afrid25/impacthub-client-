"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Calendar, MapPin, User } from "lucide-react";

const JoiningCardPage = ({ event, formattedDate, formattedTime }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinEvent = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to join this event.");
      return;
    }

    if (isJoining || joined) {
      return;
    }

    setIsJoining(true);

    try {
      const data = {
        bookingDate: new Date().toISOString(),
        eventId: event?._id || event?.id,
        eventType: event?.eventType,
        title: event?.title,
        description: event?.description,
        date: event?.date,
        location: event?.location,
        thumbnail: event?.thumbnail,
        userId: user?.id || "",
        userName: user?.name || "",
        userEmail: user?.email || "",
        userImage: user?.image || "",
      };

      // Identity fields are re-applied server-side from the verified session.
      const res = await fetch("http://localhost:4500/joined", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        setJoined(true);
        toast.success("You have joined this event!");
      } else {
        // Backend should return 409/conflict for duplicate joins
        toast.error(result.message || "Failed to join event. You may already be joined.");
      }
    } catch (err) {
      toast.error("Failed to join event. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div>
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

          {/* Action Buttons — Join This Event only */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border/50">
            <button
              onClick={handleJoinEvent}
              disabled={isJoining || joined}
              className="w-full sm:w-[180px] flex justify-center items-center gap-2 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? "Joining..." : joined ? "Joined" : "Join This Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoiningCardPage;
