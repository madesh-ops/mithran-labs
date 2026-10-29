import type { NextConfig } from "next";

/**
 * GitHub Pages build (set by .github/workflows/deploy-pages.yml):
 * GITHUB_PAGES=true exports the site as static files served from
 * https://<owner>.github.io/<repo>/, so it needs a basePath and drops the
 * features a static host can't provide (custom headers, image optimisation).
 * Every other build — local dev, `next build`, a Node host — is unchanged.
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? process.env.PAGES_BASE_PATH || "/mithran-labs" : "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Dev only: let phones on the local network (opened via this machine's LAN
  // IP, e.g. http://192.168.68.110:3000) use the dev server. Without this,
  // Next blocks its dev resources for any host other than localhost, and the
  // page on the phone runs half-broken. Each * matches one address segment.
  allowedDevOrigins: ["192.168.*.*"],
  // Off for the static export: every page is prerendered anyway, and with
  // Cache Components on, metadata routes (sitemap.xml, robots.txt) can't be
  // marked static, which `output: "export"` requires. The site uses no
  // Cache Components APIs, so nothing else changes.
  cacheComponents: !pages,
  partialPrefetching: !pages,
  poweredByHeader: false,
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2400],
    // Static hosting has no image optimiser.
    unoptimized: pages,
  },
  ...(pages
    ? {
        output: "export",
        basePath,
        // /about → /about/index.html, which GitHub Pages serves directly.
        trailingSlash: true,
      }
    : {
        // Static hosts can't set response headers; elsewhere, send them.
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
