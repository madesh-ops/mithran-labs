"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

type Tag = "h1" | "h2" | "p";

/**
 * Selection-safe lines. Display headings are set tighter than their glyphs
 * (line-height ≈ 0.98), so descenders hang below the line box — and when the
 * text is selected, the next line's highlight block paints over them (the "g"
 * in "designed" lost its tail). Splitting into plain, unmasked lines and
 * stacking earlier lines above later ones lets descenders draw over the block
 * below. Positions, line breaks and copy/paste are unchanged; `autoSplit`
 * keeps the lines right when the heading re-wraps. (`--line` comes from
 * propIndex; z-index lives in globals.css on .sel-line.)
 */
const layerLines = (el: HTMLElement) =>
  SplitText.create(el, { type: "lines", linesClass: "sel-line", tag: "span", propIndex: true, autoSplit: true });

/**
 * A text block that GSAP SplitText animates. It's its own client component so
 * the split runs in this element's effect — i.e. only after this element has
 * hydrated. (Splitting from a parent can run before a nested route segment
 * hydrates, and React then throws away the tree.)
 *
 *  - "hero":  lines rise out of a mask on load, after the intro if it plays
 *  - "lines": the same, when the block scrolls into view
 *  - "scrub": words ink in from faint to full, tied to scroll position
 *
 * With reduced motion nothing is split; the text is simply shown.
 */
export function Split({
  as: El = "h2",
  variant = "lines",
  children,
  ...rest
}: { as?: Tag; variant?: "hero" | "lines" | "scrub"; children: ReactNode } & ComponentPropsWithoutRef<"h2">) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      // Both conditions listed: matchMedia only runs the handler when one matches.
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        if (!ctx.conditions?.motion) {
          gsap.set(el, { autoAlpha: 1 });
          layerLines(el);
          return;
        }

        if (variant === "scrub") {
          SplitText.create(el, {
            type: "lines, words",
            wordsClass: "scrub-word",
            linesClass: "sel-line", // layered lines, as in layerLines()
            propIndex: true,
            tag: "span", // inline wrappers keep the heading valid and selection natural
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.18 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
                },
              ),
          });
          // A selection inherits each word's opacity, so selecting half-faded
          // words gave striped, faint highlights. While a selection touches this
          // block its words show at full strength (see globals.css); the scrub
          // takes over again once the selection clears. Selection itself is
          // untouched — this only reads it.
          const onSelection = () => {
            const s = document.getSelection();
            const touching = !!s && !s.isCollapsed && s.rangeCount > 0 && s.getRangeAt(0).intersectsNode(el);
            el.toggleAttribute("data-selecting", touching);
          };
          document.addEventListener("selectionchange", onSelection);
          return () => {
            document.removeEventListener("selectionchange", onSelection);
            el.removeAttribute("data-selecting");
          };
        }

        const hero = variant === "hero";
        // First visit: the intro overlay is up for ~1.2s; hold the hero until it lifts.
        const delay = hero && document.documentElement.dataset.intro === "play" ? 1.2 : hero ? 0.05 : 0;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          tag: "span",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: hero ? 1.1 : 0.95,
              ease: "expo.out",
              stagger: 0.08,
              delay,
              scrollTrigger: hero ? undefined : { trigger: el, start: "top 88%", once: true },
              // The masks are only needed for the reveal (left in place they
              // clip descenders and leave a gap in the selection), so once it
              // has played, restore the markup and re-split into plain,
              // selection-safe lines.
              onComplete: () => {
                self.revert();
                // Added to the context so it is reverted on unmount too.
                ctx.add(() => layerLines(el));
              },
            });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <El ref={ref} data-split={variant} {...rest}>
      {children}
    </El>
  );
}
