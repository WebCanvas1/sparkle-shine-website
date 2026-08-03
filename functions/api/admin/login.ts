import type { Env } from "../../_shared/env";
import { fail, json } from "../../_shared/env";
import { createSession, safeEqual, sessionCookie } from "../../_shared/auth";
import { ensureSeeded } from "../../_shared/store";

/** POST /api/admin/login — username + password, seeds KV on first success. */
export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
    return fail("Admin access is not configured on this deployment.", 503);
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return fail("Invalid request.", 400);
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) return fail("Username and password are required.", 400);

  const ok = safeEqual(username, env.ADMIN_USERNAME) && safeEqual(password, env.ADMIN_PASSWORD);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 400));
    return fail("Incorrect username or password.", 401);
  }

  let seeded: string[] = [];
  try {
    seeded = (await ensureSeeded(env)).seeded;
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "Could not initialise content storage.",
      500,
    );
  }

  const token = await createSession(env, username);
  return json({ ok: true, username, seeded }, 200, { "Set-Cookie": sessionCookie(token) });
};
