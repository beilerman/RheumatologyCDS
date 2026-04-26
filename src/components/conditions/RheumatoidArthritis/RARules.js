function getDiseaseActivity(state) {
  const scores = state.scores || {};
  return (
    scores.cdai?.category ||
    scores.das28esr?.category ||
    scores.das28crp?.category ||
    scores.rapid3?.category ||
    null
  );
}

export const raRules = [
  // DMARD-naive, low DA
  {
    id: 'ra-naive-low-hcq',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return da === 'Low' && state.answers['ra-dmard-history'] === 'naive';
    },
    recommendation: 'Initiate hydroxychloroquine',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Hydroxychloroquine is conditionally recommended over other csDMARDs for DMARD-naive RA with low disease activity due to favorable tolerability.',
  },
  // DMARD-naive, moderate/high DA
  {
    id: 'ra-naive-mod-high-mtx',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return (
        ['Moderate', 'High'].includes(da) &&
        state.answers['ra-dmard-history'] === 'naive'
      );
    },
    recommendation: 'Initiate methotrexate monotherapy',
    strength: 'strong',
    guideline: 'ACR_RA_2021',
    rationale:
      'Methotrexate is strongly recommended as first-line DMARD for DMARD-naive RA with moderate-to-high disease activity.',
    specialPopulations: [
      {
        condition: (s) => s.answers['ra-hepatitis-b'] === true,
        note: 'Screen for hepatitis B before initiating methotrexate.',
      },
      {
        condition: (s) => s.answers['ra-hepatitis-c'] === true,
        note: 'Screen for hepatitis C before initiating methotrexate.',
      },
    ],
  },
  // On csDMARD with high DA + poor prognostic features — effectively failing
  {
    id: 'ra-on-csdmard-high-da-escalate',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      const onCsDMARD = state.answers['ra-dmard-history'] === 'on-csDMARD';
      const poorPrognostic = state.answers['ra-functional-status'] === 'worsened' ||
        state.answers['ra-new-joints'] === true ||
        (state.answers['ra-flares-since-last'] != null && state.answers['ra-flares-since-last'] >= 2);
      return da === 'High' && onCsDMARD && poorPrognostic;
    },
    recommendation:
      'High disease activity despite csDMARD with poor prognostic features. Escalate to bDMARD or tsDMARD (conditionally recommended over triple therapy). Verify csDMARD dose is optimized (e.g., MTX 25 mg/week subcutaneous) before or concurrent with escalation.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'ACR 2021 conditionally recommends adding/switching to bDMARD or tsDMARD for patients with inadequate response to csDMARD monotherapy. High disease activity with worsening function, new joint involvement, or frequent flares indicates inadequate response even if formally still "on" csDMARD.',
    specialPopulations: [
      {
        condition: (s) => s.answers['ra-age-50-plus'] === true && s.answers['ra-cv-risk-factors'] === true,
        note: 'FDA BOXED WARNING: Prefer bDMARD over JAKi — patient is ≥50 with CV risk factors (ORAL Surveillance).',
      },
      {
        condition: (s) => s.answers['ra-hepatitis-b'] === true,
        note: 'Hepatitis B positive: Antiviral prophylaxis required before biologic initiation.',
      },
      {
        condition: (s) => {
          const ea = s.answers['ra-extraarticular'];
          return Array.isArray(ea) && ea.includes('ILD');
        },
        note: 'ILD present: Consider rituximab or abatacept. Avoid methotrexate if not already tolerated. Use caution with TNFi.',
      },
      {
        condition: (s) => s.answers['ra-heart-failure'] === true,
        note: 'Heart failure: Avoid TNF inhibitors. Consider non-TNF bDMARD or tsDMARD.',
      },
      {
        condition: (s) => s.answers['ra-prior-serious-infection'] === true,
        note: 'Prior serious infection: Shared decision-making required. Abatacept may have lower infection risk.',
      },
    ],
  },
  // On csDMARD with high DA but no poor prognostic features yet
  {
    id: 'ra-on-csdmard-high-da-optimize',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      const onCsDMARD = state.answers['ra-dmard-history'] === 'on-csDMARD';
      const poorPrognostic = state.answers['ra-functional-status'] === 'worsened' ||
        state.answers['ra-new-joints'] === true ||
        (state.answers['ra-flares-since-last'] != null && state.answers['ra-flares-since-last'] >= 2);
      return da === 'High' && onCsDMARD && !poorPrognostic;
    },
    recommendation:
      'High disease activity on csDMARD. Optimize current csDMARD dose (e.g., MTX up to 25 mg/week, consider subcutaneous route). Reassess in 3 months. If not at target, escalate to bDMARD or tsDMARD.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Per treat-to-target strategy, treatment should be adapted if disease activity remains moderate-to-high. Dose optimization of csDMARD should be attempted before escalation, but persistent high disease activity at 3 months warrants biologic discussion.',
  },
  // On csDMARD with moderate DA
  {
    id: 'ra-on-csdmard-moderate-da',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return da === 'Moderate' && state.answers['ra-dmard-history'] === 'on-csDMARD';
    },
    recommendation:
      'Moderate disease activity on csDMARD. Optimize dose and reassess in 3 months. Target is remission or low disease activity.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Treat-to-target approach: therapy should be adapted if remission or low disease activity is not achieved within 3 months.',
  },
  // csDMARD failure
  {
    id: 'ra-csdmard-fail-biologic',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return (
        ['Moderate', 'High'].includes(da) &&
        state.answers['ra-dmard-history'] === 'failed-csDMARD'
      );
    },
    recommendation:
      'Add or switch to a bDMARD or tsDMARD (conditionally recommended over triple therapy)',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'For patients with moderate-to-high disease activity despite csDMARD, bDMARD or tsDMARD is conditionally recommended over triple therapy (MTX+HCQ+SSZ). Triple therapy is an acceptable alternative if cost/access is a barrier.',
  },
  {
    id: 'ra-csdmard-fail-triple-alt',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return (
        ['Moderate', 'High'].includes(da) &&
        state.answers['ra-dmard-history'] === 'failed-csDMARD'
      );
    },
    recommendation:
      'Alternative: Triple therapy (MTX + HCQ + SSZ) if biologic access is limited',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Triple therapy is an acceptable alternative to bDMARD/tsDMARD, especially when cost or access is a barrier.',
  },
  // bDMARD failure (non-TNFi)
  {
    id: 'ra-bdmard-fail-switch',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return (
        ['Moderate', 'High'].includes(da) &&
        state.answers['ra-dmard-history'] === 'failed-bDMARD' &&
        state.answers['ra-current-biologic-mechanism'] !== 'TNFi'
      );
    },
    recommendation:
      'Switch to a different bDMARD (same or different mechanism) or tsDMARD',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'After failure of a first bDMARD or tsDMARD, switching to another bDMARD or tsDMARD is recommended.',
  },
  // TNFi failure specifically
  {
    id: 'ra-tnfi-fail-switch',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return (
        ['Moderate', 'High'].includes(da) &&
        state.answers['ra-dmard-history'] === 'failed-bDMARD' &&
        state.answers['ra-current-biologic-mechanism'] === 'TNFi'
      );
    },
    recommendation:
      'Switch to a non-TNF bDMARD or tsDMARD (conditionally recommended over a second TNFi)',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'After failure of a TNF inhibitor, switching to a non-TNF biologic or tsDMARD is conditionally recommended over trying a second TNFi.',
  },
  // Glucocorticoid flags
  {
    id: 'ra-gc-long-term-flag',
    condition: (state) =>
      state.answers['ra-prednisone-duration'] === '>3 months',
    recommendation:
      'Taper and discontinue glucocorticoids. Long-term use is strongly recommended against.',
    strength: 'strong',
    guideline: 'ACR_RA_2021',
    rationale:
      'ACR 2021 strongly recommends against long-term glucocorticoid use. Short-term bridge therapy during DMARD initiation/switch is acceptable.',
  },
  {
    id: 'ra-gc-bridge-ok',
    condition: (state) =>
      ['<1 month', '1-3 months'].includes(
        state.answers['ra-prednisone-duration']
      ),
    recommendation:
      'Short-term glucocorticoid bridge therapy is acceptable during DMARD initiation/switch. Document taper plan.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Short-course glucocorticoids are acceptable as bridge therapy while waiting for DMARD effect.',
  },
  // JAKi boxed warning at decision point
  {
    id: 'ra-jaki-cv-warning',
    condition: (state) => {
      const da = getDiseaseActivity(state);
      return (
        ['Moderate', 'High'].includes(da) &&
        ['failed-csDMARD', 'failed-bDMARD'].includes(state.answers['ra-dmard-history']) &&
        state.answers['ra-age-50-plus'] === true &&
        state.answers['ra-cv-risk-factors'] === true
      );
    },
    recommendation:
      'FDA BOXED WARNING — JAK inhibitors: Patient is ≥50 with CV risk factors. ORAL Surveillance trial showed increased risk of MACE, VTE, malignancy, and death with tofacitinib vs. TNFi. Prefer bDMARD over JAKi unless bDMARDs have failed or are contraindicated.',
    strength: 'strong',
    guideline: 'ACR_RA_2021',
    rationale:
      'ACR 2021 conditionally recommends bDMARDs over JAKi for patients ≥50 with CV risk factors based on ORAL Surveillance safety signals. FDA boxed warning applies to all JAK inhibitors (tofacitinib, baricitinib, upadacitinib).',
  },
  // ILD safety warning
  {
    id: 'ra-ild-mtx-caution',
    condition: (state) => {
      const ea = state.answers['ra-extraarticular'];
      const hasILD = Array.isArray(ea) && ea.includes('ILD');
      const onMTX = (state.medications?.current || []).includes('methotrexate');
      return hasILD && onMTX;
    },
    recommendation:
      'ILD present while on methotrexate: MTX is associated with pulmonary toxicity. Discuss with rheumatology whether to continue, reduce, or switch. Rituximab or abatacept may be preferred biologics in RA-ILD.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Methotrexate can cause or worsen interstitial lung disease. In patients with established RA-ILD, the risk-benefit should be carefully assessed. Rituximab and abatacept have better safety profiles in ILD.',
  },
  // TB screening at biologic decision point
  {
    id: 'ra-tb-screening-reminder',
    condition: (state) =>
      ['failed-csDMARD', 'failed-bDMARD'].includes(state.answers['ra-dmard-history']) &&
      state.answers['ra-tb-screening-done'] !== true,
    recommendation:
      'TB screening (PPD or IGRA) is REQUIRED before initiating any biologic or JAK inhibitor. Do not start therapy until TB status is confirmed.',
    strength: 'strong',
    guideline: 'ACR_RA_2021',
    rationale:
      'All biologic and targeted synthetic DMARDs increase risk of reactivation TB. Screening is mandatory before initiation and should be repeated annually while on therapy.',
  },
  // Special populations
  {
    id: 'ra-special-hf-avoid-tnfi',
    condition: (state) =>
      state.answers['ra-heart-failure'] === true &&
      ['failed-csDMARD', 'failed-bDMARD'].includes(
        state.answers['ra-dmard-history']
      ),
    recommendation:
      'Avoid TNF inhibitors in patients with heart failure (especially at high doses). Consider non-TNF bDMARD or tsDMARD.',
    strength: 'strong',
    guideline: 'ACR_RA_2021',
    rationale:
      'TNF inhibitors can worsen heart failure. Non-TNF biologics or tsDMARDs are preferred in this population.',
  },
  {
    id: 'ra-special-lymph-rituximab',
    condition: (state) =>
      state.answers['ra-lymphoproliferative-history'] === true &&
      ['failed-csDMARD', 'failed-bDMARD'].includes(
        state.answers['ra-dmard-history']
      ),
    recommendation:
      'Rituximab may be preferred in patients with history of lymphoproliferative disorder. Avoid TNF inhibitors.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'TNF inhibitors should be avoided with a history of lymphoproliferative disorder. Rituximab is a preferred alternative.',
  },
  {
    id: 'ra-special-hepb-screen',
    condition: (state) =>
      state.answers['ra-hepatitis-b'] === true &&
      ['failed-csDMARD', 'failed-bDMARD', 'naive'].includes(
        state.answers['ra-dmard-history']
      ),
    recommendation:
      'Hepatitis B positive: Ensure screening is complete and antiviral prophylaxis is in place before initiating bDMARD/tsDMARD.',
    strength: 'strong',
    guideline: 'ACR_RA_2021',
    rationale:
      'Hepatitis B can reactivate with biologic or targeted synthetic DMARDs. Antiviral prophylaxis is required.',
  },
  {
    id: 'ra-special-hepc-screen',
    condition: (state) =>
      state.answers['ra-hepatitis-c'] === true &&
      ['failed-csDMARD', 'failed-bDMARD', 'naive'].includes(
        state.answers['ra-dmard-history']
      ),
    recommendation:
      'Hepatitis C positive: Consider hepatology referral before initiating bDMARD/tsDMARD.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Hepatitis C should be treated or managed before immunosuppressive therapy if possible.',
  },
  {
    id: 'ra-special-infection-caution',
    condition: (state) =>
      state.answers['ra-prior-serious-infection'] === true &&
      ['failed-csDMARD', 'failed-bDMARD'].includes(
        state.answers['ra-dmard-history']
      ),
    recommendation:
      'History of serious infection: Shared decision-making required for biologic selection. Some bDMARDs may carry lower infection risk.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'Patients with prior serious infections require careful risk-benefit discussion when choosing biologics.',
  },
  {
    id: 'ra-special-ntb-lung',
    condition: (state) =>
      state.answers['ra-ntb-lung-disease'] === true &&
      ['failed-csDMARD', 'failed-bDMARD'].includes(
        state.answers['ra-dmard-history']
      ),
    recommendation:
      'Prior non-TB mycobacterial lung disease: Avoid bDMARDs/tsDMARDs if possible. If needed, careful monitoring required.',
    strength: 'conditional',
    guideline: 'ACR_RA_2021',
    rationale:
      'bDMARDs and tsDMARDs may exacerbate non-TB mycobacterial infections.',
  },
];
