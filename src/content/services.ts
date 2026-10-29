/**
 * Services — website design and development only. Prices are intentionally
 * absent: every project is quoted after discovery. Don't add figures,
 * timelines or guarantees here that the studio hasn't committed to.
 */

import type { SketchKind } from "@/components/ui/SiteSketch";

export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  index: string;
  name: string;
  short: string;
  headline: string;
  intro: string[];
  disciplines: string[];
  forWho: string[];
  benefits: { title: string; body: string }[];
  deliverables: string[];
  projects: string[];
  faqs: Faq[];
  sketch: SketchKind;
};

export const services: Service[] = [
  {
    slug: "custom-website-design",
    index: "01",
    name: "Custom Website Design",
    short: "Original design for your business — not a theme with your logo dropped in.",
    headline: "A website that looks like you, not like a template.",
    intro: [
      "Custom design starts with what makes your business different and works outward: the structure of the pages, the order of the information, the typography, colour and imagery that carry it.",
      "Every key page is designed at phone and desktop sizes before any code is written, so you see and approve exactly what will be built.",
    ],
    disciplines: ["Wireframes", "Visual design", "Typography", "Design systems", "Responsive layouts", "Interaction design"],
    forWho: [
      "Businesses whose current site looks like every competitor's",
      "Brands that have an identity and need a website that does it justice",
      "Teams that want a design they can extend with new pages later",
    ],
    benefits: [
      { title: "Distinct, not generic", body: "Layout and detail decisions come from your content and audience, so the site doesn't read as one more theme." },
      { title: "Approved before it's built", body: "Structure and visuals are signed off as designs first, where a change costs minutes instead of a rebuild." },
      { title: "A system, not a set of pages", body: "Reusable components and spacing rules mean new pages look like they belong." },
    ],
    deliverables: [
      "Sitemap and wireframes for key pages",
      "Desktop and mobile designs for every page template",
      "A small design system: type, colour, spacing and components",
      "Interaction notes for hover, focus and loading states",
      "Design files handed over at the end",
    ],
    projects: ["mithran-labs-website"],
    faqs: [
      { q: "Is custom design more expensive than a template?", a: "Usually, yes — it takes more design time up front. In return you get a site built around your content and goals, rather than content squeezed into someone else's layout. The quote reflects the number of page templates, not just the number of pages." },
      { q: "Do I need brand guidelines first?", a: "No. If you have a logo and colours we'll design around them. If you don't, we'll set a simple typographic and colour direction for the website. We don't design logos or full brand identities." },
      { q: "How many revisions are included?", a: "Revision rounds are agreed in the written scope before design starts, so both sides know exactly how feedback will work." },
    ],
    sketch: "design",
  },
  {
    slug: "business-websites",
    index: "02",
    name: "Business & Corporate Websites",
    short: "Clear, credible multi-page websites that explain what you do and make it easy to get in touch.",
    headline: "The website your business is judged by.",
    intro: [
      "For most businesses the website is the first serious look a customer, partner or hire takes. It has to explain what you do in seconds, prove you're credible, and make the next step obvious.",
      "We plan the pages around the questions your visitors actually ask — services, proof, people, pricing approach, contact — and build them to load fast and rank well.",
    ],
    disciplines: ["Information architecture", "Service pages", "About and team pages", "Contact and enquiry forms", "Technical SEO", "CMS setup"],
    forWho: [
      "Service businesses, consultancies, manufacturers and professional firms",
      "Companies that have outgrown a site built years ago",
      "Teams that want to update their own content without calling a developer",
    ],
    benefits: [
      { title: "Clear in seconds", body: "Pages lead with what you do and who it's for, then back it up — so visitors don't have to dig." },
      { title: "Found in search", body: "Clean structure, page titles, descriptions, structured data and fast pages give search engines what they need." },
      { title: "Easy to keep current", body: "Where you need to edit content yourself, a content management system is set up and explained." },
    ],
    deliverables: [
      "Sitemap and content plan",
      "Designed and built pages for your services, company and contact",
      "Enquiry form connected to your email",
      "Technical SEO: titles, descriptions, sitemap, structured data",
      "Optional content management system with a walkthrough",
    ],
    projects: ["agency-website-redesign"],
    faqs: [
      { q: "Can I edit the website myself?", a: "Yes, if you want to. We can set up a content management system for the pages you update often, or keep the site code-managed if you'd rather we handle changes. We'll recommend one during planning." },
      { q: "Do you write the content?", a: "We can structure and edit content and write page copy as part of the scope, or work from content you supply. Either way, the content plan is settled before design so nothing is designed around placeholder text." },
      { q: "Is SEO included?", a: "Technical SEO is part of every build: fast pages, clean structure, metadata, a sitemap and structured data. Ongoing content marketing and link building are outside what we offer." },
    ],
    sketch: "business",
  },
  {
    slug: "landing-pages",
    index: "03",
    name: "Landing Pages & Conversion Websites",
    short: "Focused pages built around one action — a sign-up, a booking, an enquiry or a sale.",
    headline: "One page, one job, done well.",
    intro: [
      "A landing page exists to get one thing done. Every section either moves a visitor toward that action or gets cut: a clear offer, the proof that matters, answers to the objections people actually have, and a call to action that's never far away.",
      "We build them fast and light, so the page loads quickly from an ad click on a phone, and set up the tracking you need to see what's working.",
    ],
    disciplines: ["Offer and message structure", "Conversion copy editing", "Forms and booking", "Analytics events", "A/B-ready structure", "Fast loading"],
    forWho: [
      "Product launches, events and campaigns that need a dedicated page",
      "Businesses running paid ads that send traffic to a generic homepage",
      "Founders validating an idea before building the full product",
    ],
    benefits: [
      { title: "Built around the action", body: "Sections are ordered by the questions a visitor has before they act — not by what's easiest to design." },
      { title: "Fast from the first tap", body: "Minimal scripts and optimised images, because a slow page wastes the click you paid for." },
      { title: "Measurable", body: "Form submissions and key clicks are tracked, so decisions come from data rather than opinions." },
    ],
    deliverables: [
      "Page structure and message hierarchy",
      "Designed and built responsive landing page",
      "Form, booking or checkout integration",
      "Analytics and conversion event setup",
      "Variants for testing, where the scope includes them",
    ],
    projects: [],
    faqs: [
      { q: "Can a landing page connect to my CRM or email tool?", a: "Usually, yes. Most CRMs and email platforms accept form submissions through an official integration or a webhook. We'll confirm the specific tool during planning." },
      { q: "Do you run the ads as well?", a: "No. We build the page and set up tracking so your marketing team or agency can measure results. Running ad campaigns is outside what we offer." },
    ],
    sketch: "landing",
  },
  {
    slug: "portfolio-websites",
    index: "04",
    name: "Portfolio & Personal Websites",
    short: "A home for your work — for designers, photographers, consultants, writers and independents.",
    headline: "Let the work speak, and make it easy to hire you.",
    intro: [
      "A portfolio should get out of the way of the work while still having a point of view. We design around the kind of work you show — images, writing, case studies, video — and how people decide to hire you.",
      "The result is easy for you to update with new projects, quick to load even with large images, and clear about how to get in touch.",
    ],
    disciplines: ["Case study layouts", "Image and video galleries", "Personal branding on the web", "Blog or writing sections", "Booking and contact"],
    forWho: [
      "Designers, photographers, architects and other visual professionals",
      "Consultants, coaches and speakers who sell their expertise",
      "Anyone who has outgrown a social profile as their only presence",
    ],
    benefits: [
      { title: "Work first", body: "Layouts frame your projects without competing with them, at every screen size." },
      { title: "Heavy images, light pages", body: "Images are resized and served in modern formats, so a visual portfolio still loads quickly." },
      { title: "Yours to update", body: "Adding a new project is a simple task you can do yourself." },
    ],
    deliverables: [
      "Designed home, work, case study, about and contact pages",
      "Image optimisation pipeline",
      "Simple editing for new projects",
      "Contact or booking form",
      "Domain and hosting setup",
    ],
    projects: ["mithran-labs-website"],
    faqs: [
      { q: "I'm not a business. Is this still for me?", a: "Yes. Personal and portfolio websites are part of what we do, and the process is the same — just scaled to the project." },
      { q: "Can I add projects myself later?", a: "Yes. We set up the site so that adding a project means filling in a few fields and uploading images, with no code involved." },
    ],
    sketch: "portfolio",
  },
  {
    slug: "ecommerce-websites",
    index: "05",
    name: "E-commerce Website Development",
    short: "Online stores that are easy to browse, quick to check out and simple to run day to day.",
    headline: "A store people trust enough to buy from.",
    intro: [
      "An online store has to do two jobs at once: sell to customers, and be easy for your team to run. We design the browsing, product and checkout experience around how your customers shop, and set up the back end around how you fulfil orders.",
      "Depending on the catalogue and how much control you need, that may be a managed platform such as Shopify or WooCommerce, or a custom storefront. We'll recommend one after discovery, with the trade-offs explained.",
    ],
    disciplines: ["Store setup", "Product and category pages", "Checkout and payments", "Shipping and tax settings", "Product search and filters", "Store SEO"],
    forWho: [
      "Brands moving from marketplaces or social selling to their own store",
      "Retailers with a dated store that's hard to manage",
      "Businesses adding online sales alongside a physical shop",
    ],
    benefits: [
      { title: "Fewer abandoned carts", body: "Short checkouts, clear delivery and return information, and payment methods your customers already use." },
      { title: "Readable by search engines", body: "Product and category pages are structured so they can be indexed and found." },
      { title: "Simple to run", body: "Orders, stock and products are managed in one place, with a walkthrough for your team." },
    ],
    deliverables: [
      "Store design: home, category, product, cart and checkout",
      "Platform setup and configuration",
      "Payment gateway and shipping integration",
      "Product import from your existing catalogue",
      "Team walkthrough and documentation",
    ],
    projects: [],
    faqs: [
      { q: "Which e-commerce platform should I use?", a: "It depends on the size of your catalogue, the features you need and who will run the store. Managed platforms are usually quicker and cheaper to run; custom builds offer more control. We'll recommend one after discovery." },
      { q: "Can you move my products from my current store?", a: "Usually, yes — most platforms export products in a format we can import. We'll check your current setup during discovery." },
      { q: "Which payment gateways can you set up?", a: "We work with the gateway your business uses or chooses, provided the platform supports it. The merchant account stays in your name." },
    ],
    sketch: "store",
  },
  {
    slug: "website-redesign",
    index: "06",
    name: "Website Redesign & Modernisation",
    short: "Rebuild an outdated, slow or hard-to-manage website without losing what already works.",
    headline: "Keep what works. Fix the rest.",
    intro: [
      "A redesign shouldn't start from a blank page. We review the current site first — content, structure, speed, search visibility and how people actually use it — so the new version keeps what earns its place and fixes what doesn't.",
      "Old URLs are mapped and redirected, so existing links, bookmarks and search rankings carry over to the new site instead of breaking on launch day.",
    ],
    disciplines: ["Website audit", "Content migration", "URL mapping and redirects", "Modern rebuild", "Performance improvements", "Accessibility fixes"],
    forWho: [
      "Businesses whose website no longer reflects what they do",
      "Sites that are slow, hard to edit, or broken on phones",
      "Teams stuck on an old platform nobody wants to touch",
    ],
    benefits: [
      { title: "Nothing important lost", body: "Content and URLs are inventoried and migrated deliberately, with redirects for anything that moves." },
      { title: "Faster and lighter", body: "A modern build usually loads in a fraction of the time of an older, plugin-heavy site." },
      { title: "Fit for the next few years", body: "A clean foundation that's straightforward to extend, instead of another layer of patches." },
    ],
    deliverables: [
      "Audit of the current site",
      "New sitemap and design",
      "Content migration",
      "301 redirect map from old URLs",
      "Before-and-after speed comparison",
    ],
    projects: ["agency-website-redesign"],
    faqs: [
      { q: "Will a redesign hurt my search rankings?", a: "Not if it's handled carefully. We map every important old URL to its new home with permanent redirects, keep page titles and descriptions intentional, and check for broken links before launch." },
      { q: "Can you keep my existing content?", a: "Yes. We migrate the content that still serves you, and flag pages that are outdated or duplicated so you can decide what to keep." },
    ],
    sketch: "redesign",
  },
  {
    slug: "responsive-performance",
    index: "07",
    name: "Responsive Development & Performance",
    short: "Make a site fast, mobile-friendly and accessible — as part of a build, or as a standalone fix.",
    headline: "Fast on every screen, not just yours.",
    intro: [
      "Most visitors arrive on a phone, often on a patchy connection. Responsive development means the layout, type, images and interactions are built for that from the start, then scale up to tablets and large screens.",
      "Performance work makes pages load and respond quickly: lighter images, fewer scripts, better caching and modern build tooling. We measure before and after, so the improvement is visible rather than claimed.",
    ],
    disciplines: ["Responsive layouts", "Core Web Vitals", "Image optimisation", "Script and font loading", "Caching and hosting", "Accessibility checks"],
    forWho: [
      "Sites that look broken or cramped on phones",
      "Pages that feel slow, jump around while loading, or fail speed tests",
      "Teams that need accessibility issues fixed",
    ],
    benefits: [
      { title: "Measured, not guessed", body: "Speed and layout stability are tested before and after, using standard tools you can rerun yourself." },
      { title: "Works everywhere", body: "Tested on real phone, tablet and desktop sizes across current browsers." },
      { title: "Usable by more people", body: "Contrast, focus states, labels and keyboard access fixed where they fall short." },
    ],
    deliverables: [
      "Performance and responsiveness audit",
      "Prioritised list of fixes",
      "Implemented improvements",
      "Before-and-after measurements",
    ],
    projects: ["mithran-labs-website"],
    faqs: [
      { q: "Can you speed up a site you didn't build?", a: "Often, yes. We start with an audit to find what's slowing it down and whether it can be fixed in place or is better rebuilt. You get the findings either way." },
      { q: "What are Core Web Vitals?", a: "They're Google's measures of loading speed, responsiveness and visual stability. They affect how a page feels to visitors and are one of many signals in search rankings." },
    ],
    sketch: "performance",
  },
  {
    slug: "website-maintenance",
    index: "08",
    name: "Website Maintenance & Support",
    short: "Updates, backups, security, fixes and small changes — handled, so the site keeps working.",
    headline: "Launch is the start, not the finish.",
    intro: [
      "Websites need looking after: software updates, security patches, backups, broken links, expiring certificates and the small content changes that always come up.",
      "Maintenance is an ongoing monthly arrangement with an agreed scope, so you know what's covered and who to contact when something needs to change. It's available for sites we've built, and for existing sites after a review.",
    ],
    disciplines: ["Updates and patches", "Backups", "Uptime monitoring", "Security checks", "Content changes", "Technical support"],
    forWho: [
      "Businesses that don't have a developer on staff",
      "Sites running on platforms that need regular updates",
      "Teams that want small changes made without starting a new project each time",
    ],
    benefits: [
      { title: "Fewer surprises", body: "Updates and backups happen on a schedule, not after something breaks." },
      { title: "One point of contact", body: "You know exactly who to ask when something needs fixing or changing." },
      { title: "Clear scope", body: "What's covered each month is agreed in advance, and anything larger is quoted first." },
    ],
    deliverables: [
      "Scheduled updates and backups",
      "Uptime and security monitoring",
      "An agreed allowance of content changes",
      "Fixes for issues within the maintained scope",
    ],
    projects: [],
    faqs: [
      { q: "Can you maintain a site you didn't build?", a: "Yes, after a short review to understand how it's built and whether anything needs attention first." },
      { q: "Do I have to sign up for maintenance?", a: "No. Maintenance is optional. You receive the logins and files at launch, so you're free to run the site yourself or with someone else." },
    ],
    sketch: "maintenance",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
