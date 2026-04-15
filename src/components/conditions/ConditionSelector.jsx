const CONDITIONS = [
  { id: 'ra', label: 'Rheumatoid Arthritis', enabled: true },
  { id: 'gout', label: 'Gout', enabled: true },
  { id: 'psa', label: 'Psoriatic Arthritis', enabled: false, badge: 'Phase 2' },
  { id: 'axspa', label: 'Axial SpA', enabled: false, badge: 'Phase 2' },
  { id: 'uia', label: 'Undiff. Inflammatory Arthritis', enabled: false, badge: 'Phase 2' },
  { id: 'fibro', label: 'Fibromyalgia', enabled: false, badge: 'Phase 2' },
  { id: 'sle', label: 'SLE', enabled: false, badge: 'Coming Soon' },
];

export function ConditionSelector({ dispatch }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
        Select Condition
      </h2>
      <div className="grid grid-cols-2 gap-3 max-w-lg">
        {CONDITIONS.map((c) => (
          <div key={c.id} className="relative">
            <button
              type="button"
              disabled={!c.enabled}
              onClick={() => dispatch({ type: 'SET_CONDITION', payload: c.id })}
              className={`w-full rounded-lg border-2 px-4 py-5 text-sm font-medium text-left transition-all ${
                c.enabled
                  ? 'border-gray-200 bg-white hover:border-[var(--color-primary)] hover:shadow-md cursor-pointer text-gray-800'
                  : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {c.label}
            </button>
            {c.badge && (
              <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                {c.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
