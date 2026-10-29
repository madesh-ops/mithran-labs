import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand } from "@/components/sections/Sections";
import { Button } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { SiteSketch } from "@/components/ui/SiteSketch";
import styles from "@/components/work/WorkPage.module.css";
import { caseStudies, getProject, type CaseSection } from "@/content/projects";
import { services } from "@/content/services";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

// Every valid slug is prerendered by generateStaticParams (unknown slugs 404), so there is no
// runtime param shell to stream; opt out of instant-navigation validation for this segment.
export const instant = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) return {};
  return pageMetadata({
    title: `${project.name} — Case Study`,
    description: project.summary,
    path: `/work/${project.slug}`,
    ...(project.cover ? { image: project.cover.src, imageAlt: project.cover.alt } : {}),
  });
}

function Section({ section }: { section: CaseSection }) {
  if (section.kind === "text") {
    return (
      <div className={styles.textBlock} data-reveal>
        <div>
          {section.eyebrow && <p className="label">{section.eyebrow}</p>}
          <h2 className="h3">{section.title}</h2>
        </div>
        <div className={styles.textBody}>
          {section.body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
          {section.bullets && (
            <ul className={styles.bullets} role="list">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
  if (section.kind === "sketch") {
    const twoUp = section.sketches.every((s) => s.device !== "phone");
    return (
      <div className={`${styles.sketchRow} ${twoUp ? styles.twoUp : ""}`} data-reveal>
        {section.sketches.map((s, i) => (
          <SiteSketch key={i} kind={s.kind} device={s.device} />
        ))}
      </div>
    );
  }
  return (
    <div className={`${styles.imgRow} ${styles[section.layout]}`}>
      {section.images.map((img, i) => (
        <figure key={img.src} data-reveal style={{ "--reveal-delay": i * 80 } as React.CSSProperties}>
          {section.layout === "full" ? (
            <Picture src={img.src} alt={img.alt} sizes="(min-width: 1440px) 1360px, 100vw" style={{ width: "100%", height: "auto" }} />
          ) : (
            <Picture
              src={img.src}
              alt={img.alt}
              fill
              sizes={section.layout === "pair" ? "(min-width: 760px) 50vw, 100vw" : "(min-width: 760px) 33vw, 100vw"}
              className={styles.fitImg}
            />
          )}
        </figure>
      ))}
    </div>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const cs = project.caseStudy;

  const idx = caseStudies.findIndex((p) => p.slug === project.slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];
  const relatedServices = services.filter((s) => s.projects.includes(project.slug)).slice(0, 3);

  return (
    <>
      <article>
        <header className={`container ${styles.caseHero}`}>
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/work", label: "Work" }, { label: project.name }]} />
          <div className={styles.caseHead}>
            <h1 className={styles.caseTitle} data-reveal>
              {project.name}
            </h1>
            <dl className={styles.facts} data-reveal style={{ "--reveal-delay": 120 } as React.CSSProperties}>
              <div>
                <dt className="label">Project type</dt>
                <dd>{project.client}</dd>
              </div>
              {project.year && (
                <div>
                  <dt className="label">Year</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              <div>
                <dt className="label">Services</dt>
                <dd>{project.services.join(", ")}</dd>
              </div>
              {project.liveUrl && (
                <div>
                  <dt className="label">Live site</dt>
                  <dd>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      {project.liveUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className={styles.caseCover} data-reveal="fade">
            {project.cover ? (
              <Picture src={project.cover.src} alt={project.cover.alt} fill priority sizes="100vw" className={styles.cover} />
            ) : (
              <SiteSketch kind={project.sketch} animate />
            )}
          </div>
        </header>

        <div className="container">
          <div className={styles.intro}>
            <p className="label">Overview</p>
            <div className={styles.introText}>
              {cs.intro.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>

          <div className={styles.blocks}>
            {cs.sections.map((s, i) => (
              <Section key={i} section={s} />
            ))}
          </div>



          {relatedServices.length > 0 && (
            <div className={styles.textBlock}>
              <p className="label">Related services</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {relatedServices.map((s) => (
                  <Button key={s.slug} href={`/services/${s.slug}`} variant="glass" size="sm">
                    {s.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {next.slug !== project.slug && (
            <Link href={`/work/${next.slug}`} className={styles.next} aria-label={`Next project: ${next.name}`}>
              <div className={styles.nextBody}>
                <span className="label">Next project</span>
                <span className={styles.nextTitle}>{next.name}</span>
                <span className="body-muted">{next.client} · {next.services.join(" · ")}</span>
              </div>
              <SiteSketch kind={next.sketch} className={styles.nextSketch} />
            </Link>
          )}
        </div>
      </article>

      <CtaBand title={<>Planning a website <span className="swash">of your own?</span></>} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: project.name, path: `/work/${project.slug}` },
        ])}
      />
    </>
  );
}
