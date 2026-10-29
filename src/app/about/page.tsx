import type { Metadata } from "next";
import styles from "@/components/about/About.module.css";
import { CtaBand, PageHero, PrinciplesList, ProcessList, SectionHeader } from "@/components/sections/Sections";
import { Check, Cross } from "@/components/ui/Icons";
import { site } from "@/content/site";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About — An Independent Website Studio",
  description:
    "Mithran Labs is an independent studio that designs and builds websites, and nothing else. Our approach, our process and what you can expect from working with us.",
  path: "/about",
});

const weDo = [
  "Custom website design",
  "Business, landing page, portfolio and e-commerce websites",
  "Redesigns and migrations from older sites",
  "Performance, responsiveness and accessibility work",
  "Hosting setup, maintenance and technical support",
];

const weDont = [
  "Logos and full brand identities",
  "Social media management or content calendars",
  "Paid advertising campaigns",
  "Mobile apps or general software development",
];

const stack = [
  { title: "Design", body: "Figma for wireframes, page designs and the components developers build from." },
  { title: "Custom builds", body: "Next.js and React for fast, prerendered websites with full control over design and performance." },
  {
    title: "Managed platforms",
    body: "Shopify or WordPress when a client's team needs to run a store or edit content day to day without a developer.",
  },
  { title: "Hosting", body: "Modern managed hosting with HTTPS, a global CDN and automatic deploys — chosen per project." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`About ${site.name}`}
        title={
          <>
            A small studio for <span className="swash">websites only.</span>
          </>
        }
        lead="We design and build websites — and nothing else. That focus is the whole idea."
      />

      <section className="section-tight" aria-labelledby="story-title">
        <div className="container">
          <div className={styles.story}>
            <h2 id="story-title" className="h2" data-reveal>
              Why a website studio?
            </h2>
            <div className={styles.storyText} data-reveal style={{ "--reveal-delay": 100 } as React.CSSProperties}>
              <p>
                Most businesses don&apos;t need a full-service agency. They need a website that explains what they do, works
                on every phone, loads quickly, and is easy to keep up to date.
              </p>
              <p>
                {site.name} exists to do that one job well. Because we don&apos;t sell logos, ads or social media
                packages, all of the attention goes into the website itself: the structure, the design, the code and the
                details that only get noticed when they&apos;re missing.
              </p>
              <p>
                We work with businesses, founders and independents, in India and elsewhere. Projects run over calls,
                shared design files and a live staging link, so you can see the website taking shape at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="focus-title">
        <div className="container">
          <SectionHeader
            eyebrow="Focus"
            title={<span id="focus-title">What we do, and what we don&apos;t</span>}
            intro="Saying no to everything else is how we keep the websites good."
          />
          <div className={styles.focus}>
            <div className={`${styles.focusCol} ${styles.focusYes}`} data-reveal>
              <h3 className="h3">We do</h3>
              <ul role="list">
                {weDo.map((f) => (
                  <li key={f}>
                    <Check aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${styles.focusCol} ${styles.focusNo}`} data-reveal style={{ "--reveal-delay": 100 } as React.CSSProperties}>
              <h3 className="h3">We don&apos;t</h3>
              <ul role="list">
                {weDont.map((f) => (
                  <li key={f}>
                    <Cross aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="principles-title">
        <div className="container">
          <SectionHeader eyebrow="Approach" title={<span id="principles-title">How we work</span>} align="stack" />
          <PrinciplesList />
        </div>
      </section>

      <section className="section" aria-labelledby="process-title" id="process">
        <div className="container">
          <SectionHeader
            eyebrow="Process"
            title={<span id="process-title">Discovery to launch, in six steps</span>}
            intro="Each step ends with something you can see and approve before the next one begins."
          />
          <ProcessList />
        </div>
      </section>

      <section className="section-tight" aria-labelledby="stack-title">
        <div className="container">
          <SectionHeader
            eyebrow="Tools"
            title={<span id="stack-title">The stack follows the project</span>}
            intro="We recommend a platform after discovery, based on who will run the site and what it needs to do — not out of habit."
            align="stack"
          />
          <ul className={styles.stack} role="list">
            {stack.map((s) => (
              <li key={s.title} data-reveal>
                <strong>{s.title}</strong>
                <span>{s.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
    </>
  );
}
