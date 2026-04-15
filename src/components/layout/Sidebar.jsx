import { SECTIONS } from '../../hooks/useVisitState.js';

const SECTION_LABELS = {
  'condition-select': 'Condition',
  symptoms: 'Symptoms',
  scoring: 'Scoring',
  medications: 'Medications',
  monitoring: 'Monitoring',
  recommendations: 'Recommendations',
  escalation: 'Escalation',
  summary: 'Summary',
};

function StatusIcon({ status }) {
  if (status === 'complete') {
    return (
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-green)] flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (status === 'in-progress') {
    return (
      <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-[var(--color-info)]" />
      </span>
    );
  }
  return (
    <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300" />
  );
}

export function Sidebar({ currentSection, sectionStatus, condition, dispatch }) {
  const handleNav = (section) => {
    if (!condition && section !== 'condition-select') return;
    dispatch({ type: 'SET_SECTION', payload: section });
  };

  return (
    <nav className="w-56 flex-shrink-0 bg-white border-r border-gray-200 py-4 min-h-0 overflow-y-auto">
      <ul className="space-y-1">
        {SECTIONS.map((section) => {
          const isActive = section === currentSection;
          const status = sectionStatus[section] || 'pending';
          const disabled = !condition && section !== 'condition-select';

          return (
            <li key={section}>
              <button
                type="button"
                onClick={() => handleNav(section)}
                disabled={disabled}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[var(--color-primary)] font-semibold'
                    : disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)]'
                }`}
              >
                <StatusIcon status={status} />
                {SECTION_LABELS[section] || section}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
