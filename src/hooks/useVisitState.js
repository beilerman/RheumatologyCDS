import { useReducer, useMemo } from 'react';
import { getRecommendations } from '../utils/recommendationEngine.js';
import { evaluateEscalation } from '../data/escalationCriteria.js';
import { raRules } from '../components/conditions/RheumatoidArthritis/RARules.js';
import { goutRules } from '../components/conditions/Gout/GoutRules.js';
import { psaRules } from '../components/conditions/PsoriaticArthritis/PsARules.js';
import { axspaRules } from '../components/conditions/AxialSpondyloarthritis/AxSpARules.js';
import { uiaRules } from '../components/conditions/UndifferentiatedIA/UIARules.js';
import { fibroRules } from '../components/conditions/Fibromyalgia/FibroRules.js';
import { GUIDELINES } from '../data/guidelines.js';

const SECTIONS = [
  'condition-select', 'symptoms', 'scoring', 'medications',
  'monitoring', 'recommendations', 'escalation', 'summary',
];

function buildSectionStatus(currentSection, completedSections = []) {
  const completed = new Set(completedSections);
  const sectionStatus = {};

  SECTIONS.forEach((section) => {
    if (section === currentSection) {
      sectionStatus[section] = section === 'summary' ? 'complete' : 'in-progress';
      return;
    }

    sectionStatus[section] = completed.has(section) ? 'complete' : 'pending';
  });

  return sectionStatus;
}

function createInitialState() {
  return {
    condition: null,
    currentSection: 'condition-select',
    sectionStatus: buildSectionStatus('condition-select'),
    answers: {},
    scores: {},
    medications: { current: [], doses: {} },
    monitoringStatus: [],
    metadata: { startedAt: new Date().toISOString() },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONDITION': {
      return {
        ...state,
        condition: action.payload,
        currentSection: 'symptoms',
        sectionStatus: buildSectionStatus('symptoms', ['condition-select']),
        answers: {},
        scores: {},
        medications: { current: [], doses: {} },
        monitoringStatus: [],
        metadata: { ...state.metadata, conditionSelectedAt: new Date().toISOString() },
      };
    }
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.payload.id]: action.payload.value } };
    case 'SET_SCORE':
      return { ...state, scores: { ...state.scores, [action.payload.id]: action.payload.value } };
    case 'SET_MEDICATIONS':
      return { ...state, medications: action.payload };
    case 'SET_MONITORING_STATUS':
      return { ...state, monitoringStatus: action.payload };
    case 'SET_SECTION': {
      const prevIdx = SECTIONS.indexOf(state.currentSection);
      const nextIdx = SECTIONS.indexOf(action.payload);

      const completedSections = Object.entries(state.sectionStatus)
        .filter(([, status]) => status === 'complete')
        .map(([section]) => section);

      if (nextIdx > prevIdx || action.payload === 'summary') {
        completedSections.push(state.currentSection);
      }

      return {
        ...state,
        currentSection: action.payload,
        sectionStatus: buildSectionStatus(action.payload, completedSections),
      };
    }
    case 'RESET_VISIT':
      return createInitialState();
    default:
      return state;
  }
}

const rulesByCondition = { ra: raRules, gout: goutRules, psa: psaRules, axspa: axspaRules, uia: uiaRules, fibro: fibroRules };

export function useVisitState() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const recommendations = useMemo(() => {
    const rules = rulesByCondition[state.condition] || [];
    return getRecommendations(state, rules, GUIDELINES);
  }, [state]);
  const escalation = useMemo(() => evaluateEscalation(state), [state]);
  return [{ ...state, recommendations, escalation }, dispatch];
}

export { createInitialState, reducer, SECTIONS };
