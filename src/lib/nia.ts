import "server-only";

const DEFAULT_BASE_URL =
  process.env.NIA_BASE_URL ?? "https://api.trynia.ai/v2";

/**
 * Hit Nia's unified search endpoint and return a single condensed string
 * suitable for inlining into a broadcast prompt. Returns `null` on any
 * failure — script generation must keep working even when Nia is down or
 * unconfigured.
 *
 * `mode: "web"` lets Nia pull from the open web (no need to pre-register
 * specific repos). Switch to `mode: "query"` once you index sources via
 * the dashboard and want to scope to those repositories/data_sources.
 */
export async function searchCompetitiveContext(
  query: string,
  options: { timeoutMs?: number } = {},
): Promise<string | null> {
  const apiKey = process.env.NIA_API_KEY;
  if (!apiKey) return null;

  const { timeoutMs = 6000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${DEFAULT_BASE_URL}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "web",
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        include_sources: false,
        skip_llm: false,
        max_tokens: 220,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;

    // The response shape varies — try the common keys before giving up.
    const candidates = [
      data.answer,
      data.content,
      data.message,
      data.text,
      // Some responses nest the answer under a `data` or `result` envelope.
      (data.data as Record<string, unknown> | undefined)?.answer,
      (data.result as Record<string, unknown> | undefined)?.answer,
    ];
    const answer = candidates.find(
      (c): c is string => typeof c === "string" && c.trim().length > 0,
    );
    if (!answer) return null;

    return condense(answer);
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Trim a Nia answer down to a single sentence we can inline into the anchor's
 * script prompt. Nia answers can be a paragraph; we want one punchy clause.
 */
function condense(answer: string): string {
  const cleaned = answer.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 220) return cleaned;
  // First sentence boundary inside the budget
  const truncated = cleaned.slice(0, 220);
  const lastBoundary = Math.max(
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("!"),
    truncated.lastIndexOf("?"),
  );
  return lastBoundary > 60 ? truncated.slice(0, lastBoundary + 1) : truncated;
}
