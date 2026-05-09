import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";

import {
  getHyperspellForCurrentUser,
  getInstalledSources,
  searchMemoriesAITool,
} from "@/lib/hyperspell";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are Anchr's newsroom assistant. You help the user
surface stories worth broadcasting from across their connected accounts
(Gmail, Slack, GitHub, Notion, Drive, Calendar, Linear, uploaded files).

Whenever a question might depend on the user's personal or work data, call the
\`search_memories\` tool BEFORE answering. Phrase the tool query as a
natural-language question. After tool results return, cite specific snippets
in your answer and keep responses tight — bullet sources, no fluff.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // This throws if the viewer is not signed in via Convex auth.
  const { client, userId } = await getHyperspellForCurrentUser();
  // Hyperspell defaults to an empty `vault` collection when sources are not
  // specified — always scope searches to what the user actually connected.
  const sources = await getInstalledSources(client);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      search_memories: searchMemoriesAITool(userId, sources),
    },
    // Allow the model to chain: search → reason → optionally search again → answer.
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
