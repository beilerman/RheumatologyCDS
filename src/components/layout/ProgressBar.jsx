export function ProgressBar({ sectionStatus }) {
  const statuses = Object.values(sectionStatus || {});
  const total = statuses.length;
  const complete = statuses.filter((s) => s === 'complete').length;
  const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <div className="h-1.5 bg-gray-200 w-full">
      <div
        className="h-full bg-[var(--color-primary)] transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
