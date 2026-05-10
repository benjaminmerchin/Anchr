<div align="center">

# Anchr

### *Your company has stories. Anchr tells them.*

A daily AI-generated news broadcast about your own startup — pulled from your real workspace data, narrated by an avatar, shipped to every platform.

**🛰️ Live demo →** **<https://anchr-ten.vercel.app>**

Built at the **Hyperspell × Nia "Company Brain" hackathon · 2026**

</div>

---

## What it does

Founders are silent shippers. Things go live — features merge, customers send glowing emails, milestones get hit — and nobody outside the company knows. Anchr fixes that without making anyone write content.

```
Slack · Gmail · GitHub · Notion · Drive · Calendar
                       │
                       ▼
              ┌─────────────────┐
              │   Hyperspell    │  ingest + memory
              └────────┬────────┘
                       │
                       ▼            ┌────────┐
              ┌─────────────────┐   │  Nia   │  competitive
              │    Anchr Agent  │◄──┤  (web) │  context
              │  (gpt-5.4)      │   └────────┘
              └────────┬────────┘
                       │ spoken script
                       ▼
              ┌─────────────────┐
              │     HeyGen      │  avatar render
              └────────┬────────┘
                       │ MP4
                       ▼
        Library · YouTube · TikTok · Instagram
```

Everything you see in the dashboard — the script, the avatar talking, the title, the thumbnail — was produced from your actual connected data, in about 90 seconds, without anyone writing a word.

## How it works

**1 — Connect.** Click *Connect sources* on the dashboard. Hyperspell handles OAuth into Slack, Gmail, GitHub, Notion, Drive and friends. Memories index in the background.

**2 — Ask, or wait.** Anchr can run two flows:

- **Per-story** — the dashboard surfaces "stories worth broadcasting" detected from your data. Click *Generate broadcast* on any of them and you get a 30-second founder-style update. While the script is being written, Nia is queried in parallel for "what did competitors just ship?" — if it finds something, the anchor adds a one-line comparison.
- **Newsroom** — one button at the top: *Generate now*. This runs an investigative-anchor prompt over **everything** Hyperspell has indexed for you and produces a polished 50-second segment with a TITLE, INTRO, MAIN STORY, USER IMPACT and ANCHOR CLOSE. Optionally schedule it to run every day at a UTC time of your choice.

**3 — Render.** The spoken script (just the spoken parts — section labels are stripped) is sent to HeyGen with a custom avatar + voice. The endpoint blocks until the MP4 is ready. Convex stores the URL, the thumbnail, the original script.

**4 — Publish.** One button. Stub today (TikTok / Instagram / YouTube auto-post all need platform partner approval that takes weeks), but the dashboard shows live status with mock share URLs so the loop is complete.

## Stack

| Layer | Tech | Why |
| --- | --- | --- |
| **Frontend** | Next.js 16 (App Router, Turbopack) · Tailwind v4 · shadcn/ui · Magic UI | Fast iteration, the densified landing was Magic UI showcase territory |
| **Hosting** | Vercel — auto-deploy on push, Convex sync built into build | `vercel.json` runs `npx convex deploy --cmd 'next build'` per commit |
| **Backend** | Convex (DB, mutations, actions, **schedules cron**) | Reactive queries make the dashboard update live as broadcasts render |
| **Auth** | Convex Auth (Password + Anonymous "Try the demo studio") | Anonymous lets judges click in without signing up |
| **Context — internal** | **Hyperspell** | Ingests Slack/Gmail/GitHub/Notion/Drive, exposes `/memories/query` for the chat agent and the broadcast scripter |
| **Context — external** | **Nia** | Indexes competitors so each story can include a "meanwhile, X just shipped" comparison |
| **Script gen** | OpenAI `gpt-5.4` via Vercel AI SDK | Founder tone for stories, investigative anchor tone for newsroom |
| **Video gen** | HeyGen v2 video generate + v1 status poll | Custom avatar + voice + auto-rendered thumbnail |
| **(Standby)** | FAL → Bytedance Seedance text-to-video | Wired and ready for B-roll generation |

## Differentiators we built today

