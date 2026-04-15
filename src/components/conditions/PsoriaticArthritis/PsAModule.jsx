import { QuestionCard } from '../../shared/QuestionCard.jsx';
import { ScoreCalculator } from '../../shared/ScoreCalculator.jsx';
import { MedMonitorChecklist } from '../../shared/MedMonitorChecklist.jsx';
import { PSA_QUESTION_GROUPS } from './PsAQuestions.js';
import { useScoring } from '../../../hooks/useScoring.js';
import { MEDICATIONS } from '../../../data/medications.js';

function PsAMedications({ medications, dispatch }) {
  const psaMeds = MEDICATIONS.psa || [];
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
        Current PsA Medications
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {psaMeds.map((med) => {
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
  );
}

export function PsAModule({ currentSection, answers, scores, medications, monitoringStatus, dispatch }) {
  const calculatedScores = useScoring(answers);

  const handleAnswer = (id, value) => {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  };

  if (currentSection === 'symptoms') {
    const groups = PSA_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
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
    const labGroups = PSA_QUESTION_GROUPS.filter((g) => g.section === 'scoring');
    return (
      <div>
        <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
          Disease Activity Scores
        </h3>
        <ScoreCalculator
          label="DAPSA (Disease Activity in PSoriatic Arthritis)"
          scoreId="dapsa"
          calculated={calculatedScores.dapsa}
          dispatch={dispatch}
        />
        {labGroups.map((group) => (
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
      <PsAMedications
        medications={medications}
        dispatch={dispatch}
      />
    );
  }

  if (currentSection === 'monitoring') {
    return (
      <MedMonitorChecklist
        condition="psa"
        selectedMeds={medications.current || []}
        monitoringStatus={monitoringStatus}
        dispatch={dispatch}
      />
    );
  }

  return null;
}
