export function DemoBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
      Demo intelligence — structured sample data. Add <code className="font-mono">AI_API_KEY</code> for
      live AI analysis. Never treated as real external research.
    </div>
  );
}
