import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Wand2, Check, Loader2, X, GitPullRequest, TrendingUp, Shield, Zap, FileCode } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { modernizations } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/modernize")({
  head: () => ({ meta: [{ title: "Modernize — CodeGuardian AI" }] }),
  component: Modernize,
});

const sevColor = {
  Critical: "var(--brand-pink)",
  High: "var(--brand-orange)",
  Medium: "var(--brand-yellow)",
} as const;

type ApplyState = "idle" | "applying" | "applied";

function Modernize() {
  const [applyStates, setApplyStates] = useState<Record<string, ApplyState>>({});
  const [showPRModal, setShowPRModal] = useState(false);
  const [prGenerating, setPrGenerating] = useState(false);
  const [prProgress, setPrProgress] = useState("");

  const handleApply = async (id: string) => {
    setApplyStates((prev) => ({ ...prev, [id]: "applying" }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setApplyStates((prev) => ({ ...prev, [id]: "applied" }));
  };

  const handleGeneratePR = async () => {
    setPrGenerating(true);
    setShowPRModal(true);

    const steps = [
      "Analyzing repository...",
      "Generating patch set...",
      "Calculating improvements...",
      "Creating PR summary...",
    ];

    for (const step of steps) {
      setPrProgress(step);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setPrGenerating(false);
  };

  const appliedCount = Object.values(applyStates).filter((s) => s === "applied").length;

  return (
    <>
      <PageHeader
        eyebrow="modernization"
        title="Before & after"
        description="AI-rewritten snippets with rationale. Apply individually or export as a single PR."
        actions={
          <button
            onClick={handleGeneratePR}
            className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-4 py-2 text-sm font-semibold text-white retro-border retro-shadow hover:bg-brand-orange transition-colors"
          >
            <Wand2 className="h-4 w-4" /> Generate PR
          </button>
        }
      />

      <div className="space-y-6">
        {modernizations.map((m, i) => {
          const state = applyStates[m.id] || "idle";
          return (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-3xl bg-white p-6 retro-border retro-shadow transition-all ${
                state === "applied" ? "ring-2 ring-green-500 ring-offset-2" : ""
              }`}
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

                <button
                  onClick={() => handleApply(m.id)}
                  disabled={state !== "idle"}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold retro-border transition-all ${
                    state === "idle"
                      ? "bg-brand-navy text-brand-cream hover:bg-brand-navy/90"
                      : state === "applying"
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                  } disabled:cursor-not-allowed`}
                >
                  {state === "idle" && (
                    <>
                      Apply <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                  {state === "applying" && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Applying...
                    </>
                  )}
                  {state === "applied" && (
                    <>
                      <Check className="h-3 w-3" />
                      Applied
                    </>
                  )}
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
          );
        })}
      </div>

      {/* PR Generation Modal */}
      <AnimatePresence>
        {showPRModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !prGenerating && setShowPRModal(false)}
              className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white retro-border retro-shadow"
              >
                {prGenerating ? (
                  // Loading State
                  <div className="p-12 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink/10 mb-6"
                    >
                      <Wand2 className="h-8 w-8 text-brand-pink" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-semibold text-brand-navy mb-2">
                      Generating Pull Request
                    </h3>
                    <p className="text-gray-600 font-medium">{prProgress}</p>
                  </div>
                ) : (
                  // PR Content
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-brand-pink/10 p-3">
                          <GitPullRequest className="h-6 w-6 text-brand-pink" />
                        </div>
                        <div>
                          <h2 className="font-display text-2xl font-semibold text-brand-navy">
                            Pull Request Ready
                          </h2>
                          <p className="text-sm text-gray-600">AI-generated modernization summary</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPRModal(false)}
                        className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    {/* PR Title */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        PR Title
                      </label>
                      <div className="rounded-xl bg-brand-cream p-4 retro-border">
                        <p className="font-mono text-sm text-brand-navy">
                          refactor: modernize legacy database and async workflows
                        </p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <MetricCard
                        icon={FileCode}
                        label="Files Changed"
                        value={`${appliedCount}/${modernizations.length}`}
                        color="blue"
                      />
                      <MetricCard
                        icon={Shield}
                        label="Security"
                        value="+42%"
                        color="green"
                      />
                      <MetricCard
                        icon={Zap}
                        label="Performance"
                        value="+28%"
                        color="yellow"
                      />
                      <MetricCard
                        icon={TrendingUp}
                        label="Maintainability"
                        value="+35%"
                        color="purple"
                      />
                    </div>

                    {/* Summary */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Summary of Improvements
                      </label>
                      <div className="rounded-xl bg-white border-2 border-gray-200 p-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Replaced deprecated mysql_query with PDO prepared statements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Modernized callback hell to async/await patterns</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Upgraded password hashing from MD5 to Argon2id</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>Migrated jQuery DOM manipulation to native APIs</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Commit Message */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Generated Commit Message
                      </label>
                      <div className="rounded-xl bg-brand-navy p-4 retro-border">
                        <pre className="font-mono text-xs text-brand-cream leading-relaxed">
{`refactor: modernize legacy database and async workflows

- Replace mysql_query with PDO prepared statements (eliminates SQL injection)
- Convert callback patterns to async/await (improves readability)
- Upgrade MD5 to Argon2id password hashing (OWASP recommended)
- Remove jQuery dependency in favor of native APIs (reduces bundle size)

Security: +42% | Performance: +28% | Maintainability: +35%
Risk Reduction: 78% → 34% (44 point improvement)`}
                        </pre>
                      </div>
                    </div>

                    {/* Risk Reduction */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                        Estimated Risk Reduction
                      </label>
                      <div className="rounded-xl bg-gradient-to-r from-red-500/10 to-green-500/10 p-4 retro-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">Legacy Risk Score</span>
                          <span className="text-2xl font-bold text-red-500">78%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: "78%" }}
                            animate={{ width: "34%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-red-500 to-green-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Modernized Risk Score</span>
                          <span className="text-2xl font-bold text-green-500">34%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white retro-border retro-shadow hover:bg-brand-orange transition-colors">
                        Create Pull Request
                      </button>
                      <button
                        onClick={() => setShowPRModal(false)}
                        className="rounded-full bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 retro-border hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: "blue" | "green" | "yellow" | "purple";
}) {
  const colorMap = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-600" },
    green: { bg: "bg-green-500/10", text: "text-green-600" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-600" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-600" },
  };

  const colors = colorMap[color];

  return (
    <div className="rounded-xl bg-gray-50 p-3 border-2 border-gray-200">
      <div className={`inline-flex rounded-lg ${colors.bg} p-2 mb-2`}>
        <Icon className={`h-4 w-4 ${colors.text}`} />
      </div>
      <div className={`text-xl font-bold ${colors.text}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

// Made with Bob
