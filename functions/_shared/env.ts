/// <reference types="@cloudflare/workers-types" />

/** Cloudflare bindings available to every Pages Function in this project. */
export interface Env {
  /** Existing KV namespace binding — do not rename. */
  SPARKLE_CONTENT?: KVNamespace;
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_RECIPIENT_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });

export const fail = (message: string, status = 400) => json({ error: message }, status);

/** Throws a friendly error when the KV binding is missing. */
export function kv(env: Env): KVNamespace {
  if (!env.SPARKLE_CONTENT) {
    throw new Error("Content storage is not configured (missing SPARKLE_CONTENT binding).");
  }
  return env.SPARKLE_CONTENT;
}
