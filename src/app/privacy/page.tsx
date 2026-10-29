import type { Metadata } from "next";
import styles from "@/components/sections/Prose.module.css";
import { PageHero } from "@/components/sections/Sections";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What personal data the Mithran Labs website collects, why, who processes it, how long it is kept and your rights.",
  path: "/privacy",
});

/*
 * Describes what THIS site actually does: one enquiry form delivered by
 * email, no cookies, no analytics. Have it reviewed before launch, and update
 * it if analytics, a newsletter, chat or other processors are added.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" lead="Last updated 29 October 2026." />
      <section className="section-tight">
        <div className="container">
          <div className={styles.prose}>
            <h2>1. Who we are</h2>
            <p>
              This policy explains what personal data the {site.name} website (the &ldquo;Site&rdquo;) collects, why we hold it, who
              processes it on our behalf, how long we keep it and what you can ask us to do with it. Work we carry out for a client
              is governed by the agreement with that client, not by this page.
            </p>
            <p>
              For the purposes of India&apos;s Digital Personal Data Protection Act, 2023, {site.legalName} is the data fiduciary for
              the data described here. Where the UK or EU GDPR applies to a visitor, we act as the controller of that data.
            </p>

            <h2>2. Data we collect, and when</h2>
            <p>You don&apos;t need to give us personal data to browse the Site. We only receive what you type into the enquiry form:</p>
            <ul>
              <li>
                <strong>Project enquiry form</strong> (/contact): your name and email address, and optionally your company, phone
                number and budget range, along with the service you need and the message you write.
              </li>
            </ul>
            <p>
              Our hosting provider records standard server logs — IP address, browser user agent, requested URL and timestamp —
              because a web server cannot serve a page without them. These are used to keep the Site running and to investigate
              abuse.
            </p>
            <p>
              We do not take payments through the Site and do not ask for government identifiers, health, biometric or other
              special categories of data. Please don&apos;t include such details in a message.
            </p>

            <h2>3. Why we use it</h2>
            <ul>
              <li>To reply to your enquiry, discuss the project and prepare a quote.</li>
              <li>To keep the Site working and protect it from spam and abuse.</li>
            </ul>
            <p>We do not sell personal data, and we do not share it with third parties for their own marketing.</p>

            <h2>4. Who else processes your data</h2>
            <p>
              Form submissions are delivered to our inbox by an email delivery provider (Resend), acting only on our instructions.
              The Site is served by our hosting provider. We may also disclose data where the law requires it, or to establish or
              defend a legal claim. These providers may store or handle data outside India.
            </p>

            <h2 id="storage">5. Cookies and local storage</h2>
            <p>
              The Site does not set cookies and does not use analytics or advertising trackers. It stores two small preferences in
              your own browser, which never leave your device:
            </p>
            <ul>
              <li>
                <strong>ml-theme</strong> (local storage): whether you chose the light or dark theme.
              </li>
              <li>
                <strong>ml-intro</strong> (session storage): that you&apos;ve already seen the opening animation in this visit.
              </li>
            </ul>
            <p>Fonts are served from our own domain. Links to other websites take you to those services, whose own policies apply.</p>

            <h2>6. How long we keep it</h2>
            <ul>
              <li>Enquiries: for the life of the conversation and for 24 months afterwards, so we can pick up a project that resumes later.</li>
              <li>Server logs: retained by our host on its own rolling schedule.</li>
            </ul>
            <p>Records tied to a paid engagement are kept for as long as tax and accounting law requires.</p>

            <h2>7. Your rights</h2>
            <p>You can ask us to:</p>
            <ul>
              <li>tell you what data about you we hold, and why;</li>
              <li>correct anything inaccurate, incomplete or out of date;</li>
              <li>erase data we no longer need for the purpose it was given for;</li>
              <li>withdraw consent you have given;</li>
              <li>where the GDPR applies, send you a copy in a portable format, or restrict or object to processing.</li>
            </ul>

            <h2>8. Security</h2>
            <p>
              The Site is served over HTTPS, and access to enquiries is limited to the people at {site.name} who need it to reply.
              No transmission over the internet is perfectly secure, but we will tell you, and the relevant authority, if a breach
              affects your data.
            </p>

            <h2>9. Children</h2>
            <p>
              The Site is aimed at businesses and is not directed at children. We do not knowingly collect data from anyone under 18.
              If you believe a child has submitted data to us, tell us and we will delete it.
            </p>

            <h2>10. Changes and contact</h2>
            <p>
              We update this policy when what we do changes. For any question, or to exercise your rights, email{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
