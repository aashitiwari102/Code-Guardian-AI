import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wand2,
  TestTube2,
  ShieldAlert,
  Network,
  Upload,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <>
      {/* Mobile Burger Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy text-brand-cream retro-border md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-brand-navy/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen shrink-0 flex-col border-r-2 border-brand-navy bg-brand-navy p-5 text-brand-cream md:flex"
      >
        {/* Desktop Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-white retro-border hover:bg-brand-orange transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Logo */}
        <div className={`rounded-2xl bg-brand-cream retro-border overflow-hidden transition-all ${
          isCollapsed ? "p-2 mx-auto w-fit" : "p-3 flex items-center justify-center"
        }`}>
          {isCollapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-pink text-white font-display text-base font-bold">
              C
            </div>
          ) : (
            <Logo />
          )}
        </div>

        {/* Navigation */}
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
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? it.label : undefined}
              >
                <it.icon className="h-4 w-4 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {it.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Upload Card */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-auto overflow-hidden"
            >
              <div className="rounded-2xl bg-brand-pink p-4 retro-border">
                <div className="font-display text-sm font-semibold text-white">
                  Scan a new repo
                </div>
                <p className="mt-1 text-xs text-white/80">GitHub URL or .zip upload</p>
                <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand-navy retro-border hover:bg-brand-cream transition-colors">
                  <Upload className="h-3.5 w-3.5" /> Upload
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Upload Button */}
        {isCollapsed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-auto flex h-10 w-10 items-center justify-center rounded-lg bg-brand-pink text-white retro-border hover:bg-brand-orange transition-colors mx-auto"
            title="Upload repository"
          >
            <Upload className="h-4 w-4" />
          </motion.button>
        )}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r-2 border-brand-navy bg-brand-navy p-5 text-brand-cream md:hidden"
          >
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
                    onClick={() => setIsMobileOpen(false)}
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
              <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand-navy retro-border hover:bg-brand-cream transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// Made with Bob
