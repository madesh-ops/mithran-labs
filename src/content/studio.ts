/**
 * How Mithran Labs works. These are commitments about process, not claims
 * about past results — keep it that way. No client names, figures or
 * testimonials belong here until they are real and permission is given.
 */

export type Step = { step: string; title: string; body: string; output: string };

export const process: Step[] = [
  {
    step: "01",
    title: "Discovery",
    body: "A conversation about the business, the audience and what the website has to achieve. We look at what exists today and what is getting in the way.",
    output: "Goals, audience and constraints written down",
  },
  {
    step: "02",
    title: "Planning",
    body: "Pages, content, features and integrations are mapped into a sitemap and a written scope, with a timeline and a fixed quote you agree to before work starts.",
    output: "Sitemap, scope, schedule and quote",
  },
  {
    step: "03",
    title: "Design",
    body: "Wireframes settle structure first, while changes are cheap. Then the visual design: typography, colour, imagery and every key page at desktop and mobile sizes.",
    output: "Wireframes and approved page designs",
  },
  {
    step: "04",
    title: "Development",
    body: "The approved design is built as a fast, responsive, accessible website on a staging link you can open at any time, so progress is visible rather than promised.",
    output: "A working site on a private staging link",
  },
  {
    step: "05",
    title: "Testing",
    body: "Every page is checked across browsers, phones and tablets, along with forms, speed, accessibility basics, metadata and redirects from any old URLs.",
    output: "A tested, signed-off release candidate",
  },
  {
    step: "06",
    title: "Launch",
    body: "We handle the domain, hosting and go-live, then hand over logins and a short guide. Ongoing maintenance is available if you'd rather not run it yourself.",
    output: "A live website, and everything you need to own it",
  },
];

export const principles = [
  {
    title: "Websites only",
    body: "We don't sell logos, ads or social media packages. All of the attention goes into design, code and the details that make a website work.",
  },
  {
    title: "Scope in writing",
    body: "What's included, what it costs and when it lands are agreed before work begins. If the scope changes, the change is quoted before it's built.",
  },
  {
    title: "Built for real devices",
    body: "Pages are designed and tested at phone, tablet and desktop sizes, and on slow connections — not only on a large monitor.",
  },
  {
    title: "Speed is a feature",
    body: "Lean pages, optimised images and sensible hosting, because a slow site loses visitors before they read a word.",
  },
  {
    title: "Accessible by default",
    body: "Readable contrast, keyboard navigation, real labels on forms and motion that respects system settings — built in, not bolted on.",
  },
  {
    title: "You own it",
    body: "The domain, hosting account, content and code are yours. You get the logins and the files, whether or not we keep maintaining the site.",
  },
];

export const generalFaqs = [
  {
    q: "What does Mithran Labs do?",
    a: "We design and build websites — and only websites. That covers custom design, business sites, landing pages, portfolios, e-commerce stores, redesigns, performance work and ongoing maintenance.",
  },
  {
    q: "How much does a website cost?",
    a: "It depends on the number of pages, the features, the integrations and how much content needs to be written or produced. Every project is quoted individually after a discovery call, and the quote is fixed in writing before work starts.",
  },
  {
    q: "How long does a project take?",
    a: "A focused landing page is much quicker than a multi-page site or an online store. The timeline is set during planning, once the scope is clear, and agreed in writing — with the dates that depend on you, like content and feedback, marked as such.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes. Projects run remotely over video calls, shared design files and a live staging link, so location doesn't change how the work is done.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes. We review what's there first — content, structure, speed and search visibility — so a redesign keeps what works, fixes what doesn't, and redirects old URLs so you don't lose existing traffic.",
  },
  {
    q: "What happens after launch?",
    a: "You receive the logins, files and a short guide to managing the site. If you'd like us to keep it updated, secure and backed up, maintenance is available as a separate monthly arrangement.",
  },
];
