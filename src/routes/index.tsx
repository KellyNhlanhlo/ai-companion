import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Mail, Search, Sparkles, Zap, Pencil, LayoutGrid } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace — Your AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Write better emails, research smarter and get instant workplace assistance from one simple AI workspace.",
      },
      { property: "og:title", content: "AI Workplace — Your AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Write better emails, research smarter and get instant workplace assistance from one simple AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    text: "Write polished workplace emails in seconds.",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    text: "Summarize topics and generate useful insights.",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chat",
    text: "Get instant assistance with everyday workplace tasks.",
  },
] as const;

const STATS = [
  { icon: LayoutGrid, value: "3", label: "AI Tools" },
  { icon: Zap, value: "Instant", label: "Responses" },
  { icon: Pencil, value: "100%", label: "Editable" },
] as const;

function Dashboard() {
  return (
    <AppLayout>
      <section className="bg-hero-glow relative overflow-hidden rounded-3xl border border-border px-6 py-14 sm:px-10 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          One workspace, three AI tools
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
          Your <span className="text-gradient-brand">AI workplace</span> assistant
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Write better emails, research smarter, and get instant workplace assistance — all from one
          simple workspace.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <Link to="/email">
              Start with Email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="surface" size="lg">
            <Link to="/chat">Open AI Chat</Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="card-surface group flex flex-col gap-3 p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
          >
            <span className="bg-gradient-brand flex size-11 items-center justify-center rounded-xl">
              <Icon className="size-5 text-primary-foreground" />
            </span>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-primary">
              Open tool
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="card-surface flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface">
              <Icon className="size-5 text-violet" />
            </span>
            <div>
              <p className="text-xl font-semibold">{value}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <AiDisclaimer className="mt-6" />
    </AppLayout>
  );
}
