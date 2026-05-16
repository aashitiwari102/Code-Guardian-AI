import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { edgeCases } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/tests")({
  head: () => ({ meta: [{ title: "Edge Cases — CodeGuardian AI" }] }),
  component: Tests,
});

const frameworks = ["All", "Jest", "Pytest", "Postman"] as const;

function Tests() {
  const [fw, setFw] = useState<(typeof frameworks)[number]>("All");
  const filtered = fw === "All" ? edgeCases : edgeCases.filter((e) => e.framework === fw);

  return (
    <>
      <PageHeader
        eyebrow="intelligent edge cases"
        title="Tests your team forgot to write"
        description="Null inputs, injection payloads, oversized bodies, race conditions, Unicode chaos — generated and ready to drop in."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-brand-cream retro-border retro-shadow-pink">
            <Download className="h-4 w-4" /> Export bundle
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {frameworks.map((f) => (
          <button
            key={f}
            onClick={() => setFw(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold retro-border transition ${
              fw === f
                ? "bg-brand-pink text-white"
                : "bg-white text-brand-navy"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-3xl bg-white p-5 retro-border retro-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand-yellow px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-navy retro-border">
                {e.category}
              </span>
              <span className="font-mono text-xs text-muted-foreground)]">
                {e.framework}
              </span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">{e.name}</h3>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-brand-navy p-4 font-mono text-[12px] leading-relaxed text-brand-cream retro-border">
              <code>{e.code}</code>
            </pre>
          </motion.div>
        ))}
      </div>
    </>
  );
}