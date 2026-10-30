"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { SiteSketch } from "@/components/ui/SiteSketch";
import sk from "@/components/ui/SiteSketch.module.css";
import styles from "./HeroBuild.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The hero mockup as a live design session, on a gentle loop: a cursor types
 * the headline in, drags a selection box open for the image, clicks the
 * button to give it its fill, the cards drop in, and the page "publishes" —
 * with the phone following each step a beat later, like a responsive preview.
 *
 * - The server HTML is the finished mockup; the empty starting state is set
 *   in a layout effect (useGSAP), so there's no flash of the finished page.
 * - The overlay (cursor, caret, selection, toast) is decorative, coloured from
 *   theme tokens, and positioned in percentages of the frame, which scales
 *   uniformly (fixed aspect ratio, container units) — so one measurement holds
 *   at any width.
 * - Pauses while the hero is off-screen. Reduced motion: no timeline; the
 *   finished mockup stays still and the overlay is hidden (CSS).
 */
export function HeroBuild({
  desktopClass,
  phoneClass,
  phoneWrapClass,
}: {
  desktopClass: string;
  phoneClass: string;
  phoneWrapClass: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const stage = stageRef.current;
    const phone = phoneRef.current;
    const overlay = overlayRef.current;
    if (!stage || !phone || !overlay) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const $ = (root: Element, s: string) => root.querySelector<HTMLElement>(s)!;
      const [cursor, ripple, caret, sel, size, slot, progress, toast] = [
        "cursor", "ripple", "caret", "sel", "size", "slot", "progress", "toast",
      ].map((n) => $(overlay, `[data-o="${n}"]`));
      const $$ = (root: Element, s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
      const parts = (root: Element) => ({
        canvas: $(root, `.${sk.canvas}`),
        nav: $(root, `.${sk.nav}`),
        titles: $$(root, `.${sk.heroText} > .${sk.title}`),
        para: $(root, `.${sk.heroText} > .${sk.bar}:not(.${sk.title})`),
        img: $(root, `.${sk.heroImg}`),
        btn: $(root, `.${sk.btn}:not(.${sk.ghost})`),
        ghost: $(root, `.${sk.ghost}`),
        cards: $$(root, `.${sk.cards} > *`),
        icons: $$(root, `.${sk.cards} .${sk.icon}`),
      });
      const D = parts(stage);
      const P = parts(phone);

      // Geometry as percentages of the desktop stage.
      const S = stage.getBoundingClientRect();
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left - S.left) / S.width) * 100,
          y: ((r.top - S.top) / S.height) * 100,
          w: (r.width / S.width) * 100,
          h: (r.height / S.height) * 100,
        };
      };
      const pct = (n: number) => `${n}%`;
      const [t0, t1] = D.titles.map(box);
      const para = box(D.para);
      const img = box(D.img);
      const btn = box(D.btn);
      const url = box($(stage, `.${sk.url}`));
      // The size label reads like a real canvas (a 1280px-wide design).
      const imgW = Math.round((img.w / 100) * 1280);
      const imgH = Math.round((img.h / 100) * 1280 * (S.height / S.width));

      // The unbuilt page: frames and chrome only.
      const empty = (p: ReturnType<typeof parts>) => ({
        [`canvas`]: [p.canvas, { opacity: 1 }],
        nav: [p.nav, { opacity: 0, y: -4 }],
        lines: [[...p.titles, p.para], { scaleX: 0, transformOrigin: "0% 50%" }],
        img: [p.img, { opacity: 0, scale: 0.97 }],
        btn: [p.btn, { clipPath: "inset(0% 100% 0% 0% round 99px)" }],
        ghost: [p.ghost, { opacity: 0, scale: 0.9 }],
        cards: [p.cards, { opacity: 0, y: 10 }],
        icons: [p.icons, { scale: 0 }],
      });
      const applyEmpty = (tl: gsap.core.Timeline | null) => {
        for (const p of [D, P]) {
          for (const [target, vars] of Object.values(empty(p)) as [gsap.TweenTarget, gsap.TweenVars][]) {
            if (tl) tl.set(target, vars, 0);
            else gsap.set(target, vars);
          }
        }
        const pieces = [cursor, ripple, caret, sel, progress, toast];
        if (tl) {
          tl.set(pieces, { opacity: 0 }, 0);
          tl.set(slot, { opacity: 1 }, 0);
          tl.set(cursor, { left: "108%", top: "104%", scale: 1 }, 0);
        } else {
          gsap.set(pieces, { opacity: 0 });
          gsap.set(slot, { opacity: 1 });
        }
      };
      applyEmpty(null);
      // The empty state is now in place: lift the first-paint hold (CSS).
      stage.dataset.ready = "";
      phone.dataset.ready = "";
      gsap.set(slot, { left: pct(btn.x), top: pct(btn.y), width: pct(btn.w), height: pct(btn.h) });
      gsap.set(progress, { left: pct(url.x), top: pct(url.y + url.h - 0.5), width: pct(url.w), scaleX: 0 });

      const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.out" } });
      applyEmpty(tl);

      const click = (at: number, x: number, y: number) => {
        tl.to(cursor, { scale: 0.82, duration: 0.09, yoyo: true, repeat: 1, ease: "power1.inOut" }, at);
        tl.fromTo(
          ripple,
          { left: pct(x), top: pct(y), scale: 0.2, opacity: 0.7 },
          { scale: 1, opacity: 0, duration: 0.5, ease: "power2.out" },
          at,
        );
      };
      const type = (at: number, line: ReturnType<typeof box>, el: HTMLElement[], dur: number) => {
        const steps = Math.max(6, Math.round(line.w / 5));
        tl.to(el, { scaleX: 1, duration: dur, ease: `steps(${steps})` }, at);
        tl.set(caret, { left: pct(line.x), top: pct(line.y - line.h * 0.35), height: pct(line.h * 1.7), opacity: 1 }, at);
        tl.to(caret, { left: pct(line.x + line.w), duration: dur, ease: `steps(${steps})` }, at);
      };
      const lag = 0.25; // the phone follows each step a beat later

      // 1 · Nav in, cursor glides onto the headline.
      tl.to([D.nav], { opacity: 1, y: 0, duration: 0.5 }, 0.15);
      tl.to([P.nav], { opacity: 1, y: 0, duration: 0.5 }, 0.15 + lag);
      tl.to(cursor, { opacity: 1, duration: 0.3 }, 0.2);
      tl.to(cursor, { left: pct(t0.x - 1), top: pct(t0.y + t0.h * 0.6), duration: 0.75, ease: "power3.inOut" }, 0.2);
      click(0.95, t0.x - 1, t0.y + t0.h * 0.6);

      // 2 · Headline and paragraph type in, caret riding the line ends.
      type(1.05, t0, [D.titles[0]], 0.55);
      type(1.7, t1, [D.titles[1]], 0.42);
      type(2.2, para, [D.para], 0.4);
      tl.to(caret, { opacity: 0, duration: 0.15 }, 2.65);
      tl.to(P.titles, { scaleX: 1, duration: 0.5, stagger: 0.25, ease: "steps(8)" }, 1.05 + lag);
      tl.to(P.para, { scaleX: 1, duration: 0.4, ease: "steps(8)" }, 2.2 + lag);

      // 3 · Marquee-select the image area, then the image drops in.
      tl.to(cursor, { left: pct(img.x), top: pct(img.y), duration: 0.45, ease: "power3.inOut" }, 2.65);
      tl.set(sel, { left: pct(img.x), top: pct(img.y), width: 0, height: 0, opacity: 1 }, 3.12);
      const drag = { p: 0 };
      tl.fromTo(
        drag,
        { p: 0 },
        {
          p: 1,
          duration: 0.75,
          ease: "power2.inOut",
          onUpdate: () => {
            size.textContent = `${Math.round(imgW * drag.p)} × ${Math.round(imgH * drag.p)}`;
          },
        },
        3.12,
      );
      tl.to(sel, { width: pct(img.w), height: pct(img.h), duration: 0.75, ease: "power2.inOut" }, 3.12);
      tl.to(cursor, { left: pct(img.x + img.w), top: pct(img.y + img.h), duration: 0.75, ease: "power2.inOut" }, 3.12);
      tl.to(D.img, { opacity: 1, scale: 1, duration: 0.55 }, 3.9);
      tl.to(P.img, { opacity: 1, scale: 1, duration: 0.55 }, 3.9 + lag);
      tl.to(sel, { opacity: 0, duration: 0.3 }, 4.35);

      // 4 · Click the primary button: it fills, the ghost button draws in.
      tl.to(cursor, { left: pct(btn.x + btn.w * 0.55), top: pct(btn.y + btn.h * 0.6), duration: 0.5, ease: "power3.inOut" }, 4.2);
      click(4.75, btn.x + btn.w * 0.55, btn.y + btn.h * 0.6);
      tl.to(slot, { opacity: 0, duration: 0.25 }, 4.8);
      tl.to(D.btn, { clipPath: "inset(0% 0% 0% 0% round 99px)", duration: 0.5, ease: "power3.out" }, 4.8);
      tl.to(P.btn, { clipPath: "inset(0% 0% 0% 0% round 99px)", duration: 0.5, ease: "power3.out" }, 4.8 + lag);
      tl.to([D.ghost], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 4.95);
      tl.to([P.ghost], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 4.95 + lag);

      // 5 · Cards drop into place.
      tl.to(D.cards, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "back.out(1.6)" }, 5.25);
      tl.to(D.icons, { scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(2.2)" }, 5.45);
      tl.to(P.cards, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "back.out(1.6)" }, 5.25 + lag);
      tl.to(P.icons, { scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(2.2)" }, 5.45 + lag);
      tl.to(cursor, { left: "106%", top: "74%", opacity: 0, duration: 0.8, ease: "power2.in" }, 5.6);

      // 6 · Publish: progress across the address bar, then the toast.
      tl.to(progress, { opacity: 1, duration: 0.1 }, 6.2);
      tl.to(progress, { scaleX: 1, duration: 0.7, ease: "power1.inOut" }, 6.2);
      tl.to(progress, { opacity: 0, duration: 0.25 }, 6.95);
      tl.fromTo(toast, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.8)" }, 6.95);
      tl.to(toast, { opacity: 0, y: 6, duration: 0.4, ease: "power2.in" }, 9.0);

      // 7 · Hold, then fade back to the empty page and go again.
      tl.to([D.canvas, P.canvas], { opacity: 0, duration: 0.6, ease: "power1.in" }, 10.2);
      tl.set({}, {}, 11.2);

      // Play only while the hero is on screen, after the intro has settled.
      let started = false;
      let visible = false;
      const update = () => (started && visible ? tl.play() : tl.pause());
      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
          update();
        },
      });
      visible = st.isActive;
      const intro = document.documentElement.dataset.intro === "play";
      const kick = gsap.delayedCall(intro ? 1.3 : 0.35, () => {
        started = true;
        update();
      });

      return () => {
        delete stage.dataset.ready;
        delete phone.dataset.ready;
        kick.kill();
        st.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  });

  return (
    <>
      <div data-parallax="40">
        <div ref={stageRef} className={`${styles.stage} ${styles.hold}`}>
          <SiteSketch kind="business" className={desktopClass} label="yourbusiness.com" />
          <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
            <div data-o="slot" className={styles.slot} />
            <div data-o="progress" className={styles.progress} />
            <div data-o="sel" className={styles.sel}>
              <i />
              <i />
              <i />
              <i />
              <span data-o="size" />
            </div>
            <div data-o="caret" className={styles.caret} />
            <div data-o="ripple" className={styles.ripple} />
            <div data-o="cursor" className={styles.cursor}>
              <svg viewBox="0 0 16 20" aria-hidden="true">
                <path d="M1.5 1.5v15.2l4-3.7 2.6 5.6 2.6-1.2-2.6-5.5h5.4z" />
              </svg>
            </div>
            <div data-o="toast" className={styles.toast}>
              <span className={styles.check} />
              Published
            </div>
          </div>
        </div>
      </div>
      <div ref={phoneRef} className={`${phoneWrapClass} ${styles.hold}`} data-parallax="130">
        <SiteSketch kind="business" device="phone" className={phoneClass} />
      </div>
    </>
  );
}
