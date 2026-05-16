import { motion } from "framer-motion";
import { ShieldAlert, Sparkles, Bug, Wand2 } from "lucide-react";

export function HeroMock() {
  return (
    <div className="relative h-130 w-full">
      {/* Floating shapes */}
      <motion.div
        className="absolute -left-6 top-10 h-16 w-16 rounded-2xl retro-border"
        style={{ background: "var(--brand-yellow)" }}
        animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-4 top-0 h-10 w-10 rounded-full retro-border"
        style={{ background: "var(--brand-pink)" }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-2 left-10 h-12 w-12 rotate-12 retro-border"
        style={{ background: "var(--brand-teal)" }}
        animate={{ rotate: [12, -8, 12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main dashboard card */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute left-4 top-12 w-[88%] rounded-3xl bg-white retro-border retro-shadow p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand-pink" />
            <span className="h-3 w-3 rounded-full bg-brand-yellow" />
            <span className="h-3 w-3 rounded-full bg-brand-teal" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            acme-billing-legacy
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "Risk", value: "78", color: "var(--brand-pink)", icon: ShieldAlert },
            { label: "Issues", value: "47", color: "var(--brand-orange)", icon: Bug },
            { label: "Fixes", value: "24", color: "var(--brand-teal)", icon: Wand2 },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl retro-border p-3" style={{ background: s.color }}>
              <s.icon className="h-4 w-4 text-white" />
              <div className="mt-2 font-display text-2xl font-bold text-white">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/90">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl retro-border bg-brand-cream p-3 font-mono text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 text-brand-pink">
            <Sparkles className="h-3 w-3" /> AI suggestion
          </div>
          <div className="mt-1">
            <span className="text-red-500 line-through">mysql_query($q)</span>{" "}
            <span className="text-brand-teal">→ $pdo-&gt;prepare($q)</span>
          </div>
          <div className="text-muted-foreground">
            CWE-89 · Critical · 14 callsites
          </div>
        </div>

        <div className="mt-3 grid grid-cols-12 gap-1">
          {Array.from({ length: 36 }).map((_, i) => {
            const c =
              i % 9 === 0
                ? "var(--brand-pink)"
                : i % 5 === 0
                ? "var(--brand-yellow)"
                : i % 3 === 0
                ? "var(--brand-teal)"
                : "#E8DEC4";
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.015 }}
                className="h-4 rounded retro-border"
                style={{ background: c }}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Floating code card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute -right-4 bottom-4 w-64 rotate-3 rounded-2xl bg-brand-navy p-4 retro-border retro-shadow-pink"
      >
        <div className="font-mono text-[11px] text-brand-cream">
          <span className="text-brand-pink">+ </span>await chargeUser()
          <br />
          <span className="text-brand-teal">✓ </span>edge case generated
          <br />
          <span className="text-brand-yellow">⚠ </span>jQuery 1.9.1 outdated
        </div>
      </motion.div>
    </div>
  );
}