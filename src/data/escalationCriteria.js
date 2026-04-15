const raEscalation = [
  // RED FLAGS
  {
    id: 'ra-red-extraarticular',
    level: 'red',
    condition: (state) => {
      const ea = state.answers['ra-extraarticular'];
      return Array.isArray(ea) && ea.length > 0;
    },
    message: 'New extra-articular manifestation (ILD, vasculitis, scleritis). Immediate rheumatologist contact recommended.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-red-high-da-on-biologic',
    level: 'red',
    condition: (state) => {
      const da = state.scores?.cdai?.category || state.scores?.das28esr?.category || state.scores?.das28crp?.category;
      return da === 'High' && ['on-bDMARD', 'failed-bDMARD'].includes(state.answers['ra-dmard-history']);
    },
    message: 'High disease activity despite bDMARD/tsDMARD therapy. Urgent rheumatologist contact recommended.',
    guideline: 'ACR_RA_2021',
  },
  // YELLOW FLAGS
  {
    id: 'ra-yellow-moderate-on-treatment',
    level: 'yellow',
    condition: (state) => {
      const da = state.scores?.cdai?.category || state.scores?.das28esr?.category || state.scores?.das28crp?.category;
      return da === 'Moderate' && ['on-csDMARD', 'on-bDMARD'].includes(state.answers['ra-dmard-history']);
    },
    message: 'Moderate disease activity not at target on current regimen. Schedule rheumatology follow-up within 2-4 weeks.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-yellow-gc-dependence',
    level: 'yellow',
    condition: (state) => state.answers['ra-prednisone-duration'] === '>3 months',
    message: 'Persistent glucocorticoid use (>3 months). Schedule rheumatology follow-up to discuss taper strategy.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-yellow-biologic-discussion',
    level: 'yellow',
    condition: (state) => state.answers['ra-dmard-history'] === 'failed-csDMARD',
    message: 'csDMARD failure — biologic initiation discussion needed. Schedule rheumatology follow-up.',
    guideline: 'ACR_RA_2021',
  },
];

const goutEscalation = [
  // RED FLAGS
  {
    id: 'gout-red-hypersensitivity',
    level: 'red',
    condition: (state) => state.answers['gout-allopurinol-hypersensitivity'] === true,
    message: 'Suspected allopurinol hypersensitivity syndrome. Immediate rheumatologist contact. Discontinue allopurinol.',
    guideline: 'ACR_GOUT_2020',
  },
  {
    id: 'gout-red-septic-joint',
    level: 'red',
    condition: (state) => state.answers['gout-suspected-septic-joint'] === true,
    message: 'Suspected septic joint — must differentiate from gout flare. Urgent evaluation required.',
    guideline: 'ACR_GOUT_2020',
  },
  // YELLOW FLAGS
  {
    id: 'gout-yellow-not-at-target',
    level: 'yellow',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] >= 6 &&
      state.answers['gout-ult-dose'] &&
      parseInt(state.answers['gout-ult-dose'], 10) >= 300,
    message: 'Not at serum urate target despite allopurinol >=300 mg/day. Schedule rheumatology follow-up to discuss dose optimization or alternative ULT.',
    guideline: 'ACR_GOUT_2020',
  },
  {
    id: 'gout-yellow-adherence',
    level: 'yellow',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      ['partial', 'poor'].includes(state.answers['gout-ult-adherence']),
    message: 'ULT non-adherence identified. May require motivational counseling or rheumatology follow-up.',
    guideline: 'ACR_GOUT_2020',
  },
  {
    id: 'gout-yellow-ckd-progression',
    level: 'yellow',
    condition: (state) => ['4', '5'].includes(state.answers['gout-ckd-stage']),
    message: 'Advanced CKD (stage 4-5). Rheumatology follow-up for ULT dose adjustment.',
    guideline: 'ACR_GOUT_2020',
  },
];

const escalationByCondition = {
  ra: raEscalation,
  gout: goutEscalation,
};

export function evaluateEscalation(state) {
  const criteria = escalationByCondition[state.condition] || [];
  const flags = criteria.filter((c) => {
    try {
      return c.condition(state);
    } catch {
      return false;
    }
  });

  let level = 'green';
  if (flags.some((f) => f.level === 'red')) level = 'red';
  else if (flags.some((f) => f.level === 'yellow')) level = 'yellow';

  return { level, flags };
}
