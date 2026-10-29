"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Lenis already smooths the scroll itself, so scroll-linked tweens use
   scrub: true (lock to scroll). A numeric scrub would add a second layer of
   easing and make elements trail and swim behind the page. */

/**
 * GSAP scroll choreography, mounted in app/template.tsx so it is rebuilt (and
 * reverted) on every route. Opt-in through data attributes so pages stay
 * server components. It only writes inline transforms — never markup — so it
 * is safe to run alongside hydration. (Text splitting lives in <Split>.)
 *
 *   [data-parallax="n"]   drifts n px upward across its section (depth)
 *   [data-band-grow]      a dark band settles from slightly inset to full size
 *   [data-logo-rise]      the footer wordmark's bars rise as the footer arrives
 *
 * Transform/opacity only; nothing runs with reduced motion.
 */
export function Choreography() {
  useGSAP(() => {
    const q = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel));
    const mm = gsap.matchMedia();

    // Created top to bottom so ScrollTrigger refreshes in page order.
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 1000px)" }, (ctx) => {
      const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
      if (!motion) return;

      // Hero depth: the desktop frame and phone drift at different speeds.
      if (wide) {
        q("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            y: -Number(el.dataset.parallax || 60),
            ease: "none",
            scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true },
          });
        });
      }

      // Dark bands settle into place as they arrive.
      q("[data-band-grow]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.95 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true } },
        );
      });

      // Footer wordmark: the logo's bars rise as the footer comes up.
      q("[data-logo-rise]").forEach((el) => {
        gsap.from(el.querySelectorAll("rect, text"), {
          yPercent: 60,
          opacity: 0,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true },
        });
      });
    });

    // (Lenis ↔ ScrollTrigger sync lives in SmoothScroll, which owns Lenis.)
    // Fonts and late-hydrating segments move things after first layout.
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => mm.revert();
  });

  return null;
}
