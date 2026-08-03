import type { Env } from "../../_shared/env";
import { fail, json, kv } from "../../_shared/env";
import { requireSession } from "../../_shared/auth";
import {
  MAX_IMAGE_BYTES,
  deleteImage,
  imagePath,
  parseDataUrl,
  putImage,
} from "../../_shared/images";

const NAME_RE = /^[a-z0-9][a-z0-9:_-]{0,80}$/i;

/**
 * POST /api/admin/image — stores a Base64 WebP image in KV.
 * Body: { name: "gallery:g1", data_url: "data:image/webp;base64,..." }
 */
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const unauthorised = await requireSession(env, request);
  if (unauthorised) return unauthorised;

  let body: { name?: unknown; data_url?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return fail("Invalid JSON body.", 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!NAME_RE.test(name)) return fail("Invalid image name.", 400);

  const parsed = parseDataUrl(body.data_url);
  if (!parsed) return fail("Image must be a Base64 data URL (WebP, PNG or JPEG).", 400);
  if (parsed.bytes > MAX_IMAGE_BYTES) return fail("Image exceeds the 8 MB limit.", 413);

  try {
    const meta = await putImage(env, name, parsed.mime, parsed.base64);
    return json({ ok: true, url: imagePath(name), meta });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not store the image.", 500);
  }
};

/** DELETE /api/admin/image?name=gallery:g1 */
export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
  const unauthorised = await requireSession(env, request);
  if (unauthorised) return unauthorised;

  const name = new URL(request.url).searchParams.get("name")?.trim() ?? "";
  if (!NAME_RE.test(name)) return fail("Invalid image name.", 400);

  try {
    await deleteImage(env, name);
    return json({ ok: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not delete the image.", 500);
  }
};

/** GET /api/admin/image — lists stored image keys and their sizes. */
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const unauthorised = await requireSession(env, request);
  if (unauthorised) return unauthorised;

  try {
    const list = await kv(env).list({ prefix: "image:" });
    const images = list.keys.filter((k) => !/:part\d+$/.test(k.name)).map((k) => k.name);
    return json({ images });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not list images.", 500);
  }
};
