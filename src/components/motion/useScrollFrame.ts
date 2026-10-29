"use client";

import { useEffect, useRef } from "react";
import { requestScrollFrame, subscribeScroll } from "./scrollBus";

/**
 * Calls `onFrame` whenever the page scrolls or resizes (at most once per frame,
 * in sync with smooth scrolling), plus once on mount. No continuous loop and no
 * React state updates per frame.
 */
export function useScrollFrame(onFrame: () => void, enabled = true) {
  const cb = useRef(onFrame);
  useEffect(() => {
    cb.current = onFrame;
  });

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = subscribeScroll(() => cb.current());
    // Fonts / images settling can move things; re-measure once they have.
    document.fonts?.ready.then(requestScrollFrame).catch(() => {});
    return unsubscribe;
  }, [enabled]);
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Smooth deceleration into the final position (no overshoot). */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
