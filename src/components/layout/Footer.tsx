import Link from "next/link";
import { LogoFull } from "@/components/brand/Logo";
import { ArrowUpRight } from "@/components/ui/Icons";
import { services } from "@/content/services";
import { phoneHref, site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  const year = 2026;
  return (
    <footer className={`ink-band ${styles.footer}`}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.intro}>
            <p className="label">Website design &amp; development</p>
            <p className={styles.big}>
              Have a website
              <br />
              <span className="swash">to build?</span>
            </p>
            <Link href="/contact" className={styles.bigLink}>
              Start a project <ArrowUpRight />
            </Link>
          </div>

          <nav className={styles.cols} aria-label="Footer">
            <div>
              <h2 className="label">Studio</h2>
              <ul role="list">
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/work">Work</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/about#process">Process</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="label">Services</h2>
              <ul role="list">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label">Contact</h2>
              <address className={styles.address}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                {site.phone && <a href={phoneHref(site.phone)}>{site.phone}</a>}
                <span>Based in {site.location}. Working with clients anywhere.</span>
              </address>
            </div>
          </nav>
        </div>

        <div data-logo-rise>
          <LogoFull className={styles.logo} title="" />
        </div>

        <div className={styles.bottom}>
          {site.socials.length > 0 && (
            <ul className={styles.socials} role="list">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="glass">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className={styles.legal}>
            © {year} {site.legalName}. All rights reserved. <Link href="/privacy">Privacy policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
