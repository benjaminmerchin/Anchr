# Anchr

> Your company has stories. Anchr tells them.

Anchr is the AI news anchor for product teams: it ingests your team's data through **Hyperspell** (Slack, Gmail, GitHub, Notion, Drive, Calendar) and the wider web through **Nia**, detects the stories worth telling, and ships polished video updates — auto-generated, on-brand, ready to post.

Built at the **Hyperspell × Nia "Company Brain" hackathon**.

## Live demo

🛰️ **<https://anchr-ten.vercel.app>**

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind v4 · shadcn/ui · Magic UI |
| Backend | Convex (DB, queries, actions, cron) |
| Auth | Convex Auth (Password + Anonymous) |
| AI | Vercel AI Gateway · Claude Sonnet 4.6 |
| Context | Hyperspell · Nia |

## Local setup

```bash
npm install
npx convex dev          # one-time: provisions your Convex cloud project
npm run dev             # starts Next.js on http://localhost:3000
```

Required env vars (auto-written by `npx convex dev` into `.env.local`):

```bash
NEXT_PUBLIC_CONVEX_URL=https://<your-project>.convex.cloud
CONVEX_DEPLOYMENT=<dev|prod>:<name>
```

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Public marketing landing |
| `/sign-in` | Email/password + one-click anonymous demo |
| `/dashboard` | Story feed (protected) |

## Deploy

Vercel build command (with Convex sync):

```bash
npx convex deploy --cmd 'next build' --preview-name $VERCEL_GIT_COMMIT_SHA
```

Set `CONVEX_DEPLOY_KEY` and `NEXT_PUBLIC_CONVEX_URL` in Vercel env vars.
