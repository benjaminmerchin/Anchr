/**
 * Shared Convex deployment URL for the hackathon.
 *
 * The whole team points at the same backend so demos and seed data are
 * consistent. Teammates can override locally by setting
 * NEXT_PUBLIC_CONVEX_URL in .env.local — but they don't have to.
 */
export const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://neat-iguana-318.convex.cloud";
