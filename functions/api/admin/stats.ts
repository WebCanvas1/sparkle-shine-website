import type { Env } from "../../_shared/env";
import { fail, json, kv } from "../../_shared/env";
import { requireSession } from "../../_shared/auth";
import { readAll } from "../../_shared/store";
import type { ImageMeta } from "../../_shared/images";

/** GET /api/admin/stats — dashboard counters and estimated KV usage. */
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const unauthorised = await requireSession(env, request);
  if (unauthorised) return unauthorised;

  try {
    const content = await readAll(env);
    const store = kv(env);

    const list = await store.list({ prefix: "image:" });
    const metaKeys = list.keys.filter((k) => !/:part\d+$/.test(k.name));

    let imageBytes = 0;
    for (const k of metaKeys) {
      const raw = await store.get(k.name);
      if (!raw) continue;
      try {
        imageBytes += (JSON.parse(raw) as ImageMeta).bytes ?? 0;
      } catch {
        /* ignore */
      }
    }

    const contentBytes = new TextEncoder().encode(JSON.stringify(content)).length;

    return json({
      services: content.services?.length ?? 0,
      gallery: content.gallery?.length ?? 0,
      testimonials: content.testimonials?.length ?? 0,
      faqs: content.faqs?.length ?? 0,
      images: metaKeys.length,
      updated_at: content.updated_at ?? null,
      storage_bytes: contentBytes + imageBytes,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not load statistics.", 500);
  }
};
