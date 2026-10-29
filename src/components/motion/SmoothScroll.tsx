"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { attachLenis } from "./scrollBus";

gsap.registerPlugin(ScrollTrigger);

/**
 * Soft page edges.
 *
 * Lenis eases toward a target that every wheel tick pushes forward, and it
 * clamps that target to the page bounds. Mid-page, the tail of a flick (the
 * decaying wheel/trackpad momentum) keeps feeding the target, so the page
 * glides to a stop. At the top or bottom the clamp throws that tail away and
 * the page has to shed all its speed in whatever distance is left — the
 * abrupt stop at the ends.
 *
 * Fix: inside a braking zone of `zone` px before the edge we're heading for,
 * wheel input is progressively compressed. The last `zone` px of page take
 * `2 * zone` px of input, with the ratio falling linearly from 1 to 0, so
 * speed bleeds off continuously and reaches zero exactly at the edge — no
 * overshoot, no bounce. Outside the zone, and whenever scrolling away from an
 * edge, input passes through untouched.
 *
 * The zone scales with the current scroll speed (see virtualScroll below): a
 * fast flick gets a long runway to slow down on, while slow, deliberate
 * scrolling gets almost none and moves 1:1 right up to the edge — braking
 * that isn't needed would only feel like a sticky wall.
 *
 * Works on distances (`room` = page left before the edge), so it's stateless
 * and stays correct after keyboard, scrollbar or anchor scrolls.
 */
function softenTowardEdge(room: number, step: number, zone: number) {
  // Page distance → input distance still needed to reach the edge.
  const inputLeft = (r: number) => {
    if (r >= zone) return r + zone;
    const s = zone - r; // how far into the zone the target already is
    return 2 * zone - 2 * zone * (1 - Math.sqrt(1 - s / zone));
  };
  // …and back again.
  const roomFor = (u: number) => {
    if (u >= 2 * zone) return u - zone;
    const x = 2 * zone - u;
    return zone - (x - (x * x) / (4 * zone));
  };
  return roomFor(Math.max(0, inputLeft(room) - step));
}

/**
 * Inertial smooth scrolling for mouse wheels and trackpads (Lenis).
 *
 * - Scrolls the real window, so position: sticky pinning, anchors, find-in-page
 *   and keyboard scrolling all keep working.
 * - Touch devices keep their native momentum scrolling (no syncTouch).
 * - Honours prefers-reduced-motion (Lenis falls back to 1:1 scrolling).
 * - The mobile menu pauses it while open (see Nav.tsx).
 * - Elements marked data-lenis-prevent (dialogs, nested scrollers) scroll natively.
 *
 * One clock: Lenis is stepped from GSAP's ticker (not its own rAF loop) and
 * pushes every scroll straight to ScrollTrigger, so scroll-linked animations
 * are computed in the same frame the page moves — never a frame behind.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis: Lenis = new Lenis({
      autoRaf: false, // driven by gsap.ticker below
      lerp: 0.13, // responsive but silky; lower = floatier
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      anchors: { offset: -96 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // Soft edges for wheel/trackpad input (touch stays native).
      virtualScroll: (data) => {
        const d = data.deltaY;
        if (!d || !data.event.type.includes("wheel")) return true;
        const limit = lenis.limit;
        // Speed in px per 60fps frame, so 120Hz screens brake the same way.
        const speed = Math.abs(lenis.velocity) / Math.max(gsap.ticker.deltaRatio(60), 0.25);
        // ~2x the distance Lenis's own easing needs to stop from this speed.
        const zone = Math.min(speed * 15, window.innerHeight * 0.6, limit / 4);
        if (zone < 1) return true;
        const target = lenis.targetScroll;
        const room = d > 0 ? limit - target : target;
        data.deltaY = Math.sign(d) * (room - softenTowardEdge(room, Math.abs(d), zone));
        return true;
      },
    });
    lenisRef.current = lenis;
    attachLenis(lenis);
    document.documentElement.classList.add("has-smooth-scroll");

    const offScroll = lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Lag smoothing would pause the clock after a long frame and make the page
    // "catch up" with a jump; for scroll we want the true elapsed time.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      offScroll();
      attachLenis(null);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("has-smooth-scroll");
    };
  }, []);

  // New page: re-measure the scroll height (inertia is cut by stopInertiaOnNavigate).
  useEffect(() => {
    lenisRef.current?.resize();
  }, [pathname]);

  return null;
}
