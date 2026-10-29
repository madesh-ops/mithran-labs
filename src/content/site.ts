/**
 * Mithran Labs — studio facts shown across the site.
 *
 * Contact details are deliberately minimal. Set them with environment
 * variables (see .env.example) rather than hard-coding placeholders that
 * would quietly ship to production. Anything left empty is simply not shown.
 */
const env = (v: string | undefined) => v?.trim() || "";

export const site = {
  name: "Mithran Labs",
  legalName: "Mithran Labs",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://mithranlabs.com").replace(/\/$/, ""),
  tagline: "Website design and development studio.",
  description:
    "Mithran Labs is a website design and development studio. Custom websites, landing pages, e-commerce stores and redesigns — planned, designed, built and maintained in one place.",
  /** Public enquiry address, used by mailto links and the form's fallback. */
  email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "hello@mithranlabs.com",
  /** Optional. Shown only when set, e.g. "+91 98765 43210". */
  phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  /** Where the studio is based, in plain words — not a street address. */
  location: env(process.env.NEXT_PUBLIC_STUDIO_LOCATION) || "India",
  /** Optional profile links. Add real ones only; empty entries are dropped. */
  socials: [
    { label: "LinkedIn", href: env(process.env.NEXT_PUBLIC_LINKEDIN_URL) },
    { label: "Instagram", href: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
    { label: "GitHub", href: env(process.env.NEXT_PUBLIC_GITHUB_URL) },
  ].filter((s) => s.href),
};

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
] as const;
