import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand, FaqList, SectionHeader } from "@/components/sections/Sections";
import styles from "@/components/services/ServicePage.module.css";
import homeStyles from "@/components/home/Home.module.css";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";
import { SiteSketch } from "@/components/ui/SiteSketch";
import { GridList } from "@/components/work/PortfolioGrid";
import { getProject, type Project } from "@/content/projects";
import { getService, services } from "@/content/services";
import { site } from "@/content/site";
import { absolute, breadcrumbJsonLd, faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

// Every valid slug is prerendered by generateStaticParams (unknown slugs 404), so there is no
// runtime param shell to stream; opt out of instant-navigation validation for this segment.
export const instant = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.name,
    description: `${service.short} ${service.headline}`,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const projects = service.projects.map(getProject).filter(Boolean) as Project[];
  const idx = services.findIndex((s) => s.slug === service.slug);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <header className={`container ${styles.hero}`}>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/services", label: "Services" }, { label: service.name }]} />
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <p className="label" data-reveal>
              Service {service.index}
            </p>
            <h1 className={`h1 ${styles.title}`} data-reveal style={{ "--reveal-delay": 60 } as React.CSSProperties}>
              {service.name}
            </h1>
            <p className={styles.headline} data-reveal style={{ "--reveal-delay": 120 } as React.CSSProperties}>
              {service.headline}
            </p>
            <div className={styles.heroActions} data-reveal style={{ "--reveal-delay": 180 } as React.CSSProperties}>
              <Button href={`/contact?service=${service.slug}`} size="lg">
                Enquire about this service
              </Button>
            </div>
          </div>
          <div className={styles.heroMedia} data-reveal="fade">
            <SiteSketch kind={service.sketch} animate className={styles.sketch} />
            <ul className={styles.disciplines} role="list" aria-label="Disciplines">
              {service.disciplines.slice(0, 4).map((d) => (
                <li key={d} className="glass">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="includes-title">
        <div className={`container ${styles.split}`}>
          <div>
            <p className="label">What it includes</p>
            <h2 id="includes-title" className="h3" style={{ marginTop: "1rem" }}>
              The service, in short
            </h2>
          </div>
          <div className={styles.prose}>
            {service.intro.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
            <ul className={styles.tagList} role="list">
              {service.disciplines.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="who-title">
        <div className="container">
          <div className={styles.twoUp}>
            <div className={styles.panel} data-reveal>
              <p className="label">Who it&apos;s for</p>
              <h2 id="who-title" className="h3">
                Built for
              </h2>
              <ul role="list" className={styles.checks}>
                {service.forWho.map((w) => (
                  <li key={w}>
                    <Check aria-hidden="true" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.panel} ${styles.panelInk} ink-band`} data-reveal style={{ "--reveal-delay": 100 } as React.CSSProperties}>
              <p className="label">Typical deliverables</p>
              <h2 className="h3">What you receive</h2>
              <ul role="list" className={styles.checks}>
                {service.deliverables.map((d) => (
                  <li key={d}>
                    <Check aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="benefits-title">
        <div className="container">
          <SectionHeader eyebrow="Why it matters" title={<span id="benefits-title">What you get out of it</span>} align="stack" />
          <div className={styles.benefits}>
            {service.benefits.map((b, i) => (
              <div key={b.title} className={styles.benefit} data-reveal style={{ "--reveal-delay": i * 90 } as React.CSSProperties}>
                <span className={styles.benefitNum}>0{i + 1}</span>
                <h3 className="h3">{b.title}</h3>
                <p className="body-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section-tight" aria-labelledby="examples-title">
          <div className="container">
            <SectionHeader
              eyebrow="Our work"
              title={<span id="examples-title">Related work</span>}
              action={
                <Button href="/work" variant="ghost">
                  All work
                </Button>
              }
            />
            <GridList items={projects.slice(0, 4)} />
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="faq-title">
        <div className={`container ${homeStyles.faqLayout}`}>
          <SectionHeader
            eyebrow="Common questions"
            title={<span id="faq-title">{service.name} questions, answered</span>}
            align="stack"
            action={
              <Button href={`/contact?service=${service.slug}`} variant="ink">
                Get a quote
              </Button>
            }
          />
          <FaqList faqs={service.faqs} />
        </div>
      </section>

      <section className="section-tight" aria-label="Next service">
        <div className="container">
          <Link href={`/services/${next.slug}`} className={styles.nextService}>
            <span className="label">Next service · {next.index}</span>
            <span className={styles.nextName}>{next.name}</span>
            <ArrowRight className={styles.nextArrow} />
          </Link>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Ready when <span className="swash">you are</span>
          </>
        }
        primary={{ href: `/contact?service=${service.slug}`, label: "Start a project" }}
        secondary={{ href: `mailto:${site.email}`, label: site.email }}
      />

      <JsonLd data={faqJsonLd(service.faqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.short,
          url: absolute(`/services/${service.slug}`),
          provider: { "@id": `${site.url}/#organization` },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
    </>
  );
}
