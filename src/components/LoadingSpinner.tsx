import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 border-brand-cream border-t-brand-pink`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-3xl bg-white p-6 retro-border retro-shadow">
      <div className="space-y-4">
        <div className="skeleton h-10 w-10 rounded-xl" />
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-10 w-64" />
        <div className="skeleton h-5 w-96" />
      </div>

      {/* Stats skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LoadingCard />
        </div>
        <div className="space-y-6">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    </div>
  );
}

// Made with Bob
