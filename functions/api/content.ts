import type { Env } from "../_shared/env";
import { json } from "../_shared/env";
import { readAll } from "../_shared/store";

/**
 * GET /api/content — public, cacheable read of every content section.
 * Returns `{}` when KV is empty or unavailable so the SPA falls back to its
 * bundled static content.
 */
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const content = await readAll(env);
    return json(content, 200, { "Cache-Control": "public, max-age=60, s-maxage=300" });
  } catch {
    return json({}, 200, { "Cache-Control": "no-store" });
  }
};
