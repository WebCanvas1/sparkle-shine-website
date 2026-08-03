import type { Env } from "../../_shared/env";
import { fail } from "../../_shared/env";
import { base64ToBytes, getImage } from "../../_shared/images";

/**
 * GET /api/image/<scope>/<id> — reassembles the Base64 WebP stored in KV
 * (across one or many `:partN` keys) and streams it as a real image.
 */
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const segments = Array.isArray(params.path) ? params.path : [params.path];
  const name = segments.filter(Boolean).join(":");
  if (!name || !/^[a-z0-9:_-]+$/i.test(name)) return fail("Invalid image reference.", 400);

  try {
    const image = await getImage(env, name);
    if (!image) return fail("Image not found.", 404);
    const bytes = base64ToBytes(image.base64);
    return new Response(bytes, {
      headers: {
        "Content-Type": image.mime,
        "Cache-Control": "public, max-age=300, s-maxage=86400",
      },
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not load image.", 500);
  }
};
