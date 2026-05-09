import { getHyperspellForCurrentUser, searchMemories } from "@/lib/hyperspell";

export const runtime = "nodejs";

/**
 * Diagnostic-only route. Returns what Hyperspell knows about the currently
 * signed-in viewer: their userId, the integrations they have installed, and
 * a quick test search. No secrets are exposed.
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

  let me: unknown = null;
  let meError: string | null = null;
  try {
    me = await client.auth.me();
  } catch (err) {
    meError = errMsg(err);
  }

  let search: unknown = null;
  let searchError: string | null = null;
  try {
    const result = await searchMemories(userId, "What has happened recently?", {
      answer: false,
    });
    search = {
      documents_count: Array.isArray(result.documents)
        ? result.documents.length
        : null,
      keys: Object.keys(result as object),
    };
  } catch (err) {
    searchError = errMsg(err);
  }

  return Response.json({
    ok: true,
    userId,
    me,
    meError,
    search,
    searchError,
  });
}

function errMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
