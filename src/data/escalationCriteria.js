function parseDoseAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

const raEscalation = [
  // RED FLAGS
  {
    id: 'ra-red-extraarticular',
    level: 'red',
    condition: (state) => {
      const ea = state.answers['ra-extraarticular'];
      const isNew = state.answers['ra-extraarticular-new'] !== false;
      return Array.isArray(ea) && ea.length > 0 && isNew;
    },
    message: 'New extra-articular manifestation (ILD, vasculitis, scleritis). Immediate rheumatologist contact recommended.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-yellow-extraarticular-known',
    level: 'yellow',
    condition: (state) => {
      const ea = state.answers['ra-extraarticular'];
      return Array.isArray(ea) && ea.length > 0 && state.answers['ra-extraarticular-new'] === false;
    },
    message: 'Known extra-articular manifestations present. Continue monitoring. Ensure appropriate subspecialty follow-up.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-red-high-da-on-csdmard',
    level: 'red',
    condition: (state) => {
      const da = state.scores?.cdai?.category || state.scores?.das28esr?.category || state.scores?.das28crp?.category;
      const onCsDMARD = state.answers['ra-dmard-history'] === 'on-csDMARD';
      const poorPrognostic = state.answers['ra-functional-status'] === 'worsened' ||
        state.answers['ra-new-joints'] === true ||
        (state.answers['ra-flares-since-last'] != null && state.answers['ra-flares-since-last'] >= 2);
      return da === 'High' && onCsDMARD && poorPrognostic;
    },
    message: 'High disease activity on csDMARD with poor prognostic features (worsened function, new joints, or frequent flares). Escalation to biologic therapy recommended per ACR 2021. Schedule urgent rheumatology follow-up.',
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
    id: 'ra-yellow-high-da-on-csdmard',
    level: 'yellow',
    condition: (state) => {
      const da = state.scores?.cdai?.category || state.scores?.das28esr?.category || state.scores?.das28crp?.category;
      const onCsDMARD = state.answers['ra-dmard-history'] === 'on-csDMARD';
      const poorPrognostic = state.answers['ra-functional-status'] === 'worsened' ||
        state.answers['ra-new-joints'] === true ||
        (state.answers['ra-flares-since-last'] != null && state.answers['ra-flares-since-last'] >= 2);
      return da === 'High' && onCsDMARD && !poorPrognostic;
    },
    message: 'High disease activity on csDMARD. Consider treatment escalation discussion. Reassess in 3 months per treat-to-target strategy.',
    guideline: 'ACR_RA_2021',
  },
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
    condition: (state) => {
      const doseAmount = parseDoseAmount(state.answers['gout-ult-dose']);
      return (
        state.answers['gout-on-ult'] === true &&
        state.answers['gout-ult-medication'] === 'allopurinol' &&
        state.answers['gout-serum-urate'] != null &&
        state.answers['gout-serum-urate'] >= 6 &&
        doseAmount != null &&
        doseAmount >= 300
      );
    },
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

const psaEscalation = [
  // RED FLAGS
  {
    id: 'psa-red-uveitis',
    level: 'red',
    condition: (state) => state.answers['psa-eye-symptoms'] === true,
    message: 'Suspected uveitis. Urgent ophthalmology referral required. Document and escalate immediately.',
    guideline: 'ACR_PsA_2018',
  },
  {
    id: 'psa-red-multidomain',
    level: 'red',
    condition: (state) => {
      const status = state.answers['psa-treatment-status'];
      const onBiologic = ['on-bDMARD', 'failed-bDMARD'].includes(status);
      if (!onBiologic) return false;
      let activeDomains = 0;
      if (state.answers['psa-dominant-domain']) activeDomains++;
      if (state.answers['psa-axial-symptoms'] === true) activeDomains++;
      if (state.answers['psa-dactylitis'] === true) activeDomains++;
      if (['moderate3-10%', 'severe>10%'].includes(state.answers['psa-skin-severity'])) activeDomains++;
      if (Array.isArray(state.answers['psa-enthesitis-sites']) && state.answers['psa-enthesitis-sites'].length > 0) activeDomains++;
      return activeDomains >= 3;
    },
    message: 'Multi-domain active PsA not responding to biologic therapy. Urgent rheumatology review for regimen change.',
    guideline: 'GRAPPA_2021',
  },
  // YELLOW FLAGS
  {
    id: 'psa-yellow-not-mda',
    level: 'yellow',
    condition: (state) => {
      const onTreatment = ['on-csDMARD', 'on-bDMARD'].includes(state.answers['psa-treatment-status']);
      const notMild = state.answers['psa-severity'] !== 'mild';
      return onTreatment && notMild;
    },
    message: 'Not meeting Minimal Disease Activity (MDA) target on current therapy. Consider treatment escalation at next visit.',
    guideline: 'GRAPPA_2021',
  },
  {
    id: 'psa-yellow-new-domain',
    level: 'yellow',
    condition: (state) =>
      state.answers['psa-axial-symptoms'] === true &&
      state.answers['psa-dominant-domain'] === 'peripheral',
    message: 'New axial symptoms in a patient with predominantly peripheral PsA. Reassess dominant domain and consider imaging.',
    guideline: 'ACR_PsA_2018',
  },
  {
    id: 'psa-yellow-skin-flare',
    level: 'yellow',
    condition: (state) => state.answers['psa-skin-severity'] === 'severe>10%',
    message: 'Severe skin flare (BSA >10%) — dermatology co-management recommended. Consider IL-17i or IL-23i for superior skin efficacy.',
    guideline: 'ACR_PsA_2018',
  },
];

const axspaEscalation = [
  // RED FLAGS
  {
    id: 'axspa-red-uveitis',
    level: 'red',
    condition: (state) => state.answers['axspa-uveitis-current'] === true,
    message: 'Urgent ophthalmology referral for active uveitis. Document and escalate immediately.',
    guideline: 'ACR_axSpA_2019',
  },
  {
    id: 'axspa-red-ibd',
    level: 'red',
    condition: (state) => state.answers['axspa-ibd-symptoms'] === true,
    message: 'GI symptoms suggestive of IBD. Gastroenterology referral required. Caution with IL-17 inhibitors.',
    guideline: 'ACR_axSpA_2019',
  },
  {
    id: 'axspa-red-neuro',
    level: 'red',
    condition: (state) => state.answers['axspa-neurological-symptoms'] === true,
    message: 'Neurological symptoms present. Urgent evaluation — rule out cauda equina syndrome or atlantoaxial instability.',
    guideline: 'ACR_axSpA_2019',
  },
  {
    id: 'axspa-red-very-high-asdas',
    level: 'red',
    condition: (state) => {
      const da = state.scores?.asdasCrp?.category;
      const onBiologic = ['on-TNFi', 'failed-TNFi', 'on-IL17i', 'failed-IL17i'].includes(
        state.answers['axspa-treatment-status']
      );
      return da === 'Very High' && onBiologic;
    },
    message: 'Very high disease activity (ASDAS Very High) despite biologic therapy. Urgent rheumatology review for regimen change.',
    guideline: 'ACR_axSpA_2019',
  },
  // YELLOW FLAGS
  {
    id: 'axspa-yellow-active-on-treatment',
    level: 'yellow',
    condition: (state) => {
      const basdai = state.scores?.basdai?.category;
      const asdas = state.scores?.asdasCrp?.category;
      const active = basdai === 'Active' || ['High', 'Very High'].includes(asdas);
      const onTreatment = ['on-nsaid', 'on-TNFi', 'on-IL17i'].includes(
        state.answers['axspa-treatment-status']
      );
      return active && onTreatment;
    },
    message: 'Active disease activity on current treatment regimen. Consider treatment escalation at next visit.',
    guideline: 'ACR_axSpA_2019',
  },
  {
    id: 'axspa-yellow-biologic-needed',
    level: 'yellow',
    condition: (state) => state.answers['axspa-treatment-status'] === 'failed-nsaid',
    message: 'NSAID failure documented. Biologic initiation discussion needed. Refer to rheumatology if not already established.',
    guideline: 'ACR_axSpA_2019',
  },
];

const uiaEscalation = [
  // RED FLAGS
  {
    id: 'uia-red-rapid-destruction',
    level: 'red',
    condition: (state) => state.answers['uia-erosive-changes'] === true,
    message: 'Rapidly progressive joint destruction (erosive changes). Urgent rheumatology referral required.',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
  },
  {
    id: 'uia-red-systemic',
    level: 'red',
    condition: (state) => state.answers['uia-systemic-features'] === true,
    message: 'New systemic features (fever, cytopenias, serositis). Consider SLE or vasculitis. Urgent evaluation required.',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
  },
  // YELLOW FLAGS
  {
    id: 'uia-yellow-evolving',
    level: 'yellow',
    condition: (state) => {
      const towardRA =
        state.answers['uia-rf-positive'] === true &&
        state.answers['uia-anti-ccp-positive'] === true;
      const towardPsA =
        state.answers['uia-psoriasis'] === true &&
        (state.answers['uia-joint-pattern'] === 'asymmetric' ||
          state.answers['uia-dactylitis'] === true ||
          state.answers['uia-enthesitis'] === true);
      const towardAxSpA =
        state.answers['uia-inflammatory-back-pain'] === true &&
        state.answers['uia-hla-b27'] === true;
      return towardRA || towardPsA || towardAxSpA;
    },
    message: 'Features evolving toward classifiable diagnosis (RA, PsA, or axSpA). Route to rheumatology for reclassification.',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
  },
  {
    id: 'uia-yellow-csdmard-inadequate',
    level: 'yellow',
    condition: (state) =>
      state.answers['uia-treatment-status'] === 'on-csDMARD' &&
      state.answers['uia-symptom-duration'] === '>6m',
    message: 'Inadequate csDMARD response at >6 months. Rheumatology follow-up for treatment escalation.',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
  },
  {
    id: 'uia-yellow-uncertainty-prolonged',
    level: 'yellow',
    condition: (state) =>
      state.answers['uia-symptom-duration'] === '>6m' &&
      state.answers['uia-inflammatory-arthritis-confirmed'] !== true,
    message: 'Diagnostic uncertainty persisting >6 months. Reassess and consider specialist referral.',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
  },
];

const fibroEscalation = [
  // RED FLAGS
  {
    id: 'fibro-red-neuro',
    level: 'red',
    condition: (state) => state.answers['fibro-alternative-diagnosis-concern'] === true,
    message:
      'Alternative diagnosis concern flagged. Evaluate for inflammatory arthritis, hypothyroidism, sleep apnea, vitamin D deficiency, or other masqueraders. Consider targeted workup.',
    guideline: 'EULAR_FIBRO_2016',
  },
  {
    id: 'fibro-red-suicidal',
    level: 'red',
    condition: (state) => {
      const phq9 = state.answers['fibro-phq9-score'];
      return phq9 != null && phq9 >= 20;
    },
    message:
      'Severe depression (PHQ-9 ≥20) — assess for active suicidal ideation. Immediate behavioral health referral required.',
    guideline: 'EULAR_FIBRO_2016',
  },
  // YELLOW FLAGS
  {
    id: 'fibro-yellow-depression',
    level: 'yellow',
    condition: (state) => {
      const phq9 = state.answers['fibro-phq9-score'];
      return phq9 != null && phq9 >= 10 && phq9 < 20;
    },
    message:
      'Moderate depression (PHQ-9 ≥10). Behavioral health referral recommended alongside fibromyalgia management.',
    guideline: 'EULAR_FIBRO_2016',
  },
  {
    id: 'fibro-yellow-polypharmacy',
    level: 'yellow',
    condition: (state) => {
      const fibroMeds = [
        'duloxetine',
        'milnacipran',
        'pregabalin',
        'gabapentin',
        'amitriptyline',
        'cyclobenzaprine',
      ];
      const count = (state.medications?.current || []).filter((m) =>
        fibroMeds.includes(m)
      ).length;
      return count >= 3;
    },
    message:
      'On ≥3 fibromyalgia medications. Review each for clear benefit — taper and discontinue agents without measurable improvement.',
    guideline: 'EULAR_FIBRO_2016',
  },
  {
    id: 'fibro-yellow-decline',
    level: 'yellow',
    condition: (state) => state.answers['fibro-adl-limitations'] === 'severe',
    message:
      'Severe functional limitation despite treatment. Consider multidisciplinary pain program or specialist referral.',
    guideline: 'EULAR_FIBRO_2016',
  },
  {
    id: 'fibro-yellow-opioid-request',
    level: 'yellow',
    condition: (state) => state.answers['fibro-requesting-opioids'] === true,
    message:
      'Patient requesting opioids for fibromyalgia. Counsel on lack of efficacy and risks. Reinforce non-pharmacologic first-line approach.',
    guideline: 'EULAR_FIBRO_2016',
  },
];

const escalationByCondition = {
  ra: raEscalation,
  gout: goutEscalation,
  psa: psaEscalation,
  axspa: axspaEscalation,
  uia: uiaEscalation,
  fibro: fibroEscalation,
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
