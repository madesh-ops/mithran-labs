import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import styles from "@/components/home/Home.module.css";
import { CtaBand, FaqList, PrinciplesList, ProcessList, SectionHeader } from "@/components/sections/Sections";
import { ServiceList } from "@/components/services/ServiceList";
import { Split } from "@/components/motion/Split";
import { Button } from "@/components/ui/Button";
import { GridList } from "@/components/work/PortfolioGrid";
import { projects } from "@/content/projects";
import { generalFaqs } from "@/content/studio";
import { faqJsonLd, JsonLd } from "@/lib/seo";

const pillars = [
  {
    title: "Design",
    line: "Structure first, then a visual design that's yours — approved before anything is built.",
    links: [
      { href: "/services/custom-website-design", label: "Custom website design" },
      { href: "/services/website-redesign", label: "Redesign & modernisation" },
    ],
  },
  {
    title: "Build",
    line: "Fast, responsive, accessible websites, from one landing page to a full online store.",
    links: [
      { href: "/services/business-websites", label: "Business websites" },
      { href: "/services/landing-pages", label: "Landing pages" },
      { href: "/services/ecommerce-websites", label: "E-commerce" },
    ],
  },
  {
    title: "Care",
    line: "Speed, updates, backups and fixes after launch, so the site keeps working.",
    links: [
      { href: "/services/responsive-performance", label: "Performance" },
      { href: "/services/website-maintenance", label: "Maintenance & support" },
    ],
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* — What we do — */}
      <section className="section" aria-labelledby="approach-title">
        <div className="container">
          <div className={styles.statement}>
            <p className="label" data-reveal>
              What we do
            </p>
            <Split as="h2" variant="scrub" id="approach-title" className={styles.statementText}>
              One discipline, done properly. <span className={styles.muted}>We only make websites — so all of the time goes
              into the design, the code and the small details that decide whether a site is </span>
              <span className="swash">fast, clear and easy to run.</span>
            </Split>
          </div>

          <div className={styles.pillars}>
            {pillars.map((p, i) => (
              <div key={p.title} className={styles.pillar} data-reveal style={{ "--reveal-delay": i * 90 } as React.CSSProperties}>
                <span className={styles.pillarIndex}>0{i + 1}</span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarLine}>{p.line}</p>
                <ul role="list" className={styles.pillarLinks}>
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-link">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — Services — */}
      <section className="section-tight" aria-labelledby="services-title">
        <div className="container">
          <SectionHeader
            eyebrow="Services"
            title={<span id="services-title">Everything a website needs, nothing it doesn&apos;t</span>}
            intro="Eight services, all about websites. Start with the one you need now."
            action={
              <Button href="/services" variant="ghost" icon="arrow">
                All services
              </Button>
            }
          />
          <ServiceList />
        </div>
      </section>

      {/* — Selected work — */}
      <section className={`ink-band section ${styles.workBand}`} aria-labelledby="work-title" data-band-grow>
        <div className="container">
          <SectionHeader
            eyebrow="Selected work"
            title={<span id="work-title">Work, described honestly</span>}
            intro="Every project here says what it was — studio project, concept or client work — and nothing more."
            action={
              <Button href="/work" variant="glass" icon="arrow">
                See all work
              </Button>
            }
          />
          <GridList items={projects} />
        </div>
      </section>

      {/* — Process — */}
      <section className="section" aria-labelledby="process-title" id="process">
        <div className="container">
          <SectionHeader
            eyebrow="Process"
            title={<span id="process-title">From first call to launch day</span>}
            intro="Six steps, each with something concrete you can see and approve before the next one starts."
            action={
              <Button href="/about#process" variant="ghost">
                More on how we work
              </Button>
            }
          />
          <ProcessList />
        </div>
      </section>

      {/* — Principles — */}
      <section className="section-tight" aria-labelledby="principles-title">
        <div className="container">
          <SectionHeader eyebrow="What you can expect" title={<span id="principles-title">How we work</span>} align="stack" />
          <PrinciplesList />
        </div>
      </section>

      {/* — FAQ — */}
      <section className="section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqLayout}`}>
          <SectionHeader
            eyebrow="FAQ"
            title={<span id="faq-title">Questions people ask first</span>}
            intro="Pricing, timelines and what happens after launch."
            align="stack"
            action={
              <Button href="/contact" variant="ink" size="md">
                Ask us something else
              </Button>
            }
          />
          <FaqList faqs={generalFaqs} />
        </div>
        <JsonLd data={faqJsonLd(generalFaqs)} />
      </section>

      <CtaBand />
    </>
  );
}
