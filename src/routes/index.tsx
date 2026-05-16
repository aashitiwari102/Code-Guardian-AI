import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Upload,
  Sparkles,
  ShieldAlert,
  TestTube2,
  Wand2,
  Network,
  FileDown,
  Github,
  Zap,
} from "lucide-react";
import { MarketingNav } from "@/components/MarketingNav.tsx";
import { HeroMock } from "@/components/HeroMock";
import { Blobs } from "@/components/Blobs";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeGuardian AI — Modernize, Secure, Stress-Test Any Codebase" },
      {
        name: "description",
        content:
          "AI senior engineer + security auditor + QA in one. Upload any legacy repo and get modernization plans, edge-case tests, and a vulnerability heatmap.",
      },
      { property: "og:title", content: "CodeGuardian AI" },
      {
        property: "og:description",
        content: "Modernize, secure, and stress-test any codebase with AI.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Wand2,
    title: "Legacy Modernizer",
    body: "Turn mysql_query, callback hell, and dead jQuery into modern, safer code.",
    color: "var(--brand-pink)",
  },
  {
    icon: TestTube2,
    title: "Edge-Case Generator",
    body: "Jest, Pytest & Postman tests for nulls, injections, races, Unicode and more.",
    color: "var(--brand-teal)",
  },
  {
    icon: ShieldAlert,
    title: "Vulnerability Scanner",
    body: "CWE-mapped findings with severity, exploit notes, and remediation.",
    color: "var(--brand-orange)",
  },
  {
    icon: Network,
    title: "Architecture Map",
    body: "Interactive dependency graph that exposes risky modules at a glance.",
    color: "var(--brand-yellow)",
  },
  {
    icon: Sparkles,
    title: "AI Explanations",
    body: "Every finding comes with plain-English reasoning your team will trust.",
    color: "var(--brand-pink)",
  },
  {
    icon: FileDown,
    title: "Export Reports",
    body: "Ship audit-ready PDFs, JSON, and test bundles straight to your repo.",
    color: "var(--brand-teal)",
  },
];

const workflow = [
  { icon: Upload, label: "Upload repo or ZIP" },
  { icon: Sparkles, label: "AI Analysis" },
  { icon: ShieldAlert, label: "Vulnerability Scan" },
  { icon: TestTube2, label: "Edge-Case Tests" },
  { icon: Wand2, label: "Modernization Plan" },
  { icon: FileDown, label: "Export Reports" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-navy">
      {/* HERO */}
      <section className="relative overflow-hidden grain">
        <Blobs />
        <MarketingNav />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-12 md:grid-cols-2 md:pt-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold retro-border"
            >
              <Zap className="h-3.5 w-3.5 text-brand-pink" />
              Powered by IBM Bob MCP servers
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 font-display text-5xl font-bold leading-[1.05] md:text-7xl"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              Modernize.{" "}
              <span className="inline-block -rotate-2 rounded-2xl bg-brand-pink px-3 text-white">
                Secure.
              </span>{" "}
              Stress-test
              <br />
              any codebase.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-6 max-w-lg text-lg text-muted-foreground"
            >
              CodeGuardian AI is your senior engineer, security auditor, and QA — bundled
              into one delightful tool. Upload a legacy repo, get a modernization plan,
              edge-case tests, and a vulnerability heatmap in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-brand-pink px-6 py-3 text-sm font-semibold text-white retro-border retro-shadow transition-transform hover:-translate-y-0.5"
              >
                Try the demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold retro-border transition-transform hover:-translate-y-0.5"
              >
                <Github className="h-4 w-4" /> See features
              </a>
            </motion.div>

            <div className="mt-10 flex items-center gap-6">
              {[
                { n: "412", l: "files scanned" },
                { n: "47", l: "issues found" },
                { n: "11s", l: "avg report" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl font-bold">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <HeroMock />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-pink">
                — what it does
              </span>
              <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
                A whole SDLC team, in one box.
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground">
              Six AI agents, orchestrated through IBM Bob MCP servers, working together on
              your repository in real time.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl bg-white p-6 retro-border retro-shadow"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl retro-border transition-transform group-hover:-rotate-6"
                  style={{ background: f.color }}
                >
                  <f.icon className="h-6 w-6 text-white" strokeWidth={2.4} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section
        id="workflow"
        className="relative grain px-6 py-24"
        style={{ background: "var(--brand-navy)" }}
      >
        <div className="relative z-10 mx-auto max-w-7xl text-brand-cream">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-yellow">
              — the flow
            </span>
            <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              From legacy chaos to modern, safe code.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {workflow.map((w, i) => (
              <motion.div
                key={w.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <div className="rounded-2xl bg-brand-cream p-5 text-brand-navy retro-border">
                  <div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl retro-border"
                    style={{
                      background: [
                        "var(--brand-pink)",
                        "var(--brand-orange)",
                        "var(--brand-yellow)",
                        "var(--brand-teal)",
                        "var(--brand-pink)",
                        "var(--brand-orange)",
                      ][i],
                    }}
                  >
                    <w.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="mt-4 font-mono text-xs text-muted-foreground">
                    Step 0{i + 1}
                  </div>
                  <div className="font-display text-lg font-semibold">{w.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STACK / CTA */}
      <section id="stack" className="relative px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-brand-pink p-10 retro-border retro-shadow text-white md:p-14">
          <h2 className="font-display text-4xl font-bold md:text-6xl">
            Ready to audit your repo?
          </h2>
          <p className="mt-4 max-w-xl text-white/90">
            Drop a GitHub URL or ZIP and get a modernization plan, edge-case test bundle,
            and a CWE-mapped vulnerability report — all visualized.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-brand-cream retro-border"
            >
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy retro-border"
            >
              View features
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-brand-navy bg-brand-cream px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeGuardian AI · Built for hackathons, made for engineers.
          </p>
        </div>
      </footer>
    </div>
  );
}
