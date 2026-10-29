import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SiteSketch } from "@/components/ui/SiteSketch";
import type { Project } from "@/content/projects";
import styles from "./Work.module.css";

/**
 * Editorial project tile. Imagery (or the wireframe sketch standing in for it)
 * stays unobscured: chips sit in the corner, title and summary sit below. Projects with a case study
 * link internally; showcase-only projects link to the live site.
 */
export function ProjectCard({
  project,
  sizes = "(min-width: 1000px) 50vw, 100vw",
  priority = false,
  headingLevel = "h3",
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const internal = Boolean(project.caseStudy);
  const href = internal ? `/work/${project.slug}` : project.liveUrl;
  const Heading = headingLevel;

  const body = (
    <>
      <div className={styles.media}>
        {project.cover ? (
          <Picture src={project.cover.src} alt={project.cover.alt} fill sizes={sizes} priority={priority} className={styles.img} />
        ) : (
          <span className={styles.sketchWrap}>
            <SiteSketch kind={project.sketch} />
          </span>
        )}
        <ul className={styles.chips} role="list" aria-label="Services">
          {project.services.slice(0, 3).map((s) => (
            <li key={s} className="glass">
              {s}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.meta}>
        <Heading className={styles.title}>
          {project.name}
          {project.year && <span className={styles.year}>{project.year}</span>}
        </Heading>
        <p className={styles.status}>{project.client}</p>
        <p className={styles.summary}>{project.summary}</p>
        {href && (
          <span className={styles.more}>
            {internal ? "View case study" : "Visit live site"}
            {internal ? <ArrowRight /> : <ArrowUpRight />}
          </span>
        )}
      </div>
    </>
  );

  const cls = `${styles.card} ${styles[`tile_${project.tile}`]}`;

  if (!href) return <article className={cls}>{body}</article>;
  if (internal)
    return (
      <article className={cls}>
        <Link href={href} className={styles.cardLink}>
          {body}
        </Link>
      </article>
    );
  return (
    <article className={cls}>
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
        {body}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </article>
  );
}
