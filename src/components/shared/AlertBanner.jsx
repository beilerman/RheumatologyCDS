const LEVEL_CONFIG = {
  red: {
    bg: 'bg-red-100 border-red-400',
    icon: '!',
    iconClass: 'bg-red-500 text-white',
    title: 'Immediate Escalation Required',
    titleClass: 'text-red-800',
  },
  yellow: {
    bg: 'bg-yellow-50 border-yellow-400',
    icon: '⚠',
    iconClass: 'bg-yellow-400 text-white',
    title: 'Schedule Rheumatology Follow-Up',
    titleClass: 'text-yellow-800',
  },
  green: {
    bg: 'bg-green-50 border-green-400',
    icon: '✓',
    iconClass: 'bg-green-500 text-white',
    title: 'Continue Current Plan',
    titleClass: 'text-green-800',
  },
};

export function AlertBanner({ level = 'green', flags = [] }) {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.green;
  return (
    <div className={`border-l-4 rounded p-4 flex gap-3 ${config.bg}`}>
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${config.iconClass}`}
      >
        {config.icon}
      </div>
      <div>
        <p className={`font-semibold text-sm ${config.titleClass}`}>{config.title}</p>
        {flags.length > 0 && (
          <ul className="mt-1 space-y-1">
            {flags.map((f) => (
              <li key={f.id || f.message} className="text-sm text-gray-700">
                {f.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
