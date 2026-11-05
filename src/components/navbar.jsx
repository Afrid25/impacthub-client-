"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultNavLinks = [
  { label: "Upcoming Events", href: "/all-events" },
  { label: "Create Event", href: "/add-events" },
  { label: "Manage Events", href: "/manage-events" },
  { label: "Joined Events", href: "/joined-events" },
];

export function Navbar({
  brand = "ImpactHub",
  brandHref = "/",
  navLinks = defaultNavLinks,
  authLinks = [],
  className = "",
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mounted state prevents hydration mismatch: SSR has no session cookie,
  // so auth-dependent UI (avatar vs. Login button) must only render after
  // the client has hydrated and useSession() can read cookies.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Logout failed");
      return;
    }

    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  // Render auth-dependent UI only after mount to avoid hydration mismatch
  // between SSR (no session cookie) and client (cookie available).
  const authControls = mounted ? (
    isPending ? (
      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
    ) : user ? (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={({ ...triggerProps }) => (
            <button
              type="button"
              aria-label="Open profile menu"
              title={user.name}
              className="rounded-full"
              {...triggerProps}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          )}
        />

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={() => router.push("/add-events")}
          >
            Create Event
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/manage-events")}
          >
            Manage Events
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => router.push("/joined-events")}
          >
            Joined Events
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button size="sm" onClick={() => router.push("/login")}>
        Login
      </Button>
    )
  ) : (
    <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
  );

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "sticky top-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-7xl rounded-3xl border border-border bg-background/95 text-foreground shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-300",
        className,
      )}
    >
      <Toaster />

      {/* NAVBAR MAIN ROW */}
      <div className="grid grid-cols-[1fr_auto] items-center px-4 py-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">
        {/* LEFT: LOGO + BRAND */}
        <Link
          href={brandHref}
          aria-label={`${brand} home`}
          className="flex w-fit items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            IH
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {brand}
          </span>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center justify-center gap-5 xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative whitespace-nowrap text-sm font-medium transition-colors duration-200 text-foreground/75 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT: THEME TOGGLE + AUTH */}
        <div className="hidden lg:flex items-center justify-end gap-3">
          {/* AUTH LINKS (reserved for future auth implementation) */}
          {authLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}

          {/* THEME TOGGLE */}
          <ModeToggle />

          {authControls}
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex items-center justify-end gap-2 lg:hidden">
          <ModeToggle />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="rounded-lg"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-border px-4 pb-4 pt-3 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMobileMenu}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}

            {/* AUTH LINKS (reserved for future auth implementation) */}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMobileMenu}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
