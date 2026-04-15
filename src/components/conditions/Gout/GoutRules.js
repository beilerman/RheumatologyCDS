const CKD_STAGE_3_PLUS = ['3a', '3b', '4', '5'];

function ultIndicated(state) {
  const a = state.answers;
  return (
    a['gout-tophi'] === true ||
    a['gout-radiographic-damage'] === true ||
    (a['gout-flare-frequency'] != null && a['gout-flare-frequency'] >= 2)
  );
}

function ultConditionalRisk(state) {
  const a = state.answers;
  const freq = a['gout-flare-frequency'];
  if (freq == null || freq < 1) return false;
  return (
    CKD_STAGE_3_PLUS.includes(a['gout-ckd-stage']) ||
    (a['gout-serum-urate'] != null && a['gout-serum-urate'] > 9) ||
    a['gout-nephrolithiasis'] === true
  );
}

export const goutRules = [
  // ULT indications - strong
  {
    id: 'gout-ult-indicated-strong',
    condition: (state) => !state.answers['gout-on-ult'] && ultIndicated(state),
    recommendation: 'Urate-lowering therapy (ULT) is strongly recommended (tophi, radiographic damage attributable to gout, or >=2 flares/year).',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'ACR 2020 strongly recommends ULT for patients with tophi, radiographic damage (erosions) attributable to gout, or frequent flares (>=2/year).',
  },
  // ULT indications - conditional
  {
    id: 'gout-ult-indicated-conditional-risk',
    condition: (state) => !state.answers['gout-on-ult'] && !ultIndicated(state) && ultConditionalRisk(state),
    recommendation: 'ULT is conditionally recommended (first flare with CKD >=3, serum urate >9, or urolithiasis).',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale: 'ACR 2020 conditionally recommends ULT for first flare with risk factors: CKD stage >=3, serum urate >9 mg/dL, or urolithiasis.',
  },
  // ULT first-line
  {
    id: 'gout-ult-allopurinol-first',
    condition: (state) => !state.answers['gout-on-ult'] && (ultIndicated(state) || ultConditionalRisk(state)),
    recommendation: 'Allopurinol is strongly recommended as first-line ULT. Start <=100 mg/day (<=50 mg/day if eGFR <30). Titrate by 100 mg every 2-5 weeks to target SU <6 mg/dL. Max 800 mg/day.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Allopurinol is strongly recommended over all other ULT agents as first-line, including in patients with CKD stage >=3.',
    specialPopulations: [
      {
        condition: (s) => s.answers['gout-ckd-stage'] && ['3b', '4', '5'].includes(s.answers['gout-ckd-stage']),
        note: 'CKD: Start at 50 mg/day. Titrate by 50 mg increments.',
      },
    ],
  },
  // HLA-B*5801 screening before allopurinol
  {
    id: 'gout-hla-b5801-screening',
    condition: (state) => {
      const a = state.answers;
      return (
        !a['gout-on-ult'] &&
        (ultIndicated(state) || ultConditionalRisk(state)) &&
        a['gout-high-risk-ethnicity'] === true &&
        a['gout-hla-b5801-tested'] !== true
      );
    },
    recommendation: 'HLA-B*5801 testing is conditionally recommended before starting allopurinol in patients of Southeast Asian or African American descent. Do NOT start allopurinol until result is available.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale: 'ACR 2020 conditionally recommends HLA-B*5801 testing prior to allopurinol in Southeast Asian (e.g., Korean, Han Chinese, Thai) and African American patients due to higher prevalence of the allele associated with severe allopurinol hypersensitivity syndrome (AHS).',
  },
  {
    id: 'gout-hla-b5801-positive-avoid',
    condition: (state) =>
      state.answers['gout-hla-b5801-positive'] === true,
    recommendation: 'HLA-B*5801 POSITIVE: Do NOT use allopurinol. Use febuxostat as alternative ULT (with CV risk discussion if applicable).',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Patients who are HLA-B*5801 positive have a markedly increased risk of severe allopurinol hypersensitivity syndrome. Allopurinol is contraindicated. Febuxostat is the recommended alternative.',
  },
  // ULT titration
  {
    id: 'gout-ult-titrate-up',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] >= 6,
    recommendation: 'Serum urate is not at target (<6 mg/dL). Titrate ULT dose upward per treat-to-target strategy.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Treat-to-target is strongly recommended. Titrate ULT to achieve and maintain serum urate <6 mg/dL.',
  },
  {
    id: 'gout-ult-at-target',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] < 6,
    recommendation: 'Serum urate is at target (<6 mg/dL). Continue current ULT dose. Recheck in 6 months.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Maintaining serum urate <6 mg/dL prevents flares and resolves tophi over time.',
  },
  // Acute flare
  {
    id: 'gout-acute-flare',
    condition: (state) => state.answers['gout-current-flare'] === true,
    recommendation: 'Acute flare: First-line options include colchicine (1.2 mg then 0.6 mg in 1 hour, within 36h of onset), NSAIDs (full dose), or glucocorticoids (oral or intra-articular). Combination therapy for severe flares. Do NOT stop current ULT during a flare.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'ACR 2020 strongly recommends against stopping ULT during a flare. Early treatment with colchicine, NSAIDs, or glucocorticoids is recommended.',
  },
  // Flare prophylaxis
  {
    id: 'gout-prophylaxis-needed',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] >= 6 &&
      state.answers['gout-flare-prophylaxis'] === false,
    recommendation: 'Flare prophylaxis is strongly recommended during ULT initiation/titration. Options: colchicine 0.6 mg daily or BID, low-dose NSAID, or low-dose glucocorticoid. Continue for >=3-6 months.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'ACR 2020 strongly recommends prophylaxis during ULT initiation and titration, for a minimum of 3-6 months and continued if flares persist.',
  },
  // Febuxostat CV warning
  {
    id: 'gout-febuxostat-cv-warning',
    condition: (state) =>
      state.answers['gout-ult-medication'] === 'febuxostat' &&
      state.answers['gout-cvd'] === true,
    recommendation: 'Febuxostat FDA boxed warning: Increased risk of cardiovascular death in patients with established CVD. Discuss risks with patient. Consider switching to allopurinol if possible.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'CARES trial showed increased CV mortality with febuxostat vs allopurinol. FDA boxed warning applies.',
  },
  // Concurrent medications
  {
    id: 'gout-concurrent-losartan',
    condition: (state) => state.answers['gout-hypertension'] === true,
    recommendation: 'Losartan is conditionally recommended as preferred antihypertensive (mild uricosuric effect).',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Losartan has a mild uricosuric effect that may benefit gout patients with hypertension.',
  },
  // Lifestyle
  {
    id: 'gout-lifestyle-alcohol',
    condition: (state) => ['moderate', 'heavy'].includes(state.answers['gout-alcohol']),
    recommendation: 'Limit alcohol intake, especially beer and spirits. Alcohol increases urate production and impairs excretion.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale: 'ACR 2020 conditionally recommends limiting alcohol, particularly beer and spirits, for gout management.',
  },
  {
    id: 'gout-lifestyle-diet',
    condition: (state) => state.answers['gout-purine-diet'] === 'non-adherent',
    recommendation: 'Limit high-purine organ meats and high-fructose corn syrup beverages.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Dietary modification alone is insufficient to reach target urate but is part of comprehensive gout management.',
  },
  {
    id: 'gout-lifestyle-weight',
    condition: (state) => state.answers['gout-weight-change'] === 'gain',
    recommendation: 'Weight loss is recommended for overweight/obese patients with gout.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Weight loss can reduce serum urate levels and decrease gout flare frequency.',
  },
  // ULT adherence
  {
    id: 'gout-ult-adherence-poor',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      ['partial', 'poor'].includes(state.answers['gout-ult-adherence']),
    recommendation: 'ULT adherence is suboptimal. Provide education on importance of continuous ULT for flare prevention and tophus resolution. Address barriers to adherence.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale: 'Discontinuous ULT use is associated with rebound flares and failure to achieve target urate.',
  },
];
