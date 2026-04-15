// ACR/NPF 2018 + GRAPPA 2021 domain-based PsA treatment rules

export const psaRules = [
  // --- Treatment-naive peripheral disease ---
  {
    id: 'psa-naive-mild-csdmard',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'naive' &&
      state.answers['psa-dominant-domain'] === 'peripheral' &&
      state.answers['psa-severity'] === 'mild',
    recommendation: 'Initiate a conventional synthetic DMARD (methotrexate preferred) for mild peripheral PsA',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'For treatment-naive patients with mild peripheral PsA, a csDMARD (preferably methotrexate) is conditionally recommended over NSAIDs or no therapy. csDMARDs address joint and skin disease simultaneously.',
  },
  {
    id: 'psa-naive-moderate-csdmard-or-tnfi',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'naive' &&
      state.answers['psa-dominant-domain'] === 'peripheral' &&
      state.answers['psa-severity'] === 'moderate',
    recommendation: 'Initiate csDMARD (methotrexate preferred) or TNF inhibitor for moderate peripheral PsA',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'For treatment-naive moderate peripheral PsA, either a csDMARD or TNFi is conditionally recommended. TNFi may be preferred when there is significant skin involvement or poor prognostic features.',
  },
  {
    id: 'psa-naive-severe-tnfi',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'naive' &&
      state.answers['psa-dominant-domain'] === 'peripheral' &&
      state.answers['psa-severity'] === 'severe',
    recommendation: 'Initiate a TNF inhibitor for severe peripheral PsA (direct-to-biologic strategy)',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'For treatment-naive patients with severe peripheral PsA, direct initiation of a TNFi is conditionally recommended over csDMARD monotherapy given the high burden of disease and risk of joint damage.',
  },

  // --- Axial disease ---
  {
    id: 'psa-axial-biologic',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'axial' &&
      ['failed-nsaid', 'on-csDMARD', 'failed-csDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'Initiate a TNF inhibitor or IL-17 inhibitor for axial-dominant PsA after NSAID failure',
    strength: 'strong',
    guideline: 'GRAPPA_2021',
    rationale:
      'GRAPPA 2021 strongly recommends TNFi or IL-17i for axial PsA not controlled by NSAIDs. Both drug classes have demonstrated efficacy in axial disease.',
  },
  {
    id: 'psa-axial-csdmard-not-effective',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'axial' &&
      ['failed-nsaid', 'on-csDMARD', 'failed-csDMARD', 'naive'].includes(state.answers['psa-treatment-status']),
    recommendation: 'Note: csDMARDs (methotrexate, leflunomide, sulfasalazine) are NOT effective for axial PsA',
    strength: 'strong',
    guideline: 'GRAPPA_2021',
    rationale:
      'GRAPPA 2021 strongly notes that conventional DMARDs have not demonstrated efficacy for axial manifestations of PsA. Biologic therapy (TNFi or IL-17i) is required for axial disease control.',
  },

  // --- Enthesitis ---
  {
    id: 'psa-enthesitis-biologic',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'enthesitis' &&
      ['failed-nsaid', 'failed-csDMARD', 'on-csDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'Initiate a biologic DMARD (TNFi or IL-17i) for enthesitis not controlled by NSAIDs/local therapy',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'For enthesitis refractory to NSAIDs and local corticosteroid injections, biologic DMARDs are recommended. TNFi and IL-17i have demonstrated efficacy for enthesitis resolution.',
  },

  // --- Dactylitis ---
  {
    id: 'psa-dactylitis-biologic',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'dactylitis' &&
      ['failed-nsaid', 'failed-csDMARD', 'on-csDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'Initiate a biologic DMARD (TNFi or IL-17i) for dactylitis refractory to local/csDMARD therapy',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'Dactylitis not controlled by csDMARDs or local corticosteroid injections should be treated with a biologic. TNFi and IL-17i are both effective for dactylitis.',
  },

  // --- Significant skin disease + csDMARD failure ---
  {
    id: 'psa-skin-preferred-biologic',
    condition: (state) => {
      const skinSeverity = state.answers['psa-skin-severity'];
      const treatmentStatus = state.answers['psa-treatment-status'];
      const significantSkin = ['moderate3-10%', 'severe>10%'].includes(skinSeverity);
      const hadCsDMARD = ['failed-csDMARD', 'on-bDMARD', 'failed-bDMARD'].includes(treatmentStatus);
      return significantSkin && hadCsDMARD;
    },
    recommendation: 'Prefer TNFi or IL-17i (secukinumab/ixekizumab) when significant psoriasis skin involvement (BSA >3%) is present',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'When skin disease is significant (BSA >3% or moderate-severe psoriasis), biologics with superior skin efficacy — particularly IL-17i or IL-23i — are preferred over TNFi to address both joint and skin domains simultaneously.',
  },

  // --- csDMARD failure → biologic ---
  {
    id: 'psa-csdmard-fail-biologic',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'failed-csDMARD',
    recommendation: 'Escalate to a biologic DMARD (TNFi, IL-17i, IL-12/23i, or IL-23i) after csDMARD failure',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'Patients with active PsA despite csDMARD therapy should escalate to a biologic. Choice of biologic should consider dominant disease domain, skin severity, comorbidities (IBD, uveitis), and patient preference.',
  },

  // --- Apremilast option ---
  {
    id: 'psa-apremilast-option',
    condition: (state) =>
      ['failed-csDMARD', 'on-csDMARD', 'naive'].includes(state.answers['psa-treatment-status']) &&
      state.answers['psa-severity'] !== 'severe',
    recommendation: 'Apremilast (PDE4 inhibitor) is an oral option for mild-to-moderate PsA, particularly when biologics are not preferred',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale:
      'Apremilast is conditionally recommended for active PsA as an alternative to biologics, especially when patients prefer oral therapy, have contraindications to biologics, or have mild-to-moderate disease.',
  },

  // --- TB screening at biologic decision point ---
  {
    id: 'psa-tb-screening-reminder',
    condition: (state) =>
      ['failed-csDMARD', 'failed-bDMARD', 'failed-nsaid'].includes(state.answers['psa-treatment-status']) &&
      state.answers['psa-tb-screening-done'] !== true,
    recommendation:
      'TB screening (PPD or IGRA) is REQUIRED before initiating any biologic or JAK inhibitor. Do not start therapy until TB status is confirmed.',
    strength: 'strong',
    guideline: 'ACR_PsA_2018',
    rationale:
      'All biologic DMARDs increase risk of reactivation TB. Screening is mandatory before initiation and should be repeated annually while on therapy.',
  },

  // --- IBD caution with IL-17i ---
  {
    id: 'psa-il17-ibd-caution',
    condition: (state) => state.answers['psa-ibd-history'] === true,
    recommendation: 'Caution: IL-17 inhibitors may exacerbate or unmask inflammatory bowel disease. Avoid or use with caution in patients with IBD history.',
    strength: 'strong',
    guideline: 'ACR_PsA_2018',
    rationale:
      'IL-17 inhibitors (secukinumab, ixekizumab) are associated with new-onset or worsening IBD. In patients with a history of Crohn\'s disease or ulcerative colitis, prefer TNFi (particularly anti-TNF monoclonal antibodies) or JAKi over IL-17i.',
  },

  // --- Eye symptoms / uveitis ---
  {
    id: 'psa-uveitis-screen',
    condition: (state) => state.answers['psa-eye-symptoms'] === true,
    recommendation: 'RED FLAG: Suspected uveitis — urgent ophthalmology referral required. TNFi (monoclonal antibodies) preferred over IL-17i if biologic indicated.',
    strength: 'strong',
    guideline: 'ACR_PsA_2018',
    rationale:
      'Uveitis occurs in up to 25% of PsA patients and requires urgent ophthalmology evaluation. If biologic therapy is needed, TNFi monoclonal antibodies (adalimumab, infliximab, certolizumab) are preferred as they reduce uveitis flares. IL-17i and etanercept do not prevent uveitis.',
  },
];
