import "server-only";

/**
 * Minimal email delivery via the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email).
 * No SDK dependency. Requires RESEND_API_KEY, CONTACT_FROM_EMAIL and
 * CONTACT_TO_EMAIL; when any is missing, callers must report "not configured"
 * — never a fake success.
 */

export function mailConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "";
  return { configured: Boolean(apiKey && from && to), apiKey, from, to };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function renderFields(title: string, fields: [string, string][]) {
  const text = [title, "", ...fields.map(([k, v]) => `${k}: ${v || "—"}`)].join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#141413">
<h2 style="margin:0 0 16px">${escapeHtml(title)}</h2>
<table cellpadding="8" style="border-collapse:collapse">${fields
    .map(
      ([k, v]) =>
        `<tr><td style="vertical-align:top;color:#66645f;white-space:nowrap">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v || "—")}</td></tr>`,
    )
    .join("")}</table></div>`;
  return { text, html };
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "send_failed" }> {
  const cfg = mailConfig();
  if (!cfg.configured) return { ok: false, reason: "not_configured" };

  try {
    // RESEND_API_URL exists only so tests can point at a local mock.
    const endpoint = `${(process.env.RESEND_API_URL || "https://api.resend.com").replace(/\/$/, "")}/emails`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: cfg.from,
        to: [opts.to],
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error("[mailer] Resend responded", res.status, await res.text().catch(() => ""));
      return { ok: false, reason: "send_failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mailer] request failed", err);
    return { ok: false, reason: "send_failed" };
  }
}

/** Best-effort per-instance rate limit (a real deployment should also rely on platform/WAF limits). */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

export const clientIp = (req: Request) =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
