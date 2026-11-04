"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Sun,
  Moon,
  User,
  LogOut,
  Plus,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "impacthub-theme";

function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function Navbar({
  isAuthenticated = false,
  user = null,
  onLogin,
  onLogout,
}) {
  const [theme, setTheme] = useState("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = saved || "dark";

    applyTheme(initialTheme);
    localStorage.setItem(THEME_STORAGE_KEY, initialTheme);

    // Sync React state with saved preference after hydration.
    // Initial render is always "dark" on both server and client, so no mismatch.
    if (initialTheme !== theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(initialTheme);
    }

    const handleStorageChange = (e) => {
      if (e.key === THEME_STORAGE_KEY) {
        const next = e.newValue || "dark";
        setTheme(next);
        applyTheme(next);
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const displayName = user?.name || user?.email || "User";
  const profileImage = user?.image || null;

  const authLinks = (
    <>
      <Link
        href="/upcoming-events"
        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        Upcoming Events
      </Link>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <div
            className="relative inline-block"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onClick={() => setDropdownOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setDropdownOpen((prev) => !prev);
              }
            }}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            aria-label="User profile menu"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt={displayName}
                className="h-9 w-9 rounded-full border border-border object-cover transition-transform hover:scale-105"
                width={36}
                height={36}
                priority
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
          </div>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2"
              role="menu"
              aria-labelledby="profile-menu"
            >
              <Link
                href="/events/create"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors"
                role="menuitem"
              >
                <Plus className="h-4 w-4" /> Create Event
              </Link>
              <Link
                href="/manage-events"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors"
                role="menuitem"
              >
                <Calendar className="h-4 w-4" /> Manage Events
              </Link>
              <Link
                href="/joined-events"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors"
                role="menuitem"
              >
                <User className="h-4 w-4" /> Joined Events
              </Link>
              <hr className="border-border my-1" />
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-surface-elevated transition-colors text-left"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={onLogin}
          variant="default"
          className="text-sm font-medium"
        >
          Login
        </Button>
      )}
    </>
  );

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="sticky top-4 z-40 w-[95%] max-w-7xl mx-auto rounded-4xl border border-border bg-background/95 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl">
              IH
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              ImpactHub
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            href="/upcoming-events"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Upcoming Events
          </Link>
          {authLinks}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-surface text-foreground hover:bg-surface-elevated transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-surface text-foreground hover:bg-surface-elevated transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-surface text-foreground hover:bg-surface-elevated transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-border bg-background p-4"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="space-y-3">
            <Link
              href="/upcoming-events"
              onClick={toggleMobileMenu}
              className="block text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
            >
              Upcoming Events
            </Link>
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  href="/events/create"
                  onClick={toggleMobileMenu}
                  className="block text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
                >
                  Create Event
                </Link>
                <Link
                  href="/manage-events"
                  onClick={toggleMobileMenu}
                  className="block text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
                >
                  Manage Events
                </Link>
                <Link
                  href="/joined-events"
                  onClick={toggleMobileMenu}
                  className="block text-sm font-medium text-foreground hover:text-primary py-2 transition-colors"
                >
                  Joined Events
                </Link>
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    if (onLogout) onLogout();
                  }}
                  className="block w-full text-left text-sm font-medium text-destructive hover:bg-surface-elevated py-2 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  toggleMobileMenu();
                  if (onLogin) onLogin();
                }}
                className="block w-full text-left text-sm font-medium text-foreground bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Login
              </button>
            )}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" /> Switch to Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" /> Switch to Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
