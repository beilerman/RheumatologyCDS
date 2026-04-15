import { MEDICATIONS } from '../../data/medications.js';

const STATUS_OPTIONS = ['Current', 'Due', 'Overdue', 'Needs ordering', 'N/A'];

export function MedMonitorChecklist({ condition, selectedMeds, monitoringStatus, dispatch }) {
  const conditionMeds = MEDICATIONS[condition] || [];
  const activeMeds = conditionMeds.filter((m) => selectedMeds.includes(m.id));

  if (activeMeds.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <p className="text-sm text-gray-500 italic">
          No medications selected. Add medications in the Medications section.
        </p>
      </div>
    );
  }

  const getStatus = (medId, item) => {
    const key = `${medId}::${item}`;
    const found = monitoringStatus.find((m) => m.key === key);
    return found ? found.status : '';
  };

  const handleStatus = (medId, item, status) => {
    const key = `${medId}::${item}`;
    const next = monitoringStatus.filter((m) => m.key !== key);
    next.push({ key, medId, item, status });
    dispatch({ type: 'SET_MONITORING_STATUS', payload: next });
  };

  return (
    <div className="space-y-4">
      {activeMeds.map((med) => (
        <div key={med.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h4 className="font-semibold text-[var(--color-primary)] text-sm mb-3">{med.name}</h4>
          <div className="space-y-3">
            {med.monitoring.map((m) => (
              <div key={m.item} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{m.item}</p>
                  <p className="text-xs text-gray-500">{m.frequency}</p>
                  {m.notes && (
                    <p className="text-xs text-amber-700 mt-0.5">{m.notes}</p>
                  )}
                </div>
                <select
                  value={getStatus(med.id, m.item)}
                  onChange={(e) => handleStatus(med.id, m.item, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Status...</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
