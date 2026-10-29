"use client";

import { useLayoutEffect } from "react";

declare global {
  interface Window {
    __mlIntro?: "play" | "done" | "skip";
  }
}

/**
 * On the Strict-Mode remount in development, React resets `<html>`, `<head>`
 * and `<body>` to only the attributes it manages from JSX — clearing the `js`
 * class, the theme and the intro state that the pre-paint boot script set.
 * Re-apply them before paint so the intro behaves the same in dev as in prod.
 * This is a no-op in production.
 */
export function IntroBoot() {
  useLayoutEffect(() => {
    const d = document.documentElement;
    d.classList.add("js");
    try {
      const saved = localStorage.getItem("ml-theme");
      d.dataset.theme =
        saved === "light" || saved === "dark"
          ? saved
          : matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    } catch {
      /* storage unavailable — keep whatever the server rendered */
    }
    d.dataset.intro = window.__mlIntro ?? "skip";
  }, []);
  return null;
}
