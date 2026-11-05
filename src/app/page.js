"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Mail, Sparkles } from "lucide-react";
import Banner from "@/components/banner";
import RecentEvents from "@/components/recent-events";

const galleryItems = [
  {
    title: "Coastal & Riverfront Cleanup",
    category: "Cleanup",
    location: "Cox's Bazar",
    image:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Urban Tree Plantation Drive",
    category: "Plantation",
    location: "Chattogram",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Community Food Distribution",
    category: "Food Distribution",
    location: "Dhaka",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Youth Literacy & Education",
    category: "Education",
    location: "Sylhet",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Voluntary Blood Donation Camp",
    category: "Blood Donation",
    location: "Rajshahi",
    image:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Winter Warmth & Relief Drive",
    category: "Donation",
    location: "Rangpur",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Subscribed to ImpactHub updates!", {
      description: "We will keep you posted on upcoming community initiatives.",
    });
    setNewsletterEmail("");
  };

  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex-1">
        <Banner />
        <RecentEvents />

        {/* Community Service Gallery Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/60">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Impact in Action
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Community Service Gallery
              </h2>
              <p className="text-sm text-muted-foreground">
                Moments captured from volunteer-led cleanups, tree plantations,
                and relief initiatives across communities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.title}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section (UI Only) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-surface p-8 sm:p-12 shadow-sm">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Stay Connected With Local Causes
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Subscribe to our community newsletter for weekly digests of
                upcoming social development events and volunteer stories.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  required
                  className="flex-1 rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
