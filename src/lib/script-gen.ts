import "server-only";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const TONE_SYSTEM_PROMPTS: Record<string, string> = {
  standard: `You are writing a spoken script for a polished business news anchor.
Write only the exact words the anchor will say out loud.
No stage directions, no markdown, no headers, no URLs.
Short clear sentences. Calm, credible, executive tone.
Structure: one strong opening line, two sentences of substance, one crisp close.`,

  breaking: `You are writing a spoken script for a high-energy breaking news anchor.
Write only the exact words the anchor will say out loud.
No stage directions, no markdown, no headers, no URLs.
Very short punchy sentences. Open with a shocking hook. Build urgency.
End with a memorable line. Speak like live television — urgent, credible, electric.`,

  founder: `You are writing a spoken script for a founder-style product update.
Write only the exact words the anchor will say out loud.
No stage directions, no markdown, no headers, no URLs.
First-person plural ("we shipped", "we hit"). Direct, warm, grateful.
Open with what shipped. Two sentences of substance. Close with what's next.`,
};

export type ScriptTone = keyof typeof TONE_SYSTEM_PROMPTS;

interface StoryBrief {
  title: string;
  summary: string;
  sourceKind?: string;
  evidence?: string[];
}

/**
 * Generate the spoken script for an Anchr broadcast from a story brief.
 * Aims for 25-45 seconds spoken — short enough to ship to short-form video.
 */
export async function generateAnchorScript(
  story: StoryBrief,
  options: { tone?: ScriptTone } = {},
): Promise<string> {
  const tone = options.tone ?? "founder";
  const system = TONE_SYSTEM_PROMPTS[tone];

  const evidence =
    story.evidence && story.evidence.length > 0
      ? `\nEvidence pulled from ${story.sourceKind ?? "source"}: ${story.evidence.join(", ")}.`
      : "";

  const prompt = `Topic brief — turn this into a 30-second on-camera script.

Headline: ${story.title}
Summary: ${story.summary}${evidence}`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system,
    prompt,
    temperature: 0.7,
  });

  return text.trim();
}
