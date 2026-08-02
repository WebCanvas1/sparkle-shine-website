/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Validates and sanitises an enquiry, verifies the Cloudflare Turnstile token
 * (when configured), then delivers the enquiry by email through Resend.
 *
 * All secrets are read from the Cloudflare environment and never reach the
 * browser bundle.
 */

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_RECIPIENT_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

const MAX_BODY_BYTES = 16 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** Trim, collapse control characters and cap length. */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return (
    value
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .trim()
      .slice(0, max)
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Reject oversized submissions before reading the body.
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return json({ error: "Submission too large." }, 413);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: "Submission too large." }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const name = clean(payload.name, 100);
  const phone = clean(payload.phone, 30);
  const email = clean(payload.email, 255);
  const message = clean(payload.message, 2000);

  if (name.length < 2) return json({ error: "Please enter your name." }, 400);
  if (phone.length < 6) return json({ error: "Please enter a valid phone number." }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address." }, 400);
  if (message.length < 5) return json({ error: "Please tell us about the job." }, 400);

  // Spam protection — enforced whenever a secret key is configured.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = clean(payload.turnstileToken, 4096);
    if (!token) return json({ error: "Please complete the spam check." }, 400);
    const ok = await verifyTurnstile(
      env.TURNSTILE_SECRET_KEY,
      token,
      request.headers.get("CF-Connecting-IP"),
    );
    if (!ok) return json({ error: "Spam check failed. Please try again." }, 403);
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_RECIPIENT_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact form is not configured: missing RESEND_API_KEY / CONTACT_* variables.");
    return json({ error: "The contact form is not configured yet. Please call us instead." }, 500);
  }

  const html = `
    <h2>New website enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `New enquiry from ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error(`Resend request failed [${res.status}]: ${await res.text()}`);
    return json({ error: "We couldn't send your enquiry. Please call us instead." }, 502);
  }

  return json({ ok: true });
};
