"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500";

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Food Distribution",
  "Education",
  "Other",
];

// <input type="date"> needs YYYY-MM-DD; also supports the legacy `data` field.
const toDateInputValue = (event) => {
  const raw = event?.date || event?.data || "";
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
};

export default function EditEventsDialog({
  open,
  event,
  onClose,
  onSave,
}) {
  const eventId = event?._id || event?.id;
  const [formData, setFormData] = useState({
    title: event?.title || "",
    eventType: event?.eventType || eventTypes[0],
    date: toDateInputValue(event),
    location: event?.location || "",
    thumbnail: event?.thumbnail || "",
    description: event?.description || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // The form resets per event because the parent remounts this dialog
  // with `key={event._id}` (avoids setState inside an effect).

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = useCallback(() => {
    const next = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.title?.trim()) {
      next.title = "Event title is required.";
    }
    if (!formData.eventType?.trim()) {
      next.eventType = "Event type is required.";
    }
    if (!formData.date) {
      next.date = "Event date is required.";
    } else if (formData.date < today) {
      next.date = "Event date cannot be in the past.";
    }
    if (!formData.location?.trim()) {
      next.location = "Event location is required.";
    }
    if (formData.thumbnail?.trim()) {
      try {
        const parsed = new URL(formData.thumbnail.trim());
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          next.thumbnail = "Thumbnail must be a valid http or https URL.";
        }
      } catch {
        next.thumbnail = "Thumbnail must be a valid http or https URL.";
      }
    }
    if (!formData.description?.trim()) {
      next.description = "Event description is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent duplicate submissions
    if (!validate()) return;
    if (!eventId) {
      toast.error("Unable to update: missing event ID.");
      return;
    }

    const updates = {
      title: formData.title.trim(),
      eventType: formData.eventType.trim(),
      date: formData.date,
      location: formData.location.trim(),
      thumbnail: formData.thumbnail.trim(),
      description: formData.description.trim(),
    };

    setLoading(true);
    try {
      // Updates the ORIGINAL event; ownership is verified server-side.
      const res = await fetch(`${API_BASE_URL}/update-events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("Event updated successfully");
        if (onSave) onSave({ ...event, ...updates });
        onClose();
      } else {
        toast.error(data.message || "Failed to update event");
      }
    } catch (err) {
      toast.error("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the details of &quot;{event?.title || ""}&quot;. The event ID and
            ownership are preserved.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Event Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="e.g. Winter Clothes Distribution"
              value={formData.title}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                errors.title ? "border-error text-error" : "border-border"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-error">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Event Type
            </label>
            <Combobox
              value={formData.eventType}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, eventType: value }));
                if (errors.eventType) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.eventType;
                    return next;
                  });
                }
              }}
            >
              <ComboboxInput
                name="eventType"
                placeholder="Select or type an event type"
                className="w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <ComboboxContent>
                <ComboboxList>
                  {eventTypes.map((type) => (
                    <ComboboxItem key={type} value={type}>
                      {type}
                    </ComboboxItem>
                  ))}
                  {formData.eventType?.trim() &&
                    !eventTypes.includes(formData.eventType.trim()) && (
                      <ComboboxItem value={formData.eventType.trim()}>
                        Create &apos;{formData.eventType.trim()}&apos;
                      </ComboboxItem>
                    )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {errors.eventType && (
              <p className="mt-1 text-xs text-error">{errors.eventType}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Event Date
            </label>
            <div className="relative">
              <input
                name="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={handleChange}
                className={`w-full rounded-lg border pr-10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                  errors.date ? "border-error text-error" : "border-border"
                }`}
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-error">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Location
            </label>
            <input
              name="location"
              type="text"
              placeholder="e.g. Mirpur 10, Dhaka"
              value={formData.location}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                errors.location ? "border-error text-error" : "border-border"
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-error">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Thumbnail Image URL
            </label>
            <input
              name="thumbnail"
              type="url"
              placeholder="https://example.com/event-photo.jpg"
              value={formData.thumbnail}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                errors.thumbnail ? "border-error text-error" : "border-border"
              }`}
            />
            {errors.thumbnail && (
              <p className="mt-1 text-xs text-error">{errors.thumbnail}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Tell volunteers what your event is about..."
              value={formData.description}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                errors.description ? "border-error text-error" : "border-border"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-error">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
