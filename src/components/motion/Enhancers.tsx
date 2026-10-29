"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide progressive enhancements, mounted once in the root layout:
 *  - Scroll reveals for any element with [data-reveal]
 *  - Specular highlight that follows the pointer across .glass surfaces
 * Both are cheap: one IntersectionObserver and one delegated, rAF-throttled
 * pointer listener for the whole document.
 */
const revealed = new WeakSet<Element>();

export function Enhancers() {
  const pathname = usePathname();

  // Scroll reveals — rescan whenever the route changes. Uses the Web Animations
  // API (fill: forwards) rather than toggling classes, so it never mutates
  // attributes React is still hydrating in streamed segments.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = (el: HTMLElement, instant = false) => {
      if (revealed.has(el)) return;
      revealed.add(el);
      const delay = instant ? 0 : parseFloat(getComputedStyle(el).getPropertyValue("--reveal-delay")) || 0;
      const fade = reduce || el.dataset.reveal === "fade";
      el.animate(
        fade
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "translate3d(0, 28px, 0)" },
              { opacity: 1, transform: "none" },
            ],
        { duration: instant ? 0 : reduce ? 400 : 900, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    };
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter((el) => !revealed.has(el));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => reveal(el, true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    // Safety net: never leave content invisible (e.g. print, odd layouts).
    const fallback = window.setTimeout(() => els.forEach((el) => reveal(el, true)), 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [pathname]);

  // Specular highlight: light pools under the pointer on whichever glass
  // surface it's over. Precise pointers only; skipped when transparency or
  // motion is reduced. Writes two custom properties per frame, nothing else.
  useEffect(() => {
    const ok = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (prefers-reduced-transparency: no-preference)",
    );
    if (!ok.matches) return;
    let lit: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const unlight = () => {
      lit?.removeAttribute("data-glass-lit");
      lit = null;
    };
    const frame = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target.closest<HTMLElement>(".glass, .glass-strong") : null;
      if (target !== lit) {
        unlight();
        if (target) {
          lit = target;
          target.setAttribute("data-glass-lit", "");
        }
      }
      if (!lit) return;
      const r = lit.getBoundingClientRect();
      lit.style.setProperty("--gx", `${e.clientX - r.left}px`);
      lit.style.setProperty("--gy", `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = () => {
      last = null;
      unlight();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      unlight();
    };
  }, []);

  return null;
}
