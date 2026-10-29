/**
 * Form validation shared by the client (instant feedback) and the API routes
 * (the source of truth — never trust the client).
 */

export type Errors = Partial<Record<string, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-\s\d]{7,20}$/;

export const serviceOptions = [
  { value: "custom-website-design", label: "Custom website design" },
  { value: "business-websites", label: "Business or corporate website" },
  { value: "landing-pages", label: "Landing page" },
  { value: "portfolio-websites", label: "Portfolio or personal website" },
  { value: "ecommerce-websites", label: "E-commerce website" },
  { value: "website-redesign", label: "Website redesign" },
  { value: "responsive-performance", label: "Speed, mobile or accessibility fixes" },
  { value: "website-maintenance", label: "Maintenance and support" },
  { value: "other", label: "Something else / not sure" },
] as const;

export const budgetOptions = [
  "Under ₹50,000",
  "₹50,000 – ₹1,50,000",
  "₹1,50,000 – ₹5,00,000",
  "Above ₹5,00,000",
  "Not sure yet",
] as const;

export type ContactInput = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
};

const clean = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function normaliseContact(raw: Record<string, unknown>): ContactInput {
  return {
    name: clean(raw.name, 120),
    email: clean(raw.email, 200),
    company: clean(raw.company, 160),
    phone: clean(raw.phone, 30),
    service: clean(raw.service, 60),
    budget: clean(raw.budget, 60),
    message: clean(raw.message, 5000),
  };
}

export function validateContact(v: ContactInput): Errors {
  const e: Errors = {};
  if (v.name.length < 2) e.name = "Enter your name.";
  if (!EMAIL.test(v.email)) e.email = "Enter a valid email address, like name@company.com.";
  if (v.phone && !PHONE.test(v.phone)) e.phone = "Enter a valid phone number, or leave it blank.";
  if (!serviceOptions.some((s) => s.value === v.service)) e.service = "Choose the service you need.";
  if (v.budget && !budgetOptions.includes(v.budget as (typeof budgetOptions)[number])) e.budget = "Choose a budget range.";
  if (v.message.length < 20) e.message = "Tell us a little more — at least 20 characters.";
  return e;
}
