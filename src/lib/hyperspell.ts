import "server-only";

import Hyperspell from "hyperspell";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { tool } from "ai";
import { z } from "zod";

import { api } from "../../convex/_generated/api";

/**
 * Resolve the currently signed-in Anchr user and return both their stable
 * userId and a Hyperspell client scoped to that user. Throws if no user is
 * authenticated — call from server actions, route handlers, or RSC only.
 */
export async function getHyperspellForCurrentUser(): Promise<{
  client: Hyperspell;
  userId: string;
}> {
  const token = await convexAuthNextjsToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const userId = await fetchQuery(api.users.viewerId, {}, { token });
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const client = new Hyperspell({
    apiKey: process.env.HYPERSPELL_API_KEY!,
    userID: userId,
  });

  return { client, userId };
}

/**
 * Search a user's connected Hyperspell memories (Gmail, Slack, GitHub, Notion,
 * uploaded files, etc).
 *
 * @param userId  Stable user ID — matches the ID passed to `auth.userToken`.
 * @param query   Natural-language query, ideally phrased as a question.
 * @param options.answer  When true (default), Hyperspell returns an AI answer
 *                        synthesized from the source documents. Set to false
 *                        if you only want raw source snippets to feed your
 *                        own RAG pipeline.
 */
export async function searchMemories(
  userId: string,
  query: string,
  options: { answer?: boolean } = {},
) {
  const { answer = true } = options;

  const client = new Hyperspell({
    apiKey: process.env.HYPERSPELL_API_KEY!,
    userID: userId,
  });

  return await client.memories.search({
    query,
    answer,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool definitions (for LLM function calling)
// ─────────────────────────────────────────────────────────────────────────────
//
// No AI SDK is wired into Anchr yet. These shapes are framework-agnostic and
// drop into OpenAI, Anthropic, or Vercel AI SDK once an SDK is chosen.

const SEARCH_TOOL_DESCRIPTION =
  "Search the user's connected memories (Gmail, Slack, GitHub, Notion, Drive, Calendar, Linear, uploaded files). Use BEFORE answering questions that might require information from the user's personal or work data. Phrase the query as a natural-language question.";

const searchToolInputSchema = {
  type: "object" as const,
  properties: {
    query: {
      type: "string" as const,
      description: "Natural-language search query, phrased as a question.",
    },
  },
  required: ["query"] as const,
};

/** OpenAI / Vercel AI SDK chat-completions tool spec. */
export const searchMemoriesOpenAITool = {
  type: "function" as const,
  function: {
    name: "search_memories",
    description: SEARCH_TOOL_DESCRIPTION,
    parameters: searchToolInputSchema,
  },
};

/** Anthropic Messages API tool spec. */
export const searchMemoriesAnthropicTool = {
  name: "search_memories",
  description: SEARCH_TOOL_DESCRIPTION,
  input_schema: searchToolInputSchema,
};

/**
 * Execute the search_memories tool. Wire this into your chat handler so that
 * when the model emits a `search_memories` tool call, the parsed args are
 * passed here and the result is fed back as the tool response.
 */
export async function executeSearchMemories(
  userId: string,
  args: { query: string },
) {
  const result = await searchMemories(userId, args.query, { answer: false });
  return { documents: result.documents ?? [] };
}

/**
 * Vercel AI SDK tool factory. Returns a `search_memories` tool bound to the
 * given user. Pass into `streamText({ tools: { search_memories: ... } })`.
 */
export function searchMemoriesAITool(userId: string) {
  return tool({
    description: SEARCH_TOOL_DESCRIPTION,
    inputSchema: z.object({
      query: z
        .string()
        .describe("Natural-language search query, phrased as a question."),
    }),
    execute: async ({ query }) => executeSearchMemories(userId, { query }),
  });
}
