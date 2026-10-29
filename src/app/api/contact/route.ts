import { clientIp, mailConfig, rateLimited, renderFields, sendMail } from "@/lib/mailer";
import { normaliseContact, serviceOptions, validateContact } from "@/lib/validation";

export async function POST(req: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return Response.json({ ok: false, code: "bad_request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. Pretending success
  // here only affects bots; humans can't reach this branch.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const input = normaliseContact(raw);
  const errors = validateContact(input);
  if (Object.keys(errors).length) return Response.json({ ok: false, code: "invalid", errors }, { status: 400 });

  if (!mailConfig().configured) {
    return Response.json({ ok: false, code: "not_configured" }, { status: 503 });
  }
  if (rateLimited(`contact:${clientIp(req)}`)) {
    return Response.json({ ok: false, code: "rate_limited" }, { status: 429 });
  }

  const serviceLabel = serviceOptions.find((s) => s.value === input.service)?.label ?? input.service;
  const { text, html } = renderFields("New project enquiry from the Mithran Labs website", [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company],
    ["Phone", input.phone],
    ["Service", serviceLabel],
    ["Budget", input.budget],
    ["Project", input.message],
  ]);

  const result = await sendMail({
    to: mailConfig().to,
    subject: `Enquiry: ${serviceLabel} — ${input.name}${input.company ? ` (${input.company})` : ""}`,
    text,
    html,
    replyTo: input.email,
  });

  if (!result.ok) return Response.json({ ok: false, code: result.reason }, { status: 502 });
  return Response.json({ ok: true });
}
