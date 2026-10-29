import type { Metadata } from "next";
import { CtaBand, FaqList, PageHero, ProcessList, SectionHeader } from "@/components/sections/Sections";
import { ServiceList } from "@/components/services/ServiceList";
import styles from "@/components/home/Home.module.css";
import { generalFaqs } from "@/content/studio";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services — Website Design & Development",
  description:
    "Custom website design, business websites, landing pages, portfolio sites, e-commerce, redesigns, performance optimisation and website maintenance from Mithran Labs.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Websites, <span className="swash">start to finish.</span>
          </>
        }
        lead="Eight services, all about websites — from designing a new one to keeping an existing one fast, secure and up to date."
      />

      <section className="section-tight" aria-label="All services">
        <div className="container">
          <ServiceList headingLevel="h2" />
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <SectionHeader
            eyebrow="How every project runs"
            title={<span id="process-title">Six steps, no surprises</span>}
            intro="Scope, schedule and price are agreed in writing before work starts, and you review at every stage rather than once at the end."
          />
          <ProcessList />
        </div>
      </section>

      <section className="section-tight" aria-labelledby="faq-title">
        <div className={`container ${styles.faqLayout}`}>
          <SectionHeader eyebrow="FAQ" title={<span id="faq-title">Before you ask</span>} align="stack" />
          <FaqList faqs={generalFaqs} />
        </div>
      </section>

      <CtaBand />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
    </>
  );
}
