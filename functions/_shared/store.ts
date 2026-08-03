import type { Env } from "./env";
import { kv } from "./env";
import { seedContent, type ContentBundle, type ContentSection } from "../../src/lib/content-data";

export const CONTENT_SECTIONS: ContentSection[] = [
  "hero",
  "about",
  "contact",
  "services",
  "gallery",
  "testimonials",
  "faqs",
];

export const contentKey = (section: ContentSection) => `content:${section}`;
export const META_KEY = "content:meta";

export async function readSection<K extends ContentSection>(
  env: Env,
  section: K,
): Promise<ContentBundle[K] | null> {
  const raw = await kv(env).get(contentKey(section));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ContentBundle[K];
  } catch {
    return null;
  }
}

export async function writeSection<K extends ContentSection>(
  env: Env,
  section: K,
  value: ContentBundle[K],
): Promise<void> {
  await kv(env).put(contentKey(section), JSON.stringify(value));
  await kv(env).put(META_KEY, JSON.stringify({ updated_at: new Date().toISOString(), section }));
}

/** Reads every section; missing sections come back as `null` so the client can fall back. */
export async function readAll(env: Env): Promise<Partial<ContentBundle> & { updated_at?: string }> {
  const out: Record<string, unknown> = {};
  for (const section of CONTENT_SECTIONS) {
    const value = await readSection(env, section);
    if (value !== null) out[section] = value;
  }
  const meta = await kv(env).get(META_KEY);
  if (meta) {
    try {
      out.updated_at = (JSON.parse(meta) as { updated_at?: string }).updated_at;
    } catch {
      /* ignore */
    }
  }
  return out as Partial<ContentBundle> & { updated_at?: string };
}

/**
 * Seeds KV from the static content shipped in `src/lib/content-data.ts`
 * the first time an administrator signs in. Existing sections are untouched.
 */
export async function ensureSeeded(env: Env): Promise<{ seeded: ContentSection[] }> {
  const seeded: ContentSection[] = [];
  for (const section of CONTENT_SECTIONS) {
    const existing = await kv(env).get(contentKey(section));
    if (existing === null) {
      await kv(env).put(contentKey(section), JSON.stringify(seedContent[section]));
      seeded.push(section);
    }
  }
  if (seeded.length) {
    await kv(env).put(META_KEY, JSON.stringify({ updated_at: new Date().toISOString(), section: "seed" }));
  }
  return { seeded };
}
