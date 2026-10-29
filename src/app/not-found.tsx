import type { Metadata } from "next";
import styles from "@/components/sections/NotFound.module.css";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className={styles.wrap} aria-labelledby="nf-title">
      <div className="container">
        <p className="label">Error 404</p>
        <h1 id="nf-title" className={styles.code}>
          4<span className={`glass ${styles.zero}`} aria-hidden="true" />4
          <span className="sr-only">0 — page not found</span>
        </h1>
        <p className={styles.title}>This page doesn&apos;t exist.</p>
        <p className="lead">The link may be mistyped or out of date. One of these should get you where you were going:</p>
        <div className={styles.actions}>
          <Button href="/">Back to home</Button>
          <Button href="/services" variant="glass" icon="none">
            See services
          </Button>
          <Button href="/contact" variant="ghost">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
