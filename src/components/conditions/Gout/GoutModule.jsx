import { QuestionCard } from '../../shared/QuestionCard.jsx';
import { MedMonitorChecklist } from '../../shared/MedMonitorChecklist.jsx';
import { GOUT_QUESTION_GROUPS } from './GoutQuestions.js';
import { MEDICATIONS } from '../../../data/medications.js';

function GoutMedications({ medications, dispatch }) {
  const goutMeds = MEDICATIONS.gout || [];
  const current = medications.current || [];
  const doses = medications.doses || {};

  const toggleMed = (medId) => {
    const next = current.includes(medId)
      ? current.filter((m) => m !== medId)
      : [...current, medId];
    dispatch({ type: 'SET_MEDICATIONS', payload: { current: next, doses } });
  };

  const setDose = (medId, dose) => {
    dispatch({
      type: 'SET_MEDICATIONS',
      payload: { current, doses: { ...doses, [medId]: dose } },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mt-4">
      <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
        Current Gout Medications
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {goutMeds.map((med) => {
          const selected = current.includes(med.id);
          return (
            <div key={med.id} className="border border-gray-200 rounded p-3">
              <button
                type="button"
                onClick={() => toggleMed(med.id)}
                className={`w-full text-left text-sm font-medium mb-1 px-2 py-1 rounded transition-colors ${
                  selected
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {med.name}
                <span className="ml-2 text-xs opacity-70 font-normal">{med.class}</span>
              </button>
              {selected && (
                <input
                  type="text"
                  placeholder="Dose (e.g. 300mg daily)"
                  value={doses[med.id] || ''}
                  onChange={(e) => setDose(med.id, e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 mt-1 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GoutModule({ currentSection, answers, medications, monitoringStatus, dispatch }) {
  const handleAnswer = (id, value) => {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  };

  if (currentSection === 'symptoms') {
    const groups = GOUT_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
    return (
      <div>
        {groups.map((group) => (
          <QuestionCard
            key={group.id}
            group={group}
            answers={answers}
            onAnswer={handleAnswer}
          />
        ))}
      </div>
    );
  }

  if (currentSection === 'scoring') {
    const groups = GOUT_QUESTION_GROUPS.filter((g) => g.section === 'scoring');
    return (
      <div>
        <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
          Laboratory Values
        </h3>
        {groups.map((group) => (
          <QuestionCard
            key={group.id}
            group={group}
            answers={answers}
            onAnswer={handleAnswer}
          />
        ))}
      </div>
    );
  }

  if (currentSection === 'medications') {
    const groups = GOUT_QUESTION_GROUPS.filter((g) => g.section === 'medications');
    return (
      <div>
        <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
          ULT & Medications
        </h3>
        {groups.map((group) => (
          <QuestionCard
            key={group.id}
            group={group}
            answers={answers}
            onAnswer={handleAnswer}
          />
        ))}
        <GoutMedications medications={medications} dispatch={dispatch} />
      </div>
    );
  }

  if (currentSection === 'monitoring') {
    return (
      <MedMonitorChecklist
        condition="gout"
        selectedMeds={medications.current || []}
        monitoringStatus={monitoringStatus}
        dispatch={dispatch}
      />
    );
  }

  return null;
}
