import type { Env } from "./env";
import { kv } from "./env";

/**
 * Images are stored as WebP Base64 inside KV (no R2, no external storage).
 * Large payloads are transparently split across `:partN` keys and stitched
 * back together on read.
 */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const CHUNK_CHARS = 512 * 1024;

export type ImageMeta = {
  image_key: string;
  parts: number;
  mime: string;
  bytes: number;
  updated_at: string;
};

/** `gallery/123` -> `image:gallery:123` */
export const imageKey = (name: string) => `image:${name.replace(/\//g, ":")}`;
export const imagePath = (name: string) => `/api/image/${name.replace(/:/g, "/")}`;

export function parseDataUrl(dataUrl: unknown): { mime: string; base64: string; bytes: number } | null {
  if (typeof dataUrl !== "string") return null;
  const match = /^data:(image\/(?:webp|png|jpeg));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl.trim());
  if (!match) return null;
  const base64 = match[2];
  const bytes = Math.floor((base64.length * 3) / 4);
  return { mime: match[1], base64, bytes };
}

export async function putImage(env: Env, name: string, mime: string, base64: string): Promise<ImageMeta> {
  const store = kv(env);
  const key = imageKey(name);
  await deleteImage(env, name);

  const parts: string[] = [];
  for (let i = 0; i < base64.length; i += CHUNK_CHARS) parts.push(base64.slice(i, i + CHUNK_CHARS));

  const meta: ImageMeta = {
    image_key: key,
    parts: parts.length,
    mime,
    bytes: Math.floor((base64.length * 3) / 4),
    updated_at: new Date().toISOString(),
  };

  for (let i = 0; i < parts.length; i++) await store.put(`${key}:part${i + 1}`, parts[i]);
  await store.put(key, JSON.stringify(meta));
  return meta;
}

export async function getImage(env: Env, name: string): Promise<{ mime: string; base64: string } | null> {
  const store = kv(env);
  const key = imageKey(name);
  const raw = await store.get(key);
  if (!raw) return null;
  const meta = JSON.parse(raw) as ImageMeta;
  const chunks: string[] = [];
  for (let i = 1; i <= meta.parts; i++) {
    const part = await store.get(`${key}:part${i}`);
    if (part === null) throw new Error(`Image data is incomplete (missing part ${i} of ${meta.parts}).`);
    chunks.push(part);
  }
  return { mime: meta.mime, base64: chunks.join("") };
}

export async function deleteImage(env: Env, name: string): Promise<void> {
  const store = kv(env);
  const key = imageKey(name);
  const raw = await store.get(key);
  if (!raw) return;
  try {
    const meta = JSON.parse(raw) as ImageMeta;
    for (let i = 1; i <= meta.parts; i++) await store.delete(`${key}:part${i}`);
  } catch {
    /* ignore malformed metadata */
  }
  await store.delete(key);
}

export function base64ToBytes(base64: string): Uint8Array {
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
