import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand, PageHero, SectionHeader } from "@/components/sections/Sections";
import { GridList, PortfolioGrid } from "@/components/work/PortfolioGrid";
import styles from "@/components/work/WorkPage.module.css";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Work — Selected Website Projects",
  description:
    "Selected website design and development work by Mithran Labs, with each project labelled for what it was: studio project, concept or client work.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title={
          <>
            Work, <span className="swash">described honestly.</span>
          </>
        }
        lead="Mithran Labs is a new studio. Rather than borrow anyone else's portfolio, this page shows only work we designed and built ourselves, and says plainly what each project was."
      />

      <section className="section-tight" aria-label="Projects">
        <div className="container">
          <Suspense fallback={<GridList />}>
            <PortfolioGrid />
          </Suspense>
        </div>
      </section>

      <section className="section-tight" aria-labelledby="next-title">
        <div className="container">
          <div className={styles.openSlot} data-reveal>
            <SectionHeader
              eyebrow="Booking new projects"
              title={
                <span id="next-title">
                  The next case study <span className="swash">could be yours.</span>
                </span>
              }
              intro="Client projects are published here only with the client's permission. Tell us what you're planning, and we'll talk it through."
              align="stack"
            />
          </div>
        </div>
      </section>

      <CtaBand title={<>Have a website <span className="swash">in mind?</span></>} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
    </>
  );
}
