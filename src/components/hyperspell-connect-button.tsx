"use client";

import { useState } from "react";
import { Plug } from "lucide-react";

import type { HyperspellTokenResult } from "@/app/actions/hyperspell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  /** Server action that mints a Hyperspell user token. */
  getToken: () => Promise<HyperspellTokenResult>;
  className?: string;
  label?: string;
}

/**
 * Anchr-styled "Connect sources" button. Mints a Hyperspell user token via
 * the provided server action, then redirects the user to Hyperspell Connect
 * so they can authorize their accounts (Gmail, Slack, GitHub, Notion, …).
 */
export function HyperspellConnectButton({
  getToken,
  className,
  label = "Connect sources",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const result = await getToken();
      if (!result.ok) {
        alert(`Failed to connect (${result.stage}):\n\n${result.message}`);
        setLoading(false);
        return;
      }
      const redirectUri = `${window.location.origin}/dashboard`;
      window.location.href = `https://connect.hyperspell.com?token=${result.token}&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}`;
    } catch (error) {
      console.error("Unexpected error contacting server action:", error);
      const message =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Unexpected error:\n\n${message}`);
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleConnect}
      disabled={loading}
      className={cn(
        "rounded-full border border-white/15 bg-white/[0.03] text-xs text-white/80 hover:bg-white/[0.08] hover:text-white",
        className,
      )}
    >
      <Plug className="mr-1 size-3.5" />
      {loading ? "Connecting…" : label}
    </Button>
  );
}
