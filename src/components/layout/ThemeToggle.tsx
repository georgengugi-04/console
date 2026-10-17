"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { currentTheme, setTheme, subscribeTheme, type Theme } from "@/lib/theme";

/**
 * Light/dark switch. Both icons are rendered and CSS shows the right one from <html data-theme>,
 * so the first paint is correct before hydration. aria-pressed exposes the state ("Dark mode: on/off").
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => "light" as Theme);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-field-line text-fg transition-colors hover:bg-brand-soft ${className}`}
    >
      <Sun size={19} aria-hidden className="theme-icon-sun" />
      <Moon size={19} aria-hidden className="theme-icon-moon" />
    </button>
  );
}
