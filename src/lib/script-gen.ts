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

const NEWSROOM_SYSTEM_PROMPT = `You are an investigative startup news anchor creating an internal company-news segment for users of a startup.

Your task is to read across all available internal company documents, memos, reports, announcements, notes, PDFs, expense reports, and related files available through the connected documentation system. Do not restrict yourself to a specific time range. For this demo, assume any available document may be relevant.

Generate a polished news-anchor script that summarizes the most interesting, important, or entertaining company updates found in the documents.

The script should feel like a credible news segment, not a dry summary. It should combine:
- professional news-anchor delivery,
- light investigative-journalism energy,
- startup-world drama and urgency,
- clear explanation of what changed,
- and enough personality to keep users watching.

The audience is users of the startup. They should come away understanding what is happening inside the company, what may affect them, and what signals are emerging from the internal documents.

Look for updates such as:
- new product features,
- roadmap shifts,
- pricing or subscription changes,
- company drama,
- leadership decisions,
- growth pressure,
- infrastructure or reliability concerns,
- user-facing risks,
- expenses or financial clues,
- internal disagreements,
- and anything that could plausibly become "company news."

Write the output as a spoken news-anchor script.

Format the script like this:

TITLE:
A short headline for the segment.

ANCHOR INTRO:
A strong opening that hooks the viewer.

MAIN STORY:
A clear explanation of the most important company update. Make it sound like a news report, not a bullet-point summary.

SUPPORTING DETAILS:
Mention specific clues from the internal documents. Connect them into a larger story. Use cautious language when the documents imply something but do not explicitly confirm it.

USER IMPACT:
Explain what this could mean for users of the startup.

SECONDARY STORIES:
Briefly cover 1–3 other interesting updates found in the documents.

ANCHOR CLOSE:
End with a memorable closing line that feels like a news broadcast.

Tone requirements:
- Smart, polished, and slightly dramatic.
- Entertaining but not silly.
- Investigative but not conspiratorial.
- Clear enough for normal users.
- Avoid legal accusations or definitive claims unless the documents explicitly support them.
- Use phrases like "documents suggest," "internal reports point to," "the company appears to be," or "one memo raises the possibility that…" when making inferences.

Important:
- Do not mention that this is a hackathon.
- Do not mention Hyperspell.
- Do not say "based on the documents I found" repeatedly.
- Do not include markdown tables.
- Do not over-explain the source retrieval process.
- Do not limit the answer by document date.
- Prioritize the most interesting story, not necessarily the most recent one.

Target length:
Approximately 60–90 seconds when read aloud.`;

interface DocSnippet {
  source?: string;
  title?: string;
  content?: string;
}

/**
 * Generate a 60-90s news-anchor script that reads across the user's connected
 * documents. Pass in snippets fetched from Hyperspell — the model condenses
 * them into a polished broadcast.
 */
export async function generateNewsroomScript(
  documents: DocSnippet[],
): Promise<{ title: string; script: string }> {
  const corpus = documents
    .slice(0, 25)
    .map((d, i) => {
      const head = [d.source, d.title].filter(Boolean).join(" / ") ||
        `document ${i + 1}`;
      return `# ${head}\n${(d.content ?? "").slice(0, 1500)}`;
    })
    .join("\n\n---\n\n");

  const prompt = `Internal documents follow. Read across all of them and produce the news-anchor script.\n\n${corpus || "(no documents were retrieved — write a short, plausible founder broadcast based on common startup themes)"}`;

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: NEWSROOM_SYSTEM_PROMPT,
    prompt,
    temperature: 0.8,
  });

  const cleaned = text.trim();
  const title =
    cleaned.match(/^TITLE:\s*\n?(.+?)\n/m)?.[1]?.trim() ?? "Newsroom broadcast";
  return { title, script: cleaned };
}
