// ACR/SAA/SPARTAN 2019 axial spondyloarthritis treatment rules

export const axspaRules = [
  // NSAIDs first-line
  {
    id: 'axspa-nsaid-first',
    condition: (state) =>
      ['naive', 'on-nsaid'].includes(state.answers['axspa-treatment-status']),
    recommendation:
      'NSAIDs are strongly recommended as first-line therapy. Try at least 2 different NSAIDs for >=4 weeks each before declaring inadequate response.',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'ACR/SAA/SPARTAN 2019 strongly recommends continuous NSAID therapy as the initial pharmacologic treatment for active axSpA. Adequate NSAID trial (>=4 weeks, two different agents) is required before escalating to biologic therapy.',
  },

  // Exercise for ALL patients
  {
    id: 'axspa-exercise-all',
    condition: () => true,
    recommendation:
      'Physical therapy and exercise are strongly recommended for ALL axSpA patients. This is a core intervention, not optional adjunctive therapy. Goal: regular exercise program.',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'Exercise is the single most important non-pharmacologic intervention in axSpA. Regular physical therapy and home exercise programs improve spinal mobility, reduce disease activity, and prevent functional decline. This recommendation applies regardless of disease stage or treatment.',
  },

  // NSAID failure → TNFi
  {
    id: 'axspa-nsaid-fail-tnfi',
    condition: (state) => {
      const da = state.scores?.basdai?.category || state.scores?.asdasCrp?.category;
      return (
        state.answers['axspa-treatment-status'] === 'failed-nsaid' &&
        ['Active', 'High', 'Very High'].includes(da)
      );
    },
    recommendation:
      'TNF inhibitor strongly recommended after inadequate NSAID response with active disease (BASDAI >=4 or ASDAS >=2.1).',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'After failure of two NSAIDs (>=4 weeks each), patients with active disease (BASDAI >=4 or ASDAS-CRP >=2.1) should be escalated to a biologic. TNF inhibitors (adalimumab, certolizumab, etanercept, golimumab, infliximab) have the strongest evidence base in axSpA.',
  },

  // TNFi failure → IL-17i
  {
    id: 'axspa-tnfi-fail-il17',
    condition: (state) =>
      state.answers['axspa-treatment-status'] === 'failed-TNFi',
    recommendation:
      'IL-17 inhibitor (secukinumab or ixekizumab) recommended after TNFi failure.',
    strength: 'conditional',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'After TNFi failure (primary or secondary non-response), switching to an IL-17 inhibitor is conditionally recommended. Secukinumab and ixekizumab have demonstrated efficacy in axSpA including after TNFi failure.',
  },

  // IL-17i failure → JAKi
  {
    id: 'axspa-il17-fail-jaki',
    condition: (state) =>
      state.answers['axspa-treatment-status'] === 'failed-IL17i',
    recommendation:
      'JAK inhibitor (tofacitinib or upadacitinib) as alternative after TNFi and IL-17i failure.',
    strength: 'conditional',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'JAK inhibitors are an option for patients who have failed TNFi and IL-17i therapy. Tofacitinib and upadacitinib are approved for active ankylosing spondylitis/nr-axSpA. Use with caution given FDA boxed warnings regarding cardiovascular risk, malignancy, and thrombosis.',
  },

  // csDMARDs NOT effective for axial disease
  {
    id: 'axspa-csdmard-not-effective',
    condition: () => true,
    recommendation:
      'Reminder: csDMARDs (methotrexate, sulfasalazine, leflunomide) are NOT effective for axial disease symptoms.',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'No evidence supports csDMARD efficacy for axial spondyloarthritis. Methotrexate, leflunomide, and sulfasalazine should not be used to treat axial symptoms. These agents are not recommended for axSpA unless peripheral arthritis is present (sulfasalazine only).',
  },

  // Sulfasalazine for peripheral arthritis only
  {
    id: 'axspa-ssz-peripheral',
    condition: (state) => state.answers['axspa-peripheral-joints'] === true,
    recommendation:
      'Sulfasalazine may be considered for peripheral arthritis component only (not axial symptoms).',
    strength: 'conditional',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'When peripheral joint arthritis is present alongside axial disease, sulfasalazine is conditionally recommended as it has some evidence for peripheral joint inflammation in spondyloarthropathy. It has no effect on axial symptoms.',
  },

  // Systemic GC not recommended for axial disease
  {
    id: 'axspa-gc-not-recommended',
    condition: (state) => state.answers['axspa-on-systemic-gc'] === true,
    recommendation:
      'Systemic glucocorticoids are generally NOT recommended for axial disease. Local injection at site of inflammation (SI joint, enthesitis) may be considered.',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'ACR/SAA/SPARTAN 2019 strongly recommends against systemic glucocorticoids for axial spondyloarthritis due to lack of efficacy and significant long-term side effects. Local corticosteroid injections (sacroiliac joint, entheseal sites) are acceptable for targeted relief.',
  },

  // Uveitis — urgent ophthalmology referral
  {
    id: 'axspa-uveitis',
    condition: (state) => state.answers['axspa-uveitis-current'] === true,
    recommendation:
      'Urgent ophthalmology referral for anterior uveitis.',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'Anterior uveitis occurs in up to 40% of axSpA patients and is a medical urgency. Immediate ophthalmology evaluation is required to prevent vision loss. TNFi monoclonal antibodies (adalimumab, infliximab, certolizumab) reduce uveitis flare frequency. Etanercept is less effective for uveitis prevention.',
  },

  // IBD symptoms — GI referral, caution with IL-17i
  {
    id: 'axspa-ibd-symptoms',
    condition: (state) => state.answers['axspa-ibd-symptoms'] === true,
    recommendation:
      'New GI symptoms suggestive of IBD. GI referral recommended. Caution with IL-17 inhibitors.',
    strength: 'strong',
    guideline: 'ACR_axSpA_2019',
    rationale:
      'IBD (Crohn\'s disease, ulcerative colitis) is a recognized extra-articular manifestation of axSpA, occurring in ~10% of patients. New GI symptoms warrant gastroenterology referral. IL-17 inhibitors can exacerbate or unmask IBD and should be avoided or used with caution. TNFi monoclonal antibodies are preferred when concurrent IBD is present.',
  },
];
