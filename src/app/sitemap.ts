import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${site.url}${path}`;
  const staticPages = ["", "/services", "/work", "/about", "/contact", "/privacy"].map((p) => ({
    url: u(p || "/"),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : p === "/privacy" ? 0.3 : 0.8,
  }));
  return [
    ...staticPages,
    ...services.map((s) => ({ url: u(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...caseStudies.map((p) => ({ url: u(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
