/**
 * Selected work. Only list projects Mithran Labs actually designed and built,
 * and say plainly what each one was (client project, studio project or
 * uncommissioned concept). Never present someone else's work, or a pitch, as
 * a delivered client project. Client names, screenshots and results need the
 * client's permission before they go here.
 */

import type { SketchKind } from "@/components/ui/SiteSketch";

export type WorkCategory = "client" | "studio" | "concept";

export const workCategories: { id: WorkCategory | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "client", label: "Client projects" },
  { id: "studio", label: "Studio projects" },
  { id: "concept", label: "Concepts" },
];

export type Img = { src: string; alt: string };

export type CaseSection =
  | { kind: "text"; eyebrow?: string; title: string; body: string[]; bullets?: string[] }
  | { kind: "sketch"; sketches: { kind: SketchKind; device?: "desktop" | "phone" }[] }
  | { kind: "images"; layout: "full" | "pair" | "trio"; images: Img[] };

export type Project = {
  slug: string;
  name: string;
  /** Who it was for, stated honestly — e.g. "In-house" or "Uncommissioned concept". */
  client: string;
  year?: string;
  categories: WorkCategory[];
  services: string[];
  summary: string;
  /** Real screenshot, once available. Until then the sketch is shown. */
  cover?: Img;
  sketch: SketchKind;
  tile: "wide" | "tall" | "square";
  liveUrl?: string;
  caseStudy?: {
    intro: string[];
    sections: CaseSection[];
  };
};

export const projects: Project[] = [
  {
    slug: "aura-the-label",
    name: "AURA",
    client: "Client project — AURA, men's shirts",
    year: "2026",
    categories: ["client"],
    services: ["Design", "Development", "Brand site"],
    summary:
      "A brand website for AURA, a men's shirt label where streetwear meets minimalism: an editorial home page, the first collection with checkout through Amazon, and a VIP waitlist for the next drop.",
    cover: {
      src: "/work/aura-the-label.webp",
      alt: "The AURA homepage: a large serif AURA wordmark on near-black, with the line “Presence, Defined.” and an Explore Collection button.",
    },
    sketch: "store",
    tile: "wide",
    liveUrl: "https://aurathelabel.vercel.app/",
  },
  {
    slug: "mithran-labs-website",
    name: "Mithran Labs website",
    client: "In-house",
    year: "2026",
    categories: ["studio"],
    services: ["Design", "Development", "Performance"],
    summary:
      "The site you're on: a fast, accessible studio website with light and dark themes, built on the same standards we apply to client work.",
    sketch: "studio",
    tile: "wide",
    caseStudy: {
      intro: [
        "Our own website had to do what we tell clients a website should do: explain the offer in seconds, load quickly on a phone, work for everyone, and make the next step obvious.",
        "It's built with Next.js and React, statically prerendered, and deliberately light on scripts, imagery and dependencies.",
      ],
      sections: [
        {
          kind: "text",
          eyebrow: "Structure",
          title: "Five pages, each with one job",
          body: [
            "Home introduces the studio and routes visitors to the right service. Each service has its own page answering who it's for, what's included and common questions. Work, About and Contact cover the rest.",
          ],
        },
        { kind: "sketch", sketches: [{ kind: "studio" }, { kind: "studio", device: "phone" }] },
        {
          kind: "text",
          eyebrow: "Details",
          title: "The parts most visitors never notice",
          body: ["The quality of a website is mostly in details that only show up when they're missing."],
          bullets: [
            "Light and dark themes that follow the visitor's system setting, with a remembered manual switch",
            "Motion that turns itself off when the visitor's system asks for reduced motion",
            "Keyboard navigation, visible focus states and labelled form fields throughout",
            "A contact form that validates in the browser and on the server, and says honestly when a message hasn't been sent",
            "Page titles, descriptions, social previews, a sitemap and structured data for every page",
            "Illustrations drawn in CSS instead of stock imagery, so pages stay light",
          ],
        },
      ],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const caseStudies = projects.filter((p) => p.caseStudy);
