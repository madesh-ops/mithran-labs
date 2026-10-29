"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/ui/Icons";
import styles from "./Nav.module.css";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

/** Commit the theme: attribute, persistence, browser chrome, subscribers. */
function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.dataset.theme = next;
  try {
    localStorage.setItem("ml-theme", next);
  } catch {
    /* storage unavailable — theme still applies for this page view */
  }
  // There is one theme-color meta per OS scheme; update both or the browser
  // chrome keeps the OS colour when the chosen theme differs from it.
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute("content", next === "dark" ? "#121211" : "#f5f4f0"));
  listeners.forEach((l) => l());
}

/* — Liquid wave —
   The View Transition API snapshots the old theme and renders the new one
   live beneath it; globals.css ("Theme morph") reveals the new theme behind
   a rippling, S-shaped wave that rolls across from the toggle side, with a
   thin rim of light along its curve. Because the whole page is one snapshot,
   background, text, borders, cards, nav, buttons and shadows all change
   together, compositor-cheap, with no per-element repaints. Reduced motion
   and browsers without View Transitions get a short colour crossfade
   instead (.theme-fade). */

let current: ViewTransition | null = null;
let fadeTimer = 0;

function setTheme(next: Theme) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || typeof document.startViewTransition !== "function") {
    root.classList.add("theme-fade");
    applyTheme(next);
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(() => root.classList.remove("theme-fade"), reduce ? 300 : 950);
    return;
  }

  // Rapid toggling: settle the running morph instantly, then morph from there,
  // so every click counts and the final theme is always the last one asked for.
  current?.skipTransition();
  root.classList.add("theme-morph");

  const vt = document.startViewTransition(() => {
    applyTheme(next);
    // The rim of light: present only in the new state, so it becomes its
    // own transition layer above the page (see .theme-sheen).
    if (!document.querySelector(".theme-sheen")) {
      const sheen = document.createElement("div");
      sheen.className = "theme-sheen";
      sheen.setAttribute("aria-hidden", "true");
      document.body.appendChild(sheen);
    }
  });
  current = vt;
  // Start the rim with the mask, on the same frame, so they move as one.
  vt.ready.then(() => document.querySelector(".theme-sheen")?.classList.add("is-running")).catch(() => {});
  vt.finished.finally(() => {
    if (current !== vt) return; // a newer morph owns the cleanup
    current = null;
    root.classList.remove("theme-morph");
    document.querySelector(".theme-sheen")?.remove();
  });
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`${styles.iconButton} ${styles.themeButton} ${className}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      {/* Both icons render and cross-rotate; CSS shows the right one before hydration. */}
      <Sun className={styles.sun} />
      <Moon className={styles.moon} />
    </button>
  );
}
