import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, SendHorizonal, Trash2, User } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateChatReply } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat | AI Workplace" },
      {
        name: "description",
        content:
          "A workplace AI chat that completes the task immediately — emails, research briefs, rewrites and presentation prep.",
      },
      { property: "og:title", content: "AI Chat | AI Workplace" },
      {
        property: "og:description",
        content: "Instant workplace assistance for emails, research and everyday tasks.",
      },
    ],
  }),
  component: ChatPage,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Help me write a professional email.",
  "Research the impact of AI in the workplace.",
  "Help me prepare for a presentation.",
  "Rewrite this message professionally.",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: value };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: generateChatReply(value) },
      ]);
      setThinking(false);
    }, 600);
  };

  return (
    <AppLayout>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="bg-gradient-brand hidden size-12 items-center justify-center rounded-2xl sm:flex">
            <Bot className="size-5 text-primary-foreground" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">AI Chat</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Give an instruction and it gets done — no back-and-forth questions.
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="surface" onClick={() => setMessages([])}>
            <Trash2 className="size-4" /> Clear conversation
          </Button>
        )}
      </header>

      <section className="card-surface mt-8 flex h-[62vh] min-h-[26rem] flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !thinking && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="bg-gradient-brand flex size-14 items-center justify-center rounded-2xl shadow-[var(--shadow-glow)]">
                <Bot className="size-6 text-primary-foreground" />
              </span>
              <div>
                <p className="text-base font-semibold">How can I help you work faster?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pick a suggestion below or type your own instruction.
                </p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                  <Bot className="size-4 text-primary" />
                </span>
              )}
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                  m.role === "user"
                    ? "bg-gradient-brand text-primary-foreground"
                    : "border border-border bg-surface text-foreground",
                )}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                  <User className="size-4 text-violet" />
                </span>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex gap-3">
              <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                <Bot className="size-4 text-primary" />
              </span>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Working on it…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/60 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything, or give a task…"
              className="max-h-40 min-h-12 flex-1 resize-none"
            />
            <Button
              variant="hero"
              size="icon"
              className="size-12 rounded-xl"
              onClick={() => send(input)}
              disabled={thinking || !input.trim()}
              aria-label="Send message"
            >
              <SendHorizonal className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      <AiDisclaimer className="mt-6" />
    </AppLayout>
  );
}