- **Trigger-based publishing** — story detected → ~90s later, polished video sitting in your library, waiting for a click. Founders never have to think about content.
- **Competitive hooks via Nia** — Anchr's anchor naturally drops "while others were still figuring out X, we just shipped Y" lines when Nia surfaces a real comparison.
- **Voice consistency** — script tone is constrained per use case (founder, breaking, investigative anchor) and capped at ~1 minute spoken to keep videos short and punchy.
- **One library, all broadcasts** — newsroom-wide and per-story videos live in the same gallery, with thumbnails pulled from HeyGen, click-to-play inline, download, publish-to-all stub.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Marketing landing (signed-out only — signed-in users redirect to /dashboard) |
| `/sign-in` | Email + password OR one-click anonymous "Try the demo studio" |
| `/dashboard` | The whole studio: newsroom button, library, story feed, schedule controls |
| `/api/chat` | (Internal) Hyperspell-augmented chat agent with `search_memories` tool |
| `/api/admin/backfill-thumbnails` | One-shot helper to backfill `thumbnailUrl` on legacy broadcasts |

## Run it locally

```bash
git clone https://github.com/benjaminmerchin/Anchr.git
cd Anchr
npm install
npm run dev          # http://localhost:3000
```

`NEXT_PUBLIC_CONVEX_URL` defaults to the shared hackathon backend, so a fresh clone Just Works without a `.env.local`. To override or to use other API keys (Hyperspell, Nia, OpenAI, HeyGen, FAL), copy `.env.local.example` and fill it in.

## Deploy

Vercel auto-deploys every push to `main`. The custom build command in `vercel.json` deploys Convex first, then runs `next build` against the freshly synced backend:

```bash
npx convex deploy --cmd 'next build' --preview-name anchr-dev
```

Required Vercel env vars:

```
NEXT_PUBLIC_CONVEX_URL=https://neat-iguana-318.convex.cloud
CONVEX_DEPLOY_KEY=preview:...     # for the convex deploy step
HYPERSPELL_API_KEY=hs2-...
OPENAI_API_KEY=sk-proj-...
HEYGEN_API_KEY=sk_V2_...
HEYGEN_AVATAR_ID=...
HEYGEN_VOICE_ID=...
FAL_KEY=...
NIA_API_KEY=nk_...
```

JWT secrets for Convex Auth (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`) live on the **Convex deployment's** environment, not Vercel's.

## File map

```
convex/
├─ schema.ts         users · sources · stories · broadcasts · schedules
├─ auth.ts           Convex Auth (Password + Anonymous)
├─ broadcasts.ts     list · getForStory · getLatestNewsroom · startRendering · setReady
│                    setFailed · setThumbnail · markPublished · remove
├─ stories.ts        list · create · seedDemo
├─ schedules.ts      getMine · upsert
├─ users.ts          viewerId
├─ crons.ts          hourly scan-newsroom-schedules
└─ http.ts           Convex Auth HTTP routes

src/lib/
├─ heygen.ts         submitHeyGenVideo · pollHeyGenVideo · generateHeyGenVideo
├─ hyperspell.ts     getHyperspellAdminClient · getHyperspellForCurrentUser
│                    getInstalledSources · searchMemories · searchMemoriesAITool
├─ nia.ts            searchCompetitiveContext (web mode, fail-soft)
└─ script-gen.ts     generateAnchorScript (founder/standard/breaking)
                     generateNewsroomScript (investigative anchor)

src/app/
├─ page.tsx                          marketing landing
├─ dashboard/page.tsx                studio (newsroom + library + stories)
├─ sign-in/page.tsx                  password + anonymous "Try the demo"
├─ actions/broadcast.ts              generateBroadcast · generateNewsroomBroadcast
├─ actions/hyperspell.ts             getHyperspellToken (admin client)
├─ api/chat/route.ts                 RAG chat agent
└─ api/debug/me/route.ts             diagnostic: env presence + Hyperspell status

src/components/
├─ newsroom-panel.tsx                generate-now + daily schedule
├─ broadcast-library.tsx             grid of every video, click-to-play, delete
├─ broadcast-panel.tsx               per-story render trigger + status
├─ anchr-logo.tsx · anchr-chat.tsx · data-flow.tsx · script-preview.tsx · …
```

## Sponsors used

- **Hyperspell** — the company brain. Connectors for every workspace tool, semantic search across all of it.
- **Nia** — the external context layer. Web-mode search per story for the competitive comparison line.
- **HeyGen** — the on-camera anchor. Custom avatar + voice + thumbnail.
- **OpenAI** — `gpt-5.4` for both script tones.
- **Convex** — the entire backend (DB, auth, mutations, reactive queries, daily cron).
- **Vercel** — hosting, AI SDK, Convex-aware build pipeline.

## Team

Built by **Benjamin Merchin**, **Johan Lossius**, and **Hel5inki** — three people, one weekend, one news studio.

---

<sub>If you liked the demo and want to ship Anchr at your company: ping us. We have ideas about voice cloning the founder, scheduled multi-platform posts, and per-employee personalized weekly digests that we ran out of time to build today.</sub>
