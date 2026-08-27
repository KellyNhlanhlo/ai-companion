import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className, extra }: { className?: string; extra?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-border bg-surface/70 px-4 py-3",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-coral" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        AI-generated content may contain errors. Review and verify important information before
        using it.
        {extra ? ` ${extra}` : ""}
      </p>
    </div>
  );
}
