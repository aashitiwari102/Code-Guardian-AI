import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wand2,
  TestTube2,
  ShieldAlert,
  Network,
  Upload,
} from "lucide-react";
import { Logo } from "./Logo.tsx";

const items = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/modernize", label: "Modernize", icon: Wand2 },
  { to: "/dashboard/tests", label: "Edge Cases", icon: TestTube2 },
  { to: "/dashboard/security", label: "Security", icon: ShieldAlert },
  { to: "/dashboard/architecture", label: "Architecture", icon: Network },
] as const;

export function DashboardSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r-2 border-brand-navy bg-brand-navy p-5 text-brand-cream md:flex">
      <div className="rounded-2xl bg-brand-cream p-3 retro-border">
        <Logo />
      </div>

      <nav className="mt-6 flex flex-col gap-1.5">
        {items.map((it) => {
          const active = path === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand-pink text-white retro-border"
                  : "text-brand-cream/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-brand-pink p-4 retro-border">
        <div className="font-display text-sm font-semibold text-white">
          Scan a new repo
        </div>
        <p className="mt-1 text-xs text-white/80">GitHub URL or .zip upload</p>
        <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand-navy retro-border">
          <Upload className="h-3.5 w-3.5" /> Upload
        </button>
      </div>
    </aside>
  );
}