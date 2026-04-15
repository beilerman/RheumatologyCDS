const CONDITION_LABELS = {
  ra: 'Rheumatoid Arthritis',
  gout: 'Gout',
};

export function Header({ condition }) {
  return (
    <header className="bg-[var(--color-primary)] text-white px-6 py-3 flex items-center gap-4 shadow">
      <div className="flex items-baseline gap-3">
        <h1 className="text-xl font-bold tracking-tight">RheumatologyCDS</h1>
        {condition && (
          <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
            {CONDITION_LABELS[condition] || condition}
          </span>
        )}
      </div>
      <span className="text-sm text-white/70 ml-auto">Clinical Decision Support</span>
    </header>
  );
}
