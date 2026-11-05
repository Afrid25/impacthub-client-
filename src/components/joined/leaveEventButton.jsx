"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500";

export default function LeaveEventButton({ joiningId, onLeave }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Deletes ONLY the participation record (joiningCollection) by its _id.
  const handleLeave = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/delete-events/${joiningId}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("You have left the event.");
        setOpen(false);
        onLeave();
      } else {
        toast.error(data.message || "Failed to leave event.");
      }
    } catch {
      toast.error("Failed to leave event.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive-foreground transition-colors text-sm font-medium"
          />
        }
      >
        <Trash2 className="h-4 w-4" /> Leave Event
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave event?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this event? Your participation
            record will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleLeave}
            disabled={deleting}
          >
            {deleting ? "Leaving..." : "Leave Event"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
