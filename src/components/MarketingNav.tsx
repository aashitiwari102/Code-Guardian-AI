import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ArrowRight } from "lucide-react";

export function MarketingNav() {
  return (
    <header className="relative z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium hover:text-brand-pink">
            Features
          </a>
          <a href="#workflow" className="text-sm font-medium hover:text-brand-pink">
            How it works
          </a>
          <a href="#stack" className="text-sm font-medium hover:text-brand-pink">
            Stack
          </a>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-cream retro-border retro-shadow-pink transition-transform hover:-translate-y-0.5"
        >
          Launch demo <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}