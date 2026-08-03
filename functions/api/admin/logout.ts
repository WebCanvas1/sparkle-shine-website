import type { Env } from "../../_shared/env";
import { json } from "../../_shared/env";
import { clearedCookie } from "../../_shared/auth";

/** POST /api/admin/logout — clears the session cookie. */
export const onRequestPost: PagesFunction<Env> = async () =>
  json({ ok: true }, 200, { "Set-Cookie": clearedCookie });
