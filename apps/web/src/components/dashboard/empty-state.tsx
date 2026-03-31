export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 py-24 text-center">
      <div className="text-4xl mb-4">◉</div>
      <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-2">
        Nothing here yet
      </h3>
      <p className="text-xs text-white/40 max-w-xs leading-relaxed">
        Your AI workspace is ready. Start by configuring your first agent or
        connecting a data source.
      </p>
    </div>
  );
}
