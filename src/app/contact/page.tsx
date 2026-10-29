import type { Metadata } from "next";
import styles from "@/components/contact/Contact.module.css";
import { ContactForm } from "@/components/forms/ContactForm";
import homeStyles from "@/components/home/Home.module.css";
import { FaqList, PageHero, ProcessList, SectionHeader } from "@/components/sections/Sections";
import { Mail, Phone, Pin } from "@/components/ui/Icons";
import { phoneHref, site } from "@/content/site";
import { generalFaqs } from "@/content/studio";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact — Start a Website Project",
  description:
    "Tell Mithran Labs about the website you need — a new site, a landing page, an online store, a redesign or ongoing maintenance.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Start a project"
        title={
          <>
            Let&apos;s talk about <span className="swash">your website.</span>
          </>
        }
        lead="Tell us what the website needs to do, who it's for and when you need it. We'll reply with questions, a recommended approach and next steps."
      />

      <section className="section-tight" aria-label="Enquiry">
        <div className={`container ${styles.layout}`}>
          <div className={styles.formPanel}>
            <h2 className="h3" style={{ marginBottom: "1.5rem" }}>
              Project enquiry
            </h2>
            <ContactForm />
          </div>

          <aside className={styles.aside} aria-label="Contact details">
            <a href={`mailto:${site.email}`} className={styles.card}>
              <Mail aria-hidden="true" />
              <span>
                <span className="label">Email</span>
                <strong>{site.email}</strong>
              </span>
            </a>
            {site.phone && (
              <a href={phoneHref(site.phone)} className={styles.card}>
                <Phone aria-hidden="true" />
                <span>
                  <span className="label">Phone</span>
                  <strong>{site.phone}</strong>
                </span>
              </a>
            )}
            <div className={styles.card}>
              <Pin aria-hidden="true" />
              <span>
                <span className="label">Location</span>
                <strong>Based in {site.location}</strong>
                <span className={styles.small}>Projects run remotely over video calls, shared design files and a live staging link.</span>
              </span>
            </div>
            <div className={styles.hours}>
              <span className="label">Before you write</span>
              <p className={styles.small}>
                Useful to include: a link to your current website (if any), two or three sites you like, the pages or
                features you need, and any deadline.
              </p>
            </div>
            {site.socials.length > 0 && (
              <ul className={styles.socials} role="list" aria-label="Social profiles">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <SectionHeader eyebrow="What happens next" title={<span id="process-title">Our process</span>} align="stack" />
          <ProcessList />
        </div>
      </section>

      <section className="section-tight" aria-labelledby="faq-title">
        <div className={`container ${homeStyles.faqLayout}`}>
          <SectionHeader eyebrow="FAQ" title={<span id="faq-title">Good to know</span>} align="stack" />
          <FaqList faqs={generalFaqs} />
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
    </>
  );
}
