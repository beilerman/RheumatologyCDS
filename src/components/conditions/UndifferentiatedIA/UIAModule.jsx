import { QuestionCard } from '../../shared/QuestionCard.jsx';
import { MedMonitorChecklist } from '../../shared/MedMonitorChecklist.jsx';
import { UIA_QUESTION_GROUPS } from './UIAQuestions.js';
import { MEDICATIONS } from '../../../data/medications.js';

function UIAMedications({ medications, dispatch }) {
  // UIA patients receive csDMARDs from the RA formulary
  const raMeds = MEDICATIONS.ra || [];
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
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
        <strong>Note:</strong> Undifferentiated IA uses csDMARDs (primarily methotrexate) when inflammatory
        arthritis is confirmed. Biologics should NOT be initiated without rheumatologist involvement.
        Medications listed are shared with the RA formulary.
      </div>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
          Current Medications
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {raMeds.map((med) => {
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
                    placeholder="Dose (e.g. 15mg weekly)"
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

      {/* Treatment status questions */}
      {UIA_QUESTION_GROUPS.filter((g) => g.section === 'medications').map((group) => (
        <QuestionCard
          key={group.id}
          group={group}
          answers={medications._answers || {}}
          onAnswer={(id, value) =>
            dispatch({ type: 'SET_ANSWER', payload: { id, value } })
          }
        />
      ))}
    </div>
  );
}

export function UIAModule({ currentSection, answers, medications, monitoringStatus, dispatch }) {
  const handleAnswer = (id, value) => {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  };

  if (currentSection === 'symptoms') {
    const groups = UIA_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
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
    const groups = UIA_QUESTION_GROUPS.filter((g) => g.section === 'scoring');
    return (
      <div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-800">
          <strong>Diagnostic Data:</strong> Labs and imaging inform diagnostic classification, not a
          composite disease activity score. Complete these to enable classification evolution rules.
        </div>
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
    return (
      <UIAMedications
        medications={{ ...medications, _answers: answers }}
        dispatch={dispatch}
      />
    );
  }

  if (currentSection === 'monitoring') {
    return (
      <MedMonitorChecklist
        condition="ra"
        selectedMeds={medications.current || []}
        monitoringStatus={monitoringStatus}
        dispatch={dispatch}
      />
    );
  }

  return null;
}
