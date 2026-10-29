"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { LogoFull, LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Cross, Menu } from "@/components/ui/Icons";
import { nav, phoneHref, site } from "@/content/site";
import { getLenis } from "@/components/motion/scrollBus";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Nav.module.css";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

/**
 * A link to the page you're already on is a no-op in Next (same URL, no
 * scroll), so the logo did nothing on the home page. Glide back to the top
 * instead. Modified clicks (new tab etc.) are left alone. `delay` lets the
 * mobile menu finish closing (it pauses scrolling while open) first.
 */
function toTopIfCurrent(e: React.MouseEvent, href: string, pathname: string, delay = 0) {
  if (href !== pathname || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  const go = () => {
    const lenis = getLenis();
    const distance = window.scrollY;
    if (!distance) return;
    if (lenis) {
      // Duration-based, not lerp: from deep in the page a lerp would start at
      // hundreds of px per frame. Longer trips take a little longer. Lenis
      // jumps instantly when reduced motion is on.
      lenis.scrollTo(0, {
        duration: Math.min(1.4, 0.6 + distance / 6000),
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }
  };
  if (delay) window.setTimeout(go, delay);
  else go();
}

export function Nav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number; visible: boolean }>({ x: 0, w: 0, visible: false });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Close the mobile menu on navigation (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const activeHref = nav.find((n) => isActive(pathname, n.href))?.href ?? null;
  const target = hovered ?? activeHref;

  // Slide the indicator to the hovered link, or back to the active one.
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const link = target ? list.querySelector<HTMLElement>(`[data-href="${target}"]`) : null;
    if (!link) {
      setIndicator((i) => ({ ...i, visible: false }));
      return;
    }
    setIndicator({ x: link.offsetLeft, w: link.offsetWidth, visible: true });
  }, [target]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    // Fonts swapping in change link widths.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <header className={styles.header} data-scrolled={scrolled || undefined}>
      {/* The view-transition-name lives on the bar, not the header: a named
          ancestor becomes a backdrop root and the bar's glass would only
          sample the empty header instead of the page behind it. */}
      <nav className={`glass ${styles.bar}`} aria-label="Main" style={{ viewTransitionName: "site-header" }}>
        <Link href="/" className={styles.brand} aria-label="Mithran Labs home" onClick={(e) => toTopIfCurrent(e, "/", pathname)}>
          <LogoMark className={styles.mark} />
          <LogoFull className={styles.wordmark} title="" />
        </Link>

        <div className={styles.linksWrap} onPointerLeave={() => setHovered(null)}>
          <span
            className={styles.indicator}
            aria-hidden="true"
            data-visible={indicator.visible || undefined}
            data-hover={hovered && hovered !== activeHref ? true : undefined}
            style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
          />
          <ul ref={listRef} className={styles.links} role="list">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-href={item.href}
                  className={styles.link}
                  data-active={active || undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={(e) => toTopIfCurrent(e, item.href, pathname)}
                  onPointerEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  onBlur={() => setHovered(null)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          </ul>
        </div>

        <div className={styles.actions}>
          <ThemeToggle />
          <Button href="/contact" size="sm" className={styles.cta} icon="none">
            Start a project
          </Button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.menuButton}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </header>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setClosing(false);
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      getLenis()?.stop();
    } else if (!open && dialog.open) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setClosing(true);
      const t = window.setTimeout(
        () => {
          dialog.close();
          setClosing(false);
          document.documentElement.style.overflow = "";
          getLenis()?.start();
        },
        reduce ? 0 : 260,
      );
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    },
    [],
  );

  return (
    <dialog
      ref={ref}
      id="mobile-menu"
      className={`glass-strong ${styles.sheet}`}
      data-closing={closing || undefined}
      aria-label="Menu"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.sheetInner}>
        <div className={styles.sheetTop}>
          <span className="label">Menu</span>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close menu" autoFocus>
            <Cross />
          </button>
        </div>
        <ul className={styles.sheetLinks} role="list">
          {[{ href: "/", label: "Home" }, ...nav, { href: "/contact", label: "Contact" }].map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
            return (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  data-active={active || undefined}
                  onClick={(e) => {
                    onClose();
                    // Wait for the sheet to close (it pauses scrolling while open).
                    toTopIfCurrent(e, item.href, pathname, 320);
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className={styles.sheetFooter}>
          <Button href="/contact" size="lg" className={styles.sheetCta}>
            Start a project
          </Button>
          <div className={styles.sheetMeta}>
            <a href={`mailto:${site.email}`} className="text-link">
              {site.email}
            </a>
            {site.phone && (
              <a href={phoneHref(site.phone)} className="text-link">
                {site.phone}
              </a>
            )}
          </div>
          <div className={styles.sheetTheme}>
            <span className="label">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </dialog>
  );
}
