"use client";

import { useState } from "react";
import { Plus, ChevronRight, ShieldCheck } from "lucide-react";

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
    eventType: "",
    date: "",
    location: "",
    thumbnail: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4500/add-events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
  });

  const data = await res.json();
    
  console.log("Server Response:", data);
  };

  console.log("Form Data:", formData);

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
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    >
                      <option value="">Select an event type</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium dark:text-[#E4E4E7] text-foreground mb-1.5">
                      Event date
                    </label>
                    <input
                      name="date"
                      type="date"
                      placeholder="Choose a future date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground dark:border-[#45454D] focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
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
