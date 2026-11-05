"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ManageEventCard from "@/components/manage-events/manageEventCard";
import EditEventsDialog from "@/components/editEventsDialog";

export default function ManageEventList({ events }) {
  const [eventsList, setEventsList] = useState(events);
  const [editEvent, setEditEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = useCallback((event) => {
    setEditEvent(event);
    setEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditOpen(false);
    setEditEvent(null);
  }, []);

  // EditEventsDialog performs the authenticated PATCH; here we only
  // merge the saved fields into the local list so the card updates.
  const handleSaveEdit = useCallback((updatedEvent) => {
    const eventId = updatedEvent?._id || updatedEvent?.id;
    if (!eventId) return;
    setEventsList((prev) =>
      prev.map((e) =>
        (e._id || e.id) === eventId ? { ...e, ...updatedEvent } : e
      )
    );
  }, []);

  const handleDelete = useCallback((eventId) => {
    setEventsList((prev) => prev.filter((e) => (e._id || e.id) !== eventId));
  }, []);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 font-heading text-3xl font-bold">
                Manage your initiatives
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit, organize, and keep track of events you have created.
              </p>
            </div>
            <Link href="/add-events">
              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="h-4 w-4" /> Create Event
              </button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {eventsList.length} created event{eventsList.length !== 1 ? "s" : ""}
          </p>
        </div>

        {eventsList.length > 0 ? (
          <div className="space-y-5">
            {eventsList.map((event) => (
              <ManageEventCard
                key={event._id || event.id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t created any events yet.
            </p>
          </div>
        )}
      </div>

      <EditEventsDialog
        key={editEvent?._id || editEvent?.id || "closed"}
        open={editOpen}
        event={editEvent}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
