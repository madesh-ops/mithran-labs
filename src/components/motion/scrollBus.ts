"use client";

import type Lenis from "lenis";

/**
 * One shared scroll heartbeat for every scroll-linked animation.
 *
 * With Lenis active, subscribers run synchronously inside Lenis's own frame
 * (right after it moves the page), so transforms never lag the scroll position
 * by a frame. Without Lenis (touch devices, reduced motion, before hydration)
 * native scroll/resize events schedule one rAF per frame.
 */
type Sub = () => void;

const subs = new Set<Sub>();
let lenis: Lenis | null = null;
let raf = 0;
let listening = false;

const runAll = () => {
  raf = 0;
  subs.forEach((s) => s());
};

const schedule = () => {
  if (!raf) raf = requestAnimationFrame(runAll);
};

function ensureNativeListeners() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

export function attachLenis(instance: Lenis | null) {
  lenis = instance;
  // Lenis emits "scroll" for smoothed and native scrolls alike.
  instance?.on("scroll", () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    runAll();
  });
}

export const getLenis = () => lenis;

export function subscribeScroll(sub: Sub) {
  ensureNativeListeners();
  subs.add(sub);
  schedule();
  return () => {
    subs.delete(sub);
  };
}

export const requestScrollFrame = schedule;
