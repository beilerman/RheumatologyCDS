import { QuestionCard } from '../../shared/QuestionCard.jsx';
import { ScoreCalculator } from '../../shared/ScoreCalculator.jsx';
import { MedMonitorChecklist } from '../../shared/MedMonitorChecklist.jsx';
import { FIBRO_QUESTION_GROUPS } from './FibroQuestions.js';
import { MEDICATIONS } from '../../../data/medications.js';

function FibroMedications({ medications, dispatch }) {
  const fibroMeds = MEDICATIONS.fibro || [];
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
      <h3 className="font-semibold text-[var(--color-primary)] text-base mb-1">
        Current Fibromyalgia Medications
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Non-pharmacologic therapy (exercise, CBT) is first-line. Medications are adjunctive only.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {fibroMeds.map((med) => {
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
                  placeholder="Dose (e.g. duloxetine 30mg daily)"
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

function FSQDiagnosticStatus({ wpi, sss }) {
  if (wpi == null || sss == null) return null;

  const criteriaMet =
    (wpi >= 7 && sss >= 5) || (wpi >= 4 && wpi <= 6 && sss >= 9);

  return (
    <div
      className={`mt-4 rounded-lg border p-4 ${
        criteriaMet
          ? 'border-amber-300 bg-amber-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <p className="text-sm font-semibold mb-1">
        2016 Fibromyalgia Diagnostic Criteria Status
      </p>
      <p className="text-xs text-gray-600 mb-2">
        Criteria met if: WPI ≥7 + SSS ≥5, OR WPI 4-6 + SSS ≥9
        (with symptoms ≥3 months, no other explanation)
      </p>
      <p
        className={`text-sm font-medium ${
          criteriaMet ? 'text-amber-700' : 'text-gray-600'
        }`}
      >
        {criteriaMet
          ? 'Diagnostic criteria met (WPI ' + wpi + ', SSS ' + sss + ')'
          : 'Diagnostic criteria NOT met (WPI ' + wpi + ', SSS ' + sss + ')'}
      </p>
    </div>
  );
}

export function FibroModule({ currentSection, answers, scores, medications, monitoringStatus, dispatch }) {
  const handleAnswer = (id, value) => {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  };

  if (currentSection === 'symptoms') {
    const groups = FIBRO_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
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
    return (
      <div>
        <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
          Fibromyalgia Severity Questionnaire (FSQ)
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Enter WPI and SSS scores from the symptoms section above to calculate total FSQ score and
          assess 2016 diagnostic criteria.
        </p>
        <ScoreCalculator
          scoreKey="fsq"
          label="FSQ Score"
          inputs={[
            { key: 'wpiScore', label: 'WPI Score', answerKey: 'fibro-wpi' },
            { key: 'sssScore', label: 'SSS Score', answerKey: 'fibro-sss' },
          ]}
          answers={answers}
          scores={scores}
          dispatch={dispatch}
        />
        <FSQDiagnosticStatus
          wpi={answers['fibro-wpi']}
          sss={answers['fibro-sss']}
        />
      </div>
    );
  }

  if (currentSection === 'medications') {
    const groups = FIBRO_QUESTION_GROUPS.filter((g) => g.section === 'medications');
    return (
      <div>
        <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
          Medications & Treatment Context
        </h3>
        {groups.map((group) => (
          <QuestionCard
            key={group.id}
            group={group}
            answers={answers}
            onAnswer={handleAnswer}
          />
        ))}
        <FibroMedications medications={medications} dispatch={dispatch} />
      </div>
    );
  }

  if (currentSection === 'monitoring') {
    return (
      <MedMonitorChecklist
        condition="fibro"
        selectedMeds={medications.current || []}
        monitoringStatus={monitoringStatus}
        dispatch={dispatch}
      />
    );
  }

  return null;
}
