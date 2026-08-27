import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Mail, RefreshCw, Sparkles, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, type Tone } from "@/lib/ai-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace" },
      {
        name: "description",
        content:
          "Describe your email in plain language and instantly get a complete, editable subject line and professional email body.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace" },
      {
        property: "og:description",
        content: "Instantly generate complete, editable workplace emails in any tone.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES: { value: Tone; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
];

const EXAMPLE = "Write an email to my boss reminding him about tomorrow's meeting.";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [senderName, setSenderName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  const run = () => {
    if (!prompt.trim()) {
      setError("Tell me what the email is about and I'll write the whole thing for you.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      try {
        const email = generateEmail({ recipient, senderName, prompt, tone });
        setSubject(email.subject);
        setBody(email.body);
        setHasResult(true);
      } catch {
        setError("Something went wrong while generating your email. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 550);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  const clear = () => {
    setRecipient("");
    setSenderName("");
    setPrompt("");
    setSubject("");
    setBody("");
    setHasResult(false);
    setError(null);
  };

  return (
    <AppLayout>
      <header className="flex items-start gap-4">
        <span className="bg-gradient-brand hidden size-12 items-center justify-center rounded-2xl sm:flex">
          <Mail className="size-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Smart Email Generator</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Describe the email in plain language. You'll get a complete subject line and body —
            ready to copy and send.
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="card-surface flex flex-col gap-5 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient (optional)</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Mr. Dlamini"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender">Your name (optional)</Label>
              <Input
                id="sender"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Nonhlanhla"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">What is the email about?</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={EXAMPLE}
              className="min-h-40 resize-y"
            />
            <button
              type="button"
              onClick={() => setPrompt(EXAMPLE)}
              className="text-xs text-primary transition-colors hover:text-violet"
            >
              Try an example →
            </button>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTone(t.value)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-medium transition-all",
                    tone === t.value
                      ? "border-primary/60 bg-accent text-foreground shadow-[var(--shadow-glow)]"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              {error}
            </p>
          )}

          <Button variant="hero" size="lg" onClick={run} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Writing your email…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate email
              </>
            )}
          </Button>
        </section>

        <section className="card-surface flex min-h-[28rem] flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Generated email
            </h2>
            {hasResult && (
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                Editable
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-1 flex-col gap-3">
              <div className="h-10 animate-pulse rounded-xl bg-muted" />
              <div className="flex-1 animate-pulse rounded-xl bg-muted" />
            </div>
          ) : hasResult ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="flex flex-1 flex-col space-y-2">
                <Label htmlFor="body">Email body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-72 flex-1 resize-y leading-relaxed"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="hero" onClick={copy}>
                  <Copy className="size-4" /> Copy
                </Button>
                <Button variant="surface" onClick={run}>
                  <RefreshCw className="size-4" /> Regenerate
                </Button>
                <Button variant="ghost" onClick={clear}>
                  <Trash2 className="size-4" /> Clear
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface">
                <Mail className="size-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-medium">No email yet</p>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                Describe your email on the left and press Generate. The subject line is written for
                you automatically.
              </p>
            </div>
          )}
        </section>
      </div>

      <AiDisclaimer className="mt-6" />
    </AppLayout>
  );
}
