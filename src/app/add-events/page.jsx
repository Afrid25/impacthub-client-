"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, ChevronRight, ShieldCheck, Calendar } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";

const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Donation",
  "Food Distribution",
  "Education",
  "Other",
];

export default function AddEventsPage() {
  const [formData, setFormData] = useState({
    title: "",
    eventType: eventTypes[0],
    date: "",
    location: "",
    thumbnail: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const [today, setToday] = useState("");
  const dateInputRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const openDatePicker = () => {
    const dateInput = dateInputRef.current;
    if (!dateInput) {
      return;
    }

    if (typeof dateInput.showPicker === "function") {
      dateInput.showPicker();
    } else {
      dateInput.focus();
      dateInput.click();
    }
  };

  const validate = () => {
    const next = {};
    if (!formData.eventType?.trim()) {
      next.eventType = "Event type is required.";
    }
    if (!formData.date) {
      next.date = "Event date is required.";
    } else if (formData.date < today) {
      next.date = "Event date cannot be in the past.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const res = await fetch("http://localhost:4500/add-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        eventType: formData.eventType.trim(),
      }),
    });

    const data = await res.json();

    console.log("Server Response:", data);
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="px-4 sm:px-6 lg:px-8 py-6">
        <span className="text-xs font-medium text-primary tracking-wider uppercase mb-2 block">
          Organize for Good
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Create a community event
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Share the details of your initiative and invite people to make a difference.
        </p>
      </header>

      <div className="border border-border bg-background rounded-4xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Event Information Form */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-surface border border-border shadow-stone-400 p-6 lg:p-8">
              <h2 className="font-heading font-semibold text-foreground mb-6">
                Event information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                      Event Title
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="e.g. Winter Clothes Distribution"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                      Event Type
                    </label>
                    <Combobox
                      id="event-type-combobox"
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
                        className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                              <ComboboxItem
                                value={formData.eventType.trim()}
                              >
                                Create &apos;{formData.eventType.trim()}&apos;
                              </ComboboxItem>
                            )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {errors.eventType && (
                      <p className="mt-1 text-xs text-error">
                        {errors.eventType}
                      </p>
                    )}
                  </div>
                  <div className="relative col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                      Event date
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        aria-label="Choose event date"
                        onClick={openDatePicker}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-foreground dark:text-[#E4E4E7]"
                      >
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <input
                        ref={dateInputRef}
                        name="date"
                        type="date"
                        {...(today ? { min: today } : {})}
                        placeholder="Choose a future date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`w-full rounded-lg border pr-10 bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground [&::-webkit-calendar-picker-indicator]:opacity-0 focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                          errors.date
                            ? "border-error text-error"
                            : "border-border dark:border-[#45454D]"
                        }`}
                      />
                    </div>
                    {errors.date && (
                      <p className="mt-1 text-xs text-error">
                        {errors.date}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                    Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    placeholder="e.g. Mirpur 10, Dhaka"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                    Thumbnail Image URL
                  </label>
                  <input
                    name="thumbnail"
                    type="url"
                    placeholder="https://example.com/event-photo.jpg"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Tell volunteers what your event is about..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-1 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Event <span className="ml-1 text-xs opacity-70">*</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              <div className="rounded-2xl bg-surface border border-border p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-semibold text-foreground">
                    Make it meaningful
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  A great event starts with clear details.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#9642;</span>
                    Pick a descriptive title
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#9642;</span>
                    Choose a future date
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#9642;</span>
                    Specify event location
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#9642;</span>
                    Use a relevant image
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">&#9642;</span>
                    Explain how volunteers can help
                  </li>
                </ul>
              </div>

              <div
                className="rounded-2xl bg-[#0f2a22] border border-[#2d4a3f]/50 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-[#22C55E]" />
                  <h3 className="font-heading font-semibold text-foreground">
                    Community-first
                  </h3>
                </div>
                <p className="text-xs text-[#A1A1AA]/80">
                  All submitted events are visible to volunteers across the
                  platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
