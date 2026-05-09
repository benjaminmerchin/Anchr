"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Dashboard chat panel. Streams responses from /api/chat, which has the
 * Hyperspell `search_memories` tool wired in — so the assistant can pull from
 * the viewer's connected accounts before answering.
 */
export function AnchrChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
        <Sparkles className="size-3.5 text-white/60" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
          Ask Anchr
        </p>
      </div>

      <div className="flex max-h-[420px] min-h-[200px] flex-col gap-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-white/40">
            Try: <span className="font-mono text-white/60">&ldquo;What did the eng team ship this week?&rdquo;</span>
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex flex-col gap-1 text-sm leading-relaxed",
              m.role === "user" ? "items-end" : "items-start",
            )}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
              {m.role === "user" ? "you" : "anchr"}
            </span>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5",
                m.role === "user"
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/[0.03] text-white/85",
              )}
            >
              {m.parts.map((part, i) => {
                if (part.type === "text") {
                  return <span key={i}>{part.text}</span>;
                }
                if (part.type.startsWith("tool-")) {
                  // @ts-expect-error tool parts carry state at runtime
                  const state: string = part.state ?? "";
                  return (
                    <span
                      key={i}
                      className="mr-1 inline-flex items-center rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-white/55"
                    >
                      {state === "output-available"
                        ? "searched memories"
                        : "searching memories…"}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || isStreaming) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex items-center gap-2 border-t border-white/5 px-3 py-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about anything in your connected accounts…"
          className="flex-1 border-white/10 bg-white/[0.02] text-sm text-white placeholder:text-white/35"
          disabled={isStreaming}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isStreaming}
          className="rounded-full bg-white text-xs text-black hover:bg-white/90 disabled:opacity-40"
        >
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}
