import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(200).optional().default(""),
  service: z.string().trim().max(120).optional().default(""),
  budget: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1, "Please add a short message.").max(5000),
  website: z.string().optional().default(""), // honeypot
});

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 422 });
  }
  const d = parsed.data;

  // Bot filled the honeypot: pretend success, send nothing.
  if (d.website) return Response.json({ ok: true });

  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Company / website", d.company],
    ["Service", d.service],
    ["Monthly budget", d.budget],
  ];
  const html = `<h2>New website enquiry</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v || "—")}</td></tr>`)
    .join("")}</table><p><strong>Message</strong></p><p>${esc(d.message).replace(/\n/g, "<br>")}</p>`;

  const tasks: Promise<unknown>[] = [];

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (key && to) {
    const resend = new Resend(key);
    tasks.push(
      resend.emails
        .send({
          // Sender must be on a Resend-verified domain (smartsolutionsinc.ca: SPF + DKIM). Replies go to the visitor.
          from: process.env.CONTACT_FROM_EMAIL || "Smart Solutions <noreply@smartsolutionsinc.ca>",
          to,
          replyTo: d.email,
          subject: `New lead: ${d.name}${d.service ? ` — ${d.service}` : ""}`,
          html,
        })
        .then((r) => {
          if (r.error) throw new Error(r.error.message);
        }),
    );
  }

  const ghl = process.env.GHL_WEBHOOK_URL;
  if (ghl) {
    const { website: _hp, ...lead } = d;
    void _hp;
    tasks.push(
      fetch(ghl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, source: "vasay.ai website" }),
      }).then((r) => {
        if (!r.ok) throw new Error(`GHL webhook ${r.status}`);
      }),
    );
  }

  if (tasks.length === 0) {
    console.error("Contact form: no RESEND_API_KEY/CONTACT_TO_EMAIL or GHL_WEBHOOK_URL configured.");
    return Response.json({ ok: false, error: "The form isn't configured yet. Please call us instead." }, { status: 500 });
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((r) => r.status === "rejected");
  failed.forEach((f) => console.error("Contact form delivery failed:", (f as PromiseRejectedResult).reason));
  if (failed.length === results.length) {
    return Response.json({ ok: false, error: "We couldn't send your message. Please call us instead." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
