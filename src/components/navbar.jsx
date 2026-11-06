
"use client";



import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Menu,
  X,
  LogOut,
  Plus,
  CalendarDays,
  ClipboardList,
  Users,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import Image from "next/image";

const defaultNavLinks = [
  { label: "Upcoming Events", href: "/all-events" },
  { label: "Create Event", href: "/add-events" },
  { label: "Manage Events", href: "/manage-events" },
  { label: "Joined Events", href: "/joined-events" },
];

const profileLinks = [
  {
    label: "Create Event",
    href: "/add-events",
    icon: Plus,
  },
  {
    label: "Manage Events",
    href: "/manage-events",
    icon: ClipboardList,
  },
  {
    label: "Joined Events",
    href: "/joined-events",
    icon: Users,
  },
];

export function Navbar({
  brand = "ImpactHub",
  brandHref = "/",
  navLinks = defaultNavLinks,
  authLinks = [],
  className = "",
}) {
  const router = useRouter();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isPending || !user) return;
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("impacthub_oauth_pending") === "1") {
      sessionStorage.removeItem("impacthub_oauth_pending");
      toast.success("Login successful!");
    }
  }, [mounted, isPending, user]);

  const handleNavigation = (href) => {
    setMobileOpen(false);
    setPopoverOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(
          error.message || "Logout failed"
        );
      }

      setMobileOpen(false);

      toast.success("Logged out successfully!", {
        description: "You have been signed out.",
      });

      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error("Logout Failed", {
        description:
          error.message || "Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderAvatar = () => (
    <Avatar className="h-10 w-10 cursor-pointer border border-border">
      <AvatarImage
        src={user?.image || undefined}
        alt={user?.name || "User"}
      />
      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
        {user?.name?.charAt(0)?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  );

  const authControls = !mounted || isPending ? (
    <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
  ) : user ? (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open profile menu"
            title={user?.name || "User"}
            className="rounded-full"
          />
        }
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user?.image || undefined}
            alt={user?.name || "User"}
          />
          <AvatarFallback>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>


      <PopoverContent
        align="end"
        className="w-64 rounded-2xl border border-border bg-background p-3 shadow-xl"
      >
        {/* User Profile Section */}
        <div className="mb-3 rounded-xl border border-border/60 bg-muted/40 px-4 py-5 text-center">
          {/* User Avatar Initial */}
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* User Name */}
          <h3 className="break-words text-base font-semibold text-foreground">
            {user?.name || "User"}
          </h3>

          {/* User Email */}
          <p className="mt-1 break-all text-xs leading-relaxed text-muted-foreground">
            {user?.email || "No email available"}
          </p>
        </div>

        {/* Divider */}
        <div className="mb-3 border-t border-border/70" />

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-1.5">
          <Button
            variant="ghost"
            onClick={() => handleNavigation("/add-events")}
            className="w-full justify-start rounded-lg"
          >
            Create Event
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation("/manage-events")}
            className="w-full justify-start rounded-lg"
          >
            Manage Events
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleNavigation("/joined-events")}
            className="w-full justify-start rounded-lg"
          >
            Joined Events
          </Button>

          <div className="my-1 border-t border-border/70" />

          <Button
            variant="destructive"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full rounded-lg"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </PopoverContent>

    </Popover>
  ) : (
    <Button
      size="sm"
      onClick={() => handleNavigation("/login")}
      className="rounded-lg"
    >
      Login
    </Button>
  );

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
      />

      <nav
        aria-label="Main navigation"
        className={cn(
          "sticky top-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-border bg-background/95 text-foreground shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors duration-300",
          className
        )}
      >
        {/* NAVBAR MAIN ROW */}
        <div className="grid grid-cols-[1fr_auto] items-center px-4 py-3 sm:px-6 lg:grid-cols-[1fr_auto_1fr]">

          {/* LEFT: BRAND */}
          <Link
            href={brandHref}
            aria-label={`${brand} home`}
            onClick={() => setMobileOpen(false)}
            className="flex w-fit items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <Image
              src="/ImpactHubLogo.png"
              alt={`${brand} logo`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="text-xl font-bold tracking-tight text-foreground">
              {brand}
            </span>
          </Link>

          {/* CENTER: DESKTOP LINKS */}
          <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative whitespace-nowrap text-sm font-medium text-foreground/75 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT: DESKTOP CONTROLS */}
          <div className="hidden items-center justify-end gap-3 lg:flex">

            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}

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
              onClick={() =>
                setMobileOpen((prev) => !prev)
              }
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
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

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}

              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-3 border-t border-border" />

              {/* Mobile Auth */}
              {!mounted || isPending ? (
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
              ) : user ? (
                <>
                  {/* User Profile */}
                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                    {renderAvatar()}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {user.name || "My Account"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Signed in
                      </p>
                    </div>
                  </div>

                  {/* Logout */}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="w-full justify-center gap-2 rounded-lg text-destructive"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}

                    {isLoggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() =>
                    handleNavigation("/login")
                  }
                  className="w-full rounded-lg"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
