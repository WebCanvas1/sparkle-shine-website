import type { Env } from "../../_shared/env";
import { fail, json } from "../../_shared/env";
import { requireSession } from "../../_shared/auth";
import { sectionSchemas, type SectionName } from "../../_shared/schemas";
import { readSection, writeSection } from "../../_shared/store";

const isSection = (value: string): value is SectionName => value in sectionSchemas;

/** GET /api/admin/<section> — authenticated read straight from KV. */
export const onRequestGet: PagesFunction<Env> = async ({ env, request, params }) => {
  const unauthorised = await requireSession(env, request);
  if (unauthorised) return unauthorised;

  const section = String(params.section);
  if (!isSection(section)) return fail("Unknown content section.", 404);

  try {
    return json({ section, data: await readSection(env, section) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not read content.", 500);
  }
};

/** PUT /api/admin/<section> — validates then writes the section to KV. */
export const onRequestPut: PagesFunction<Env> = async ({ env, request, params }) => {
  const unauthorised = await requireSession(env, request);
  if (unauthorised) return unauthorised;

  const section = String(params.section);
  if (!isSection(section)) return fail("Unknown content section.", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid JSON body.", 400);
  }

  const parsed = sectionSchemas[section].safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return json(
      { error: `${issue.path.join(".") || "value"}: ${issue.message}`, issues: parsed.error.issues },
      400,
    );
  }

  try {
    await writeSection(env, section, parsed.data as never);
    return json({ ok: true, section, updated_at: new Date().toISOString() });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Could not save changes.", 500);
  }
};
