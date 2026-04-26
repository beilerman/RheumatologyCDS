import { QuestionCard } from '../../shared/QuestionCard.jsx';
import { ScoreCalculator } from '../../shared/ScoreCalculator.jsx';
import { MedMonitorChecklist } from '../../shared/MedMonitorChecklist.jsx';
import { RA_QUESTION_GROUPS } from './RAQuestions.js';
import { useScoring } from '../../../hooks/useScoring.js';
import { MEDICATIONS } from '../../../data/medications.js';

function getMedSafetyWarnings(medId, medClass, answers) {
  const warnings = [];
  const ea = answers['ra-extraarticular'];
  const hasILD = Array.isArray(ea) && ea.includes('ILD');
  const hasHepB = answers['ra-hepatitis-b'] === true;
  const hasHF = answers['ra-heart-failure'] === true;
  const hasLymphoma = answers['ra-lymphoproliferative-history'] === true;
  const hasInfection = answers['ra-prior-serious-infection'] === true;
  const ageOver50CV = answers['ra-age-50-plus'] === true && answers['ra-cv-risk-factors'] === true;

  if (medId === 'methotrexate' && hasILD) {
    warnings.push('Caution: MTX associated with pulmonary toxicity in ILD patients.');
  }
  if (medClass === 'TNFi' && hasHF) {
    warnings.push('Contraindicated in moderate-to-severe heart failure (NYHA III-IV).');
  }
  if (medClass === 'TNFi' && hasILD) {
    warnings.push('Limited data in ILD. Rituximab or abatacept may be preferred.');
  }
  if (medClass === 'TNFi' && hasLymphoma) {
    warnings.push('Avoid with lymphoproliferative history. Consider rituximab.');
  }
  if (medClass === 'JAKi' && ageOver50CV) {
    warnings.push('FDA BOXED WARNING: Increased MACE, VTE, malignancy risk in patients ≥50 with CV risk factors (ORAL Surveillance).');
  }
  if (medClass === 'JAKi' && hasLymphoma) {
    warnings.push('Avoid with lymphoproliferative history. Increased malignancy risk.');
  }
  if (['TNFi', 'IL-6i', 'JAKi', 'T-cell co-stimulation modulator', 'B-cell depleting'].includes(medClass) && hasHepB) {
    warnings.push('Hep B+: Antiviral prophylaxis (entecavir/tenofovir) required before initiation.');
  }
  if (['TNFi', 'IL-6i', 'JAKi', 'T-cell co-stimulation modulator', 'B-cell depleting'].includes(medClass) && hasInfection) {
    warnings.push('Prior serious infection: Careful risk-benefit assessment required.');
  }

  return warnings;
}

function RAMedications({ medications, answers, dispatch }) {
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
        Current RA Medications
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {raMeds.map((med) => {
          const selected = current.includes(med.id);
          const warnings = getMedSafetyWarnings(med.id, med.class, answers);
          return (
            <div key={med.id} className={`border rounded p-3 ${warnings.length > 0 ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}>
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
              {warnings.length > 0 && (
                <div className="mt-1 space-y-1">
                  {warnings.map((w, i) => (
                    <p key={i} className="text-xs text-amber-800 flex items-start gap-1">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>{w}</span>
                    </p>
                  ))}
                </div>
              )}
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

export function RAModule({ currentSection, answers, scores, medications, monitoringStatus, dispatch }) {
  const calculatedScores = useScoring(answers, 'ra');

  const handleAnswer = (id, value) => {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  };

  if (currentSection === 'symptoms') {
    const groups = RA_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
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
          Disease Activity Scores
        </h3>
        <ScoreCalculator
          label="CDAI (Clinical Disease Activity Index)"
          scoreId="cdai"
          calculated={calculatedScores.cdai}
          dispatch={dispatch}
        />
        <ScoreCalculator
          label="DAS28-ESR"
          scoreId="das28esr"
          calculated={calculatedScores.das28esr}
          dispatch={dispatch}
        />
        <ScoreCalculator
          label="DAS28-CRP"
          scoreId="das28crp"
          calculated={calculatedScores.das28crp}
          dispatch={dispatch}
        />
        <ScoreCalculator
          label="RAPID3"
          scoreId="rapid3"
          calculated={calculatedScores.rapid3}
          dispatch={dispatch}
        />
      </div>
    );
  }

  if (currentSection === 'medications') {
    return (
      <RAMedications
        medications={medications}
        answers={answers}
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
