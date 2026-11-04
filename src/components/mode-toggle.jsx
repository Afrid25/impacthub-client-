"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function ModeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = saved || "dark";

    applyTheme(initialTheme);
    localStorage.setItem(THEME_STORAGE_KEY, initialTheme);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
