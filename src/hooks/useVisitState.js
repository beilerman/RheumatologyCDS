import { useReducer, useMemo } from 'react';
import { getRecommendations } from '../utils/recommendationEngine.js';
import { evaluateEscalation } from '../data/escalationCriteria.js';
import { raRules } from '../components/conditions/RheumatoidArthritis/RARules.js';
import { goutRules } from '../components/conditions/Gout/GoutRules.js';
import { GUIDELINES } from '../data/guidelines.js';

const SECTIONS = [
  'condition-select', 'symptoms', 'scoring', 'medications',
  'monitoring', 'recommendations', 'escalation', 'summary',
];

function createInitialState() {
  const sectionStatus = {};
  SECTIONS.forEach((s) => (sectionStatus[s] = 'pending'));
  sectionStatus['condition-select'] = 'in-progress';
  return {
    condition: null,
    currentSection: 'condition-select',
    sectionStatus,
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
      const sectionStatus = { ...state.sectionStatus };
      sectionStatus['condition-select'] = 'complete';
      sectionStatus['symptoms'] = 'in-progress';
      return {
        ...state,
        condition: action.payload,
        currentSection: 'symptoms',
        sectionStatus,
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
      const sectionStatus = { ...state.sectionStatus };
      const prevIdx = SECTIONS.indexOf(state.currentSection);
      const nextIdx = SECTIONS.indexOf(action.payload);
      if (nextIdx > prevIdx && state.sectionStatus[state.currentSection] === 'in-progress') {
        sectionStatus[state.currentSection] = 'complete';
      }
      sectionStatus[action.payload] = 'in-progress';
      return { ...state, currentSection: action.payload, sectionStatus };
    }
    case 'RESET_VISIT':
      return createInitialState();
    default:
      return state;
  }
}

const rulesByCondition = { ra: raRules, gout: goutRules };

export function useVisitState() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const recommendations = useMemo(() => {
    const rules = rulesByCondition[state.condition] || [];
    return getRecommendations(state, rules, GUIDELINES);
  }, [state]);
  const escalation = useMemo(() => evaluateEscalation(state), [state]);
  return [{ ...state, recommendations, escalation }, dispatch];
}

export { SECTIONS };
