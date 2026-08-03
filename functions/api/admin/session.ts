import type { Env } from "../../_shared/env";
import { json } from "../../_shared/env";
import { readSession } from "../../_shared/auth";

/** GET /api/admin/session — reports whether the caller has a valid session. */
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const session = await readSession(env, request);
  if (!session) return json({ authenticated: false }, 200);
  return json({ authenticated: true, username: session.username, expires_at: session.exp }, 200);
};
