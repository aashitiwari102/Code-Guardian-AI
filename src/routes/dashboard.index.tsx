import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Bug,
  TestTube2,
  Activity,
  ArrowUpRight,
  GitBranch,
  Github,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  fileRisks,
  repoSummary,
  vulnerabilities,
  modernizations,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Overview — CodeGuardian AI" }],
  }),
  component: Overview,
});

function Overview() {
  const stats = [
    { label: "Risk score", value: repoSummary.riskScore, suffix: "/100", color: "var(--brand-pink)", icon: ShieldAlert },
    { label: "Vulnerabilities", value: vulnerabilities.length, color: "var(--brand-orange)", icon: Bug },
    { label: "Modernizations", value: modernizations.length, color: "var(--brand-teal)", icon: Activity },
    { label: "Test coverage", value: repoSummary.coverage, suffix: "%", color: "var(--brand-yellow)", icon: TestTube2 },
  ];

  return (
    <>
      <PageHeader
        eyebrow="repository"
        title={repoSummary.name}
        description="An AI senior engineer just finished reading every file. Here's the situation."
        actions={
          <div className="flex flex-wrap gap-2">
            <a className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold retro-border" href="#">
              <Github className="h-4 w-4" /> {repoSummary.url}
            </a>
            <button className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream retro-border retro-shadow-pink">
              Export report <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-3xl bg-white p-5 retro-border retro-shadow"
          >
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl retro-border"
              style={{ background: s.color }}
            >
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div className="mt-5 font-display text-4xl font-bold">
              {s.value}
              <span className="text-xl text-muted-foreground">{s.suffix ?? ""}</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 retro-border retro-shadow lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Risk heatmap</h2>
            <div className="flex items-center gap-3 text-xs">
              <Dot color="var(--brand-pink)" /> Critical
              <Dot color="var(--brand-yellow)" /> Warning
              <Dot color="var(--brand-teal)" /> Stable
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {fileRisks.map((f, i) => {
              const bg =
                f.severity === "critical"
                  ? "var(--brand-pink)"
                  : f.severity === "warning"
                  ? "var(--brand-yellow)"
                  : "var(--brand-teal)";
              const fg = f.severity === "warning" ? "var(--brand-navy)" : "white";
              return (
                <motion.div
                  key={f.path}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-4 retro-border"
                  style={{ background: bg, color: fg }}
                >
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <GitBranch className="h-3 w-3" />
                    <span className="truncate font-mono">{f.path}</span>
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold">{f.legacyScore}</div>
                  <div className="text-[11px] uppercase tracking-wider opacity-80">
                    {f.issues} issues · {f.loc.toLocaleString()} loc
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-brand-navy p-6 text-brand-cream retro-border">
            <h3 className="font-display text-xl font-semibold">Detected stack</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {repoSummary.techStack.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono">
                  {t}
                </span>
              ))}
            </div>
            <h4 className="mt-6 font-display text-sm uppercase tracking-wider text-brand-yellow">
              Deprecated APIs
            </h4>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {repoSummary.deprecated.map((d) => (
                <li key={d}>· {d}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-brand-yellow p-6 retro-border">
            <h3 className="font-display text-xl font-semibold">Top action items</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>· Patch SQL injection in Queries.php</li>
              <li>· Replace MD5 password hashing</li>
              <li>· Add CSRF tokens on Invoice routes</li>
              <li>· Upgrade jQuery 1.9 → native APIs</li>
            </ul>
            <Link
              to="/dashboard/security"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-brand-cream"
            >
              Review all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />;
}