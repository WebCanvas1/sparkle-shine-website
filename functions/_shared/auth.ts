import type { Env } from "./env";
import { fail } from "./env";

export const SESSION_COOKIE = "sparkle_admin_session";
/** Session lifetime in seconds (2 hours of inactivity-free validity). */
export const SESSION_TTL = 60 * 60 * 2;

const enc = new TextEncoder();

const b64url = (bytes: ArrayBuffer | Uint8Array) => {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromB64url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
};

async function key(secret: string) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createSession(env: Env, username: string): Promise<string> {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Admin sessions are not configured.");
  const payload = b64url(enc.encode(JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL * 1000 })));
  const sig = b64url(await crypto.subtle.sign("HMAC", await key(secret), enc.encode(payload)));
  return `${payload}.${sig}`;
}

export async function readSession(env: Env, request: Request): Promise<{ username: string; exp: number } | null> {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const cookie = request.headers.get("Cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  const [payload, sig] = decodeURIComponent(match[1]).split(".");
  if (!payload || !sig) return null;
  try {
    const expected = b64url(await crypto.subtle.sign("HMAC", await key(secret), enc.encode(payload)));
    if (expected.length !== sig.length) return null;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    if (diff !== 0) return null;
    const data = JSON.parse(fromB64url(payload)) as { u: string; exp: number };
    if (!data?.exp || data.exp < Date.now()) return null;
    return { username: data.u, exp: data.exp };
  } catch {
    return null;
  }
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL}`;
}

export const clearedCookie = `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;

/** Returns a 401 Response when the caller has no valid session. */
export async function requireSession(env: Env, request: Request): Promise<Response | null> {
  const session = await readSession(env, request);
  if (!session) return fail("Your session has expired. Please sign in again.", 401);
  return null;
}

/** Constant-time string comparison for credentials. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
