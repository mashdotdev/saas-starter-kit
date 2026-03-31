import EmptyState from "@/components/dashboard/empty-state";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">Your workspace overview</p>
      </div>
      <EmptyState />
    </div>
  );
}
