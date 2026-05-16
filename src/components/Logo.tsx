import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-pink retro-border retro-shadow transition-transform group-hover:-rotate-6">
        <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span
        className={`font-display text-xl font-700 ${
          light ? "text-brand-cream" : "text-brand-navy"
        }`}
        style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 600 }}
      >
        CodeGuardian<span className="text-brand-pink">.</span>AI
      </span>
    </Link>
  );
}