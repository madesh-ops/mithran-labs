# Mithran Labs website

The website for **Mithran Labs**, a website design and development studio. Built with Next.js (App Router), React and CSS Modules, with no UI framework and no paid services.

## Run it locally

```bash
npm install        # or: npm ci
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run qa -- <outDir> <baseUrl> <desktop\|tablet\|mobile\|all> <paths…>` | Headless screenshots plus a console-error and overflow report (uses your installed Chrome) |
| `node scripts/og-image.mjs` | Regenerates `public/og-default.png`, the social share image |
| `node scripts/mock-resend.mjs [port] [status]` | Local stand-in for the Resend API, for end-to-end form tests |

Requires Node 20+.

> If your shell exports `NODE_ENV=development` globally, `next build` fails during prerendering. Build with `env -u NODE_ENV npm run build` (bash) or clear the variable first.

## Environment variables

See [`.env.example`](.env.example). Every variable is optional for local development.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and JSON-LD. Defaults to `https://mithranlabs.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public enquiry address. **Falls back to `hello@mithranlabs.com`. Set a real inbox before launch.** |
| `NEXT_PUBLIC_CONTACT_PHONE` | Optional. Shown only when set |
| `NEXT_PUBLIC_STUDIO_LOCATION` | Where the studio is based, in plain words. Defaults to `India` |
| `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_GITHUB_URL` | Optional profile links. Hidden when empty |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com), for the contact form |
| `CONTACT_FROM_EMAIL` | Sender on a **Resend-verified domain**, e.g. `Mithran Labs Website <website@mithranlabs.com>` |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries |

No secrets are committed. `.env*` files are git-ignored except `.env.example`.

## Contact form

`/contact` posts JSON to `/api/contact`. The route:

- validates input on the server, using the same rules as the client
- drops bot submissions caught by a honeypot field
- rate-limits each IP (best-effort, per instance)
- delivers email through the Resend HTTP API, with reply-to set to the visitor

**The form never fakes success.** Until `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` are all set, the API returns `503 not_configured`. The page then says plainly that nothing was sent and offers a pre-filled `mailto:` link. If the email provider fails, the visitor sees an error and keeps what they typed.

## Structure

```
src/
  app/
    page.tsx                 Home
    services/, services/[slug]   Service index and 8 service pages
    work/, work/[slug]       Selected work and case studies
    about/                   Studio, focus, principles, process (#process), stack
    contact/, privacy/
    api/contact              Enquiry endpoint
  components/
    brand/Logo.tsx           Mark + wordmark (SVG)
    ui/SiteSketch.tsx        CSS-drawn website wireframes used in place of imagery
    sections/, home/, services/, work/, forms/, layout/, motion/
  content/
    site.ts                  Name, URL, contact details (env-driven), nav
    services.ts              The 8 services
    projects.ts              Portfolio entries
    studio.ts                Process, principles, general FAQs
  lib/                       SEO helpers, validation, mailer
```

## Design system

All tokens live in `src/app/globals.css`.

- **Colour:** warm paper `#F5F4F0`, near-black ink `#141413`, and one vermilion "signal" accent `#FF5B24`, used sparingly. Small accent text uses `#B8400F` on light backgrounds (AA contrast). Light and dark themes follow the system setting, with a remembered toggle.
- **Type:** Geist (display and body), Instrument Serif italic for accent phrases (`.swash`), Geist Mono for labels. All are self-hosted through `next/font`.
- **Material:** surfaces are solid. A light frosted material (`.glass`) is used only for floating controls such as the nav bar and pills.
- **Motion:** scroll reveals, page view transitions, a short first-visit intro and wireframe build-ins. All of it respects `prefers-reduced-motion`.
- **Imagery:** there is no stock or borrowed imagery. Illustrations are wireframes drawn in CSS (`SiteSketch`). To use real screenshots, add a `cover` to a project in `projects.ts` (an image in `public/` plus an entry in `src/content/image-manifest.json` giving its width and height).

## Content rules

- Don't add testimonials, client logos, statistics, awards or client names until they are real and you have permission to publish them.
- Portfolio entries must say what they were: client project, studio project or uncommissioned concept.
- Prices are deliberately absent. Every project is quoted after discovery.
