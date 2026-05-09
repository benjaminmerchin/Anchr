import {
  getHyperspellForCurrentUser,
  searchMemories,
} from "@/lib/hyperspell";

export const runtime = "nodejs";

/**
 * Diagnostic-only route. Returns what Hyperspell knows about the currently
 * signed-in viewer: their userId, the integrations they have installed, a
 * default search and a search restricted to installed integrations.
 */
export async function GET() {
  let resolved: Awaited<ReturnType<typeof getHyperspellForCurrentUser>>;
  try {
    resolved = await getHyperspellForCurrentUser();
  } catch (err) {
    return Response.json(
      { ok: false, stage: "auth", error: errMsg(err) },
      { status: 401 },
    );
  }
  const { client, userId } = resolved;

  let me: { installed_integrations?: string[] } | null = null;
  let meError: string | null = null;
  try {
    me = (await client.auth.me()) as { installed_integrations?: string[] };
  } catch (err) {
    meError = errMsg(err);
  }

  const installed = me?.installed_integrations ?? [];

  const defaultSearch = await runSearch(userId, "What has happened recently?");
  const scopedSearch = await runSearch(
    userId,
    "What has happened recently?",
    installed,
  );

  return Response.json({
    ok: true,
    userId,
    me,
    meError,
    defaultSearch,
    scopedSearch,
  });
}

async function runSearch(
  userId: string,
  query: string,
  sources?: string[],
) {
  try {
    const result = (await searchMemories(userId, query, {
      answer: false,
      ...(sources && sources.length > 0 ? { sources } : {}),
    })) as {
      documents?: unknown[];
      errors?: unknown;
      query_id?: string;
    };
    return {
      ok: true,
      documents_count: Array.isArray(result.documents)
        ? result.documents.length
        : null,
      errors: result.errors ?? null,
      query_id: result.query_id ?? null,
      sources: sources ?? "default",
    };
  } catch (err) {
    return { ok: false, error: errMsg(err), sources: sources ?? "default" };
  }
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
