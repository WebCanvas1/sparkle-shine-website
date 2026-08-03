import type { ContentBundle, ContentSection } from "./content-data";

export type AdminSession = { authenticated: boolean; username?: string; expires_at?: number };

async function parse(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(input, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init,
    });
  } catch {
    throw new Error("Network error — please check your connection and try again.");
  }
  const body = (await parse(res)) as { error?: string };
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body as T;
}

export const adminApi = {
  session: () => request<AdminSession>("/api/admin/session"),
  login: (username: string, password: string) =>
    request<{ ok: true; username: string; seeded: string[] }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ ok: true }>("/api/admin/logout", { method: "POST" }),
  stats: () =>
    request<{
      services: number;
      gallery: number;
      testimonials: number;
      faqs: number;
      images: number;
      updated_at: string | null;
      storage_bytes: number;
    }>("/api/admin/stats"),
  save: <K extends ContentSection>(section: K, data: ContentBundle[K]) =>
    request<{ ok: true }>(`/api/admin/${section}`, { method: "PUT", body: JSON.stringify(data) }),
  uploadImage: (name: string, dataUrl: string) =>
    request<{ ok: true; url: string }>("/api/admin/image", {
      method: "POST",
      body: JSON.stringify({ name, data_url: dataUrl }),
    }),
  deleteImage: (name: string) =>
    request<{ ok: true }>(`/api/admin/image?name=${encodeURIComponent(name)}`, {
      method: "DELETE",
    }),
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1600;
const QUALITY = 0.75;

/**
 * Validates, resizes and compresses an image entirely in the browser, then
 * returns a `data:image/webp;base64,...` string ready for KV storage.
 */
export async function compressToWebpDataUrl(file: File): Promise<string> {
  if (!/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.type)) {
    throw new Error("Unsupported file type. Use PNG, JPEG, WebP, GIF or AVIF.");
  }
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is larger than the 8 MB limit.");

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("That file could not be read as an image.");
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image compression is not supported in this browser.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL("image/webp", QUALITY);
  if (!dataUrl.startsWith("data:image/webp;base64,")) {
    throw new Error("Could not convert the image to WebP.");
  }
  return dataUrl;
}

export const formatBytes = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
