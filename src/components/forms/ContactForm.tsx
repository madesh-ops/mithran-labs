"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { phoneHref, site } from "@/content/site";
import { budgetOptions, normaliseContact, serviceOptions, validateContact, type ContactInput, type Errors } from "@/lib/validation";
import { FormStatus, Honeypot, SelectField, TextArea, TextField } from "./Fields";
import styles from "./Forms.module.css";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; name: string }
  | { kind: "error"; code: "not_configured" | "send_failed" | "rate_limited" | "network" | "invalid" };

const fieldOrder: (keyof ContactInput)[] = ["name", "email", "company", "phone", "service", "budget", "message"];

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const [lastInput, setLastInput] = useState<ContactInput | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Pre-select a service when arriving from a service page (?service=slug).
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("service");
    const select = document.getElementById("service") as HTMLSelectElement | null;
    if (s && select && serviceOptions.some((o) => o.value === s)) select.value = s;
  }, []);

  const read = () => {
    const fd = new FormData(formRef.current!);
    return { input: normaliseContact(Object.fromEntries(fd.entries())), website: String(fd.get("website") ?? "") };
  };

  // Re-validate a field as the user fixes it (only once it has an error).
  const onChange = (name: string) => {
    if (!errors[name]) return;
    const next = validateContact(read().input);
    setErrors((e) => ({ ...e, [name]: next[name] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.kind === "submitting") return;
    const { input, website } = read();
    const found = validateContact(input);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = fieldOrder.find((f) => found[f]);
      if (first) document.getElementById(first)?.focus();
      setState({ kind: "error", code: "invalid" });
      return;
    }

    setLastInput(input);
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string; errors?: Errors };
      if (res.ok && data.ok) {
        setState({ kind: "success", name: input.name.split(" ")[0] });
        return;
      }
      if (data.code === "invalid" && data.errors) {
        setErrors(data.errors);
        setState({ kind: "error", code: "invalid" });
        return;
      }
      const code = data.code === "not_configured" || data.code === "rate_limited" ? data.code : "send_failed";
      setState({ kind: "error", code });
    } catch {
      setState({ kind: "error", code: "network" });
    }
  };

  useEffect(() => {
    if (state.kind === "error" && state.code !== "invalid") statusRef.current?.focus();
  }, [state]);

  if (state.kind === "success") {
    return (
      <div className={styles.success} role="status" tabIndex={-1} ref={(el) => el?.focus()}>
        <p className="label" style={{ color: "inherit" }}>
          Enquiry sent
        </p>
        <h3>Thanks, {state.name} — your enquiry has been sent.</h3>
        <ol>
          <li>We read every enquiry and reply by email.</li>
          <li>If it&apos;s a fit, we&apos;ll suggest a short discovery call.</li>
          <li>After that you&apos;ll get a written scope, timeline and quote.</li>
        </ol>
        <Button href="/services" variant="ink" icon="arrow">
          Browse services meanwhile
        </Button>
      </div>
    );
  }

  const mailtoFallback = () => {
    const i = lastInput;
    const body = i
      ? `Name: ${i.name}\nCompany: ${i.company}\nPhone: ${i.phone}\nService: ${serviceOptions.find((s) => s.value === i.service)?.label ?? ""}\nBudget: ${i.budget}\n\n${i.message}`.slice(0, 1800)
      : "";
    return `mailto:${site.email}?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(body)}`;
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-describedby="form-required-note">
      <p id="form-required-note" className={styles.hint}>
        Fields marked <span className={styles.req}>*</span> are required.
      </p>

      <div className={styles.row}>
        <TextField id="name" label="Your name" required autoComplete="name" error={errors.name} onChange={() => onChange("name")} placeholder="Your full name" />
        <TextField
          id="email"
          label="Email address"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          onChange={() => onChange("email")}
          placeholder="you@company.com"
        />
      </div>
      <div className={styles.row}>
        <TextField id="company" label="Company" autoComplete="organization" error={errors.company} placeholder="Business or brand name (optional)" />
        <TextField id="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} onChange={() => onChange("phone")} placeholder="Optional" />
      </div>
      <div className={styles.row}>
        <SelectField
          id="service"
          label="What do you need?"
          required
          placeholder="Choose a service"
          options={serviceOptions.map((s) => ({ value: s.value, label: s.label }))}
          defaultValue=""
          onChange={() => onChange("service")}
          error={errors.service}
        />
        <SelectField
          id="budget"
          label="Budget range"
          placeholder="Choose a range"
          options={budgetOptions.map((b) => ({ value: b, label: b }))}
          defaultValue=""
          error={errors.budget}
        />
      </div>
      <TextArea
        id="message"
        label="About your project"
        required
        rows={6}
        error={errors.message}
        onChange={() => onChange("message")}
        hint="What should the website do, who is it for, and when do you need it? Links to your current site or sites you like help."
        placeholder="We run a small architecture practice and need a portfolio website with project pages and an enquiry form, ideally live within two months."
      />
      <Honeypot />

      <div ref={statusRef} tabIndex={-1} style={{ outline: "none" }}>
        {state.kind === "error" && state.code === "invalid" && errorCount > 0 && (
          <FormStatus tone="error" title={`Please fix ${errorCount === 1 ? "1 field" : `${errorCount} fields`} above.`} />
        )}
        {state.kind === "error" && state.code === "not_configured" && (
          <FormStatus tone="info" title="Your enquiry hasn't been sent.">
            <p>The online form isn&apos;t connected to email yet, so nothing was sent. Please email us instead — the link below opens your mail app with your details filled in:</p>
            <p>
              <a href={mailtoFallback()}>Email {site.email}</a>
              {site.phone && (
                <>
                  {" "}
                  or call <a href={phoneHref(site.phone)}>{site.phone}</a>
                </>
              )}
              .
            </p>
          </FormStatus>
        )}
        {state.kind === "error" && (state.code === "send_failed" || state.code === "network") && (
          <FormStatus tone="error" title="Your enquiry couldn't be sent.">
            <p>
              {state.code === "network" ? "Check your connection and try again." : "Something went wrong on our side. Please try again in a moment."} You
              can also <a href={mailtoFallback()}>email {site.email}</a> instead.
            </p>
          </FormStatus>
        )}
        {state.kind === "error" && state.code === "rate_limited" && (
          <FormStatus tone="error" title="Too many attempts.">
            <p>
              Please wait a few minutes, or <a href={mailtoFallback()}>email us directly</a>.
            </p>
          </FormStatus>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.fineprint}>
          We use your details only to reply to this enquiry. See our <Link href="/privacy">privacy policy</Link>.
        </p>
        <Button type="submit" size="lg" loading={state.kind === "submitting"} aria-disabled={state.kind === "submitting"}>
          {state.kind === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
