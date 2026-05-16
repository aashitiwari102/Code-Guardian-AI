import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { modernizations } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/modernize")({
  head: () => ({ meta: [{ title: "Modernize — CodeGuardian AI" }] }),
  component: Modernize,
});

const sevColor = {
  Critical: "var(--brand-pink)",
  High: "var(--brand-orange)",
  Medium: "var(--brand-yellow)",
} as const;

function Modernize() {
  return (
    <>
      <PageHeader
        eyebrow="modernization"
        title="Before & after"
        description="AI-rewritten snippets with rationale. Apply individually or export as a single PR."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white retro-border retro-shadow">
            <Wand2 className="h-4 w-4" /> Generate PR
          </button>
        }
      />

      <div className="space-y-6">
        {modernizations.map((m, i) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-3xl bg-white p-6 retro-border retro-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                  style={{ background: sevColor[m.severity] }}
                >
                  {m.severity}
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold">{m.title}</h3>
                <code className="font-mono text-xs text-muted-foreground">{m.file}</code>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-3 py-1.5 text-xs font-semibold text-brand-cream retro-border">
                Apply <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <CodePane label="Legacy" tone="pink" code={m.before} />
              <CodePane label="Modernized" tone="teal" code={m.after} />
            </div>

            <div className="mt-4 rounded-2xl bg-brand-cream p-4 retro-border text-sm">
              <span className="font-semibold">Why: </span>
              {m.rationale}
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}

function CodePane({ label, tone, code }: { label: string; tone: "pink" | "teal"; code: string }) {
  const bg = tone === "pink" ? "var(--brand-pink)" : "var(--brand-teal)";
  return (
    <div className="overflow-hidden rounded-2xl bg-brand-navy retro-border">
      <div
        className="flex items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white"
        style={{ background: bg }}
      >
        <span>{label}</span>
        <span className="font-mono opacity-80">.diff</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-brand-cream">
        <code>{code}</code>
      </pre>
    </div>
  );
}