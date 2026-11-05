"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Trash2, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const formatDate = (dateValue) => {
  if (!dateValue) return "Date unavailable";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ManageEventCard({ event, onEdit, onDelete }) {
  const eventId = event._id || event.id;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Deletes the ORIGINAL event (eventsCollection) after confirmation.
  const handleDeleteConfirm = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:4500/created-events/${eventId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete event"
        );
      }

      toast.success("Event deleted successfully!");
      setDeleteOpen(false);
      if (onDelete) onDelete(eventId);
    } catch (error) {
      // Keep the card when deletion fails.
      toast.error(error.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-5">
      <div className="flex flex-col gap-5 md:flex-row md:gap-6">

        {/* Left: Image */}
        <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-muted md:w-[36%] lg:w-[32%]">
          <div className="relative h-52 md:h-full md:min-h-[220px]">
            {event.thumbnail ? (
              <img
                src={event.thumbnail}
                alt={event.title || "Community event"}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
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

          {/* Event Type */}
          <span className="mb-3 w-fit rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            {event.eventType}
          </span>

          {/* Title */}
          <h2 className="mb-3 font-heading text-xl font-bold text-foreground sm:text-2xl">
            {event.title}
          </h2>

          {/* Short Description */}
          <p className="mb-5 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {event.description || "No description available."}
          </p>

          <div className="mb-4 border-t border-border/70" />

          {/* Event Information */}
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6">

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar size={18} className="shrink-0 text-primary" />
              <span>{formatDate(event.date || event.data)}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin size={18} className="shrink-0 text-primary" />
              <span>{event.location || "Location unavailable"}</span>
            </div>

          </div>

          {/* Action Buttons (bottom-right) */}
          <div className="mt-auto flex justify-end pt-3">
            <div className="flex gap-2 flex-wrap">

              {/* View Details */}
              <Link
                href={`/all-events/${eventId}`}
                className="flex items-center gap-1"
              >
                <button
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Eye className="h-4 w-4" /> View Details
                </button>
              </Link>

              {/* Edit */}
              <button
                onClick={() => onEdit && onEdit(event)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>

              {/* Delete */}
              <AlertDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
              >
                <AlertDialogTrigger
                  render={
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive-foreground transition-colors"
                    />
                  }
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{event.title}&quot;? This
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleDeleteConfirm}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete Event"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
