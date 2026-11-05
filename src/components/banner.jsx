"use client";

import Link from "next/link";
import { ArrowRight, HandHeart, Users, ShieldCheck, CalendarCheck } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px] -z-10" />

      <div className="relative py-20 px-4 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-sm font-medium text-primary mb-8">
            <HandHeart className="h-4 w-4" />
            Community Service Platform
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6 leading-tight">
            Together, We Make a Difference.
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover local initiatives, connect with volunteers, and create
            meaningful change in your community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/all-events"
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/add-events"
              className="flex items-center gap-2 px-8 py-3.5 border border-border bg-surface text-foreground font-medium rounded-lg text-sm hover:bg-surface-elevated transition-colors"
            >
              Create an Event
            </Link>
          </div>

          {/* Impact stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <span className="text-3xl font-heading font-bold text-primary">
                120+
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Community Events
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <span className="text-3xl font-heading font-bold text-primary">
                2.4k
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Active Volunteers
              </p>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <span className="text-3xl font-heading font-bold text-primary">
                18
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Cities Reached
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2 sm:px-0">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-surface flex items-center justify-center border border-border">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base">
                Discover Events
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-xs">
                Find community service events happening near you.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-surface flex items-center justify-center border border-border">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base">
                Join Activities
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-xs">
                Volunteer for local causes and make an immediate impact.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-surface flex items-center justify-center border border-border">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base">
                Create Initiatives
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-xs">
                Organize your own social development event.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-surface flex items-center justify-center border border-border">
                <CalendarCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base">
                Track Participation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-xs">
                Manage your joined events and volunteer commitments in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
