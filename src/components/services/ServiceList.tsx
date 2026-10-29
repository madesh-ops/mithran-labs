import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { SiteSketch } from "@/components/ui/SiteSketch";
import { services } from "@/content/services";
import styles from "./ServiceList.module.css";

/**
 * Interactive service index. Every description is always visible (nothing
 * essential is hover-only); on hover-capable devices the row lifts into a
 * raised surface and a wireframe preview slides in.
 */
export function ServiceList({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ol className={styles.list} role="list">
      {services.map((s, i) => (
        <li key={s.slug} data-reveal style={{ "--reveal-delay": i * 50 } as React.CSSProperties}>
          <Link href={`/services/${s.slug}`} className={styles.row}>
            <span className={styles.index}>{s.index}</span>
            <span className={styles.main}>
              <H className={styles.name}>{s.name}</H>
              <span className={styles.short}>{s.short}</span>
              <span className={styles.tags} aria-hidden="true">
                {s.disciplines.slice(0, 4).map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
            <span className={styles.preview} aria-hidden="true">
              <SiteSketch kind={s.sketch} className={styles.previewImg} />
            </span>
            <span className={styles.go} aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
