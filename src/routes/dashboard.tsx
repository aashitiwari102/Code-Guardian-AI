import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-brand-cream)] text-brand-navy)]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}