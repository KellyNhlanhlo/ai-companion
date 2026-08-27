import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Copy,
  Lightbulb,
  ListChecks,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/app-layout";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch, researchToText, type ResearchResult } from "@/lib/ai-engine";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace" },
      {
        name: "description",
        content:
          "Turn any question, topic or pasted article into a structured brief with insights, risks, recommendations and takeaways.",
      },
      { property: "og:title", content: "AI Research Assistant | AI Workplace" },
      {
        property: "og:description",
        content: "Structured summaries, insights, risks and recommendations in seconds.",
      },
    ],
  }),
  component: ResearchPage,
});

const SECTIONS = [
  { key: "insights", label: "Key Insights", icon: Lightbulb },
  { key: "benefits", label: "Benefits / Opportunities", icon: TrendingUp },
  { key: "risks", label: "Risks / Challenges", icon: AlertTriangle },
  { key: "recommendations", label: "Recommendations", icon: Target },
  { key: "takeaways", label: "Key Takeaways", icon: ListChecks },
] as const;

function ResearchPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    if (input.trim().length < 5) {
      setError("Enter a question, topic or paste some content to research.");
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      try {
        const r = generateResearch(input);
        setResult(r);
        setSummary(r.summary);
      } catch {
        setError("Something went wrong while analysing that. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 650);
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(researchToText({ ...result, summary }));
      toast.success("Research brief copied");
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  const clear = () => {
    setInput("");
    setResult(null);
    setSummary("");
    setError(null);
  };

  return (
    <AppLayout>
      <header className="flex items-start gap-4">
        <span className="bg-gradient-brand hidden size-12 items-center justify-center rounded-2xl sm:flex">
          <Search className="size-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">AI Research Assistant</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Ask a question, name a topic, or paste an article. You'll get a structured brief
            straight away.
          </p>
        </div>
      </header>

      <section className="card-surface mt-8 flex flex-col gap-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="research">What would you like to research?</Label>
          <Textarea
            id="research"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Research the impact of AI in the workplace — or paste an article here to summarize it."
            className="min-h-44 resize-y"
          />
        </div>

        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="hero" size="lg" onClick={run} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Analysing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Research
              </>
            )}
          </Button>
          {result && (
            <>
              <Button variant="surface" size="lg" onClick={copy}>
                <Copy className="size-4" /> Copy
              </Button>
              <Button variant="surface" size="lg" onClick={run}>
                <RefreshCw className="size-4" /> Regenerate
              </Button>
              <Button variant="ghost" size="lg" onClick={clear}>
                <Trash2 className="size-4" /> Clear
              </Button>
            </>
          )}
        </div>
      </section>

      {loading && (
        <div className="card-surface mt-6 space-y-3 p-6">
          <div className="h-6 w-1/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-24 animate-pulse rounded-xl bg-muted" />
        </div>
      )}

      {!loading && !result && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-surface">
            <Search className="size-5 text-muted-foreground" />
          </span>
          <p className="text-sm font-medium">Nothing researched yet</p>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Your summary, insights, benefits, risks, recommendations and takeaways will appear here.
          </p>
        </div>
      )}

      {!loading && result && (
        <div className="mt-6 space-y-4">
          <div className="card-surface p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold">{result.title}</h2>
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground">
                {result.mode === "document" ? "Summary of your pasted text" : "Topic briefing"}
              </span>
            </div>
            <Label htmlFor="summary" className="mt-4 block">
              Summary (editable)
            </Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-2 min-h-32 resize-y leading-relaxed"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <div key={key} className="card-surface p-6">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-surface">
                    <Icon className="size-4 text-primary" />
                  </span>
                  {label}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {result[key].map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <AiDisclaimer
        className="mt-6"
        extra="This assistant does not browse the internet — results are generated locally, so independently verify any facts, figures or claims before relying on them."
      />
    </AppLayout>
  );
}
