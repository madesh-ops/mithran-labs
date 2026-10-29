import Link from "next/link";
import type { ReactNode } from "react";
import { Split } from "@/components/motion/Split";
import { Button } from "@/components/ui/Button";
import { Plus } from "@/components/ui/Icons";
import homeStyles from "@/components/home/Home.module.css";
import type { Faq } from "@/content/services";
import { principles, process } from "@/content/studio";
import styles from "./Sections.module.css";

export function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
  align = "split",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  align?: "split" | "stack";
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${styles.header} ${align === "stack" ? styles.stack : ""}`}>
      <div className={styles.headerMain}>
        {eyebrow && (
          <p className="label" data-reveal>
            {eyebrow}
          </p>
        )}
        <Split as={Tag} className={Tag === "h1" ? "h1" : "h2"}>
          {title}
        </Split>
      </div>
      {(intro || action) && (
        <div className={styles.headerAside} data-reveal style={{ "--reveal-delay": 140 } as React.CSSProperties}>
          {intro && <div className="lead">{intro}</div>}
          {action}
        </div>
      )}
    </div>
  );
}

/** Top-of-page hero for inner pages. Clears the floating nav. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={styles.pageHero}>
      <div className="container">
        <p className="label" data-reveal>
          {eyebrow}
        </p>
        <Split as="h1" className={`h1 ${styles.pageTitle}`}>
          {title}
        </Split>
        {lead && (
          <p className="lead" data-reveal style={{ "--reveal-delay": 140 } as React.CSSProperties}>
            {lead}
          </p>
        )}
        {children && (
          <div className={styles.pageHeroExtra} data-reveal style={{ "--reveal-delay": 200 } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function CtaBand({
  title = (
    <>
      Let&apos;s build a website <span className="swash">that works</span>
    </>
  ),
  body = "Tell us what the website needs to do. We'll come back with questions, a recommended approach and a clear next step.",
  primary = { href: "/contact", label: "Start a project" },
  secondary = { href: "/services", label: "See services" },
}: {
  title?: ReactNode;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <section className="section-tight" aria-labelledby="cta-title">
      <div className="container">
        <div className={`ink-band ${styles.cta}`} data-reveal>
          <h2 id="cta-title" className="h2">
            {title}
          </h2>
          <div className={styles.ctaSide}>
            <p className="lead">{body}</p>
            <div className={styles.ctaActions}>
              <Button href={primary.href} size="lg">
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} variant="glass" size="lg" icon="none">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Accessible accordion built on <details>/<summary> — works without JS. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className={styles.faqs}>
      {faqs.map((f, i) => (
        <details key={f.q} className={styles.faq} data-reveal style={{ "--reveal-delay": i * 40 } as React.CSSProperties}>
          <summary>
            <span className={styles.faqIndex} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={styles.faqQ}>{f.q}</span>
            <span className={styles.faqIcon} aria-hidden="true">
              <Plus />
            </span>
          </summary>
          <div className={styles.faqA}>
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** The six-step project process, shared by Home, About and Contact. */
export function ProcessList() {
  return (
    <ol className={homeStyles.process} role="list">
      {process.map((p, i) => (
        <li key={p.step} className={homeStyles.processStep} data-reveal style={{ "--reveal-delay": (i % 3) * 70 } as React.CSSProperties}>
          <span className={homeStyles.processNum}>{p.step}</span>
          <h3 className="h3">{p.title}</h3>
          <p className="body-muted">{p.body}</p>
          <p className={homeStyles.processOutput}>{p.output}</p>
        </li>
      ))}
    </ol>
  );
}

export function PrinciplesList() {
  return (
    <ul className={homeStyles.principles} role="list">
      {principles.map((p, i) => (
        <li key={p.title} className={homeStyles.principle} data-reveal style={{ "--reveal-delay": (i % 3) * 70 } as React.CSSProperties}>
          <h3>{p.title}</h3>
          <p className="body-muted">{p.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
      <ol role="list">
        {items.map((item, i) => (
          <li key={item.label}>
            {item.href && i < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
