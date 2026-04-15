export const AXSPA_QUESTION_GROUPS = [
  // ─── Symptoms Section ───────────────────────────────────────────────────────
  {
    id: 'axspa-symptoms',
    title: 'Symptoms & Function',
    section: 'symptoms',
    questions: [
      {
        id: 'axspa-inflammatory-back-pain',
        label: 'Inflammatory back pain present?',
        type: 'toggle',
        tooltip:
          '>=30 min morning stiffness, improves with exercise but not rest, insidious onset before age 40, nocturnal pain improving on rising — all suggest inflammatory back pain.',
      },
      {
        id: 'axspa-morning-stiffness-duration',
        label: 'Morning stiffness duration (minutes)',
        type: 'numeric',
        min: 0,
        max: 240,
        tooltip:
          'Duration of morning stiffness in minutes. >=30 min is characteristic of inflammatory back pain. Used in BASDAI Q6.',
      },
      {
        id: 'axspa-back-pain-location',
        label: 'Predominant back pain location',
        type: 'dropdown',
        options: [
          { value: 'sacroiliac', label: 'Sacroiliac joints' },
          { value: 'lumbar', label: 'Lumbar spine' },
          { value: 'thoracic', label: 'Thoracic spine' },
          { value: 'cervical', label: 'Cervical spine' },
        ],
        tooltip:
          'Sacroiliac joint and lumbar spine involvement is most common in axSpA. Cervical involvement may indicate more advanced disease.',
      },
      {
        id: 'axspa-peripheral-joints',
        label: 'Peripheral joint arthritis present?',
        type: 'toggle',
        tooltip:
          'Peripheral arthritis (hip, shoulder, knee, ankle, wrists, small joints) can occur in axSpA. Sulfasalazine may be considered for peripheral involvement only.',
      },
      {
        id: 'axspa-enthesitis-sites',
        label: 'Active enthesitis sites (select all that apply)',
        type: 'multiselect',
        options: [
          { value: 'heel', label: 'Heel (Achilles / plantar fascia)' },
          { value: 'chest-wall', label: 'Chest wall (costochondral junctions)' },
          { value: 'iliac-crest', label: 'Iliac crest' },
          { value: 'greater-trochanter', label: 'Greater trochanter' },
        ],
        tooltip:
          'Enthesitis is inflammation at tendon/ligament insertion sites. It is a hallmark of spondyloarthropathy.',
      },
      {
        id: 'axspa-functional-status',
        label: 'Functional status since last visit',
        type: 'radio',
        options: [
          { value: 'improved', label: 'Improved' },
          { value: 'stable', label: 'Stable' },
          { value: 'worsened', label: 'Worsened' },
        ],
      },
      {
        id: 'axspa-exercise-adherence',
        label: 'Exercise adherence',
        type: 'dropdown',
        options: [
          { value: 'none', label: 'None / sedentary' },
          { value: 'occasional', label: 'Occasional (< 3x/week)' },
          { value: 'regular', label: 'Regular (>= 3x/week)' },
        ],
        tooltip:
          'Regular exercise is strongly recommended for all axSpA patients. Lack of exercise is a modifiable risk factor for functional decline.',
      },
      {
        id: 'axspa-exercise-type',
        label: 'Exercise type (if regular)',
        type: 'text',
        tooltip: 'e.g., swimming, stretching, yoga, walking',
      },
      {
        id: 'axspa-sleep-quality',
        label: 'Sleep quality (0 = excellent, 10 = severely disrupted)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip:
          'Night pain and early morning waking are characteristic of inflammatory back pain in axSpA.',
      },
      {
        id: 'axspa-flares',
        label: 'Number of flares since last visit',
        type: 'numeric',
        min: 0,
        max: 50,
      },
    ],
  },

  // ─── Associated Features Section ────────────────────────────────────────────
  {
    id: 'axspa-associated',
    title: 'Associated Features & Treatment Context',
    section: 'symptoms',
    questions: [
      {
        id: 'axspa-uveitis-history',
        label: 'History of anterior uveitis?',
        type: 'toggle',
        tooltip:
          'Anterior uveitis occurs in ~40% of axSpA patients over their lifetime. History influences biologic choice: prefer TNFi monoclonal antibodies over etanercept for uveitis prevention.',
      },
      {
        id: 'axspa-uveitis-current',
        label: 'Current symptoms of uveitis (eye redness, pain, photophobia, blurred vision)?',
        type: 'toggle',
        tooltip:
          'RED FLAG: Active uveitis requires urgent ophthalmology evaluation to prevent vision loss.',
      },
      {
        id: 'axspa-ibd-symptoms',
        label: 'GI symptoms suggestive of IBD (diarrhea, blood in stool, abdominal pain)?',
        type: 'toggle',
        tooltip:
          'IBD is an extra-articular manifestation of axSpA. Caution with IL-17 inhibitors if IBD is present or suspected.',
      },
      {
        id: 'axspa-psoriasis',
        label: 'Psoriasis present?',
        type: 'toggle',
        tooltip:
          'Psoriasis is an extra-articular feature of spondyloarthropathy and may influence biologic selection.',
      },
      {
        id: 'axspa-on-systemic-gc',
        label: 'Currently on systemic glucocorticoids?',
        type: 'toggle',
        tooltip:
          'Systemic GCs are generally NOT recommended for axial disease. If currently on GCs, discuss tapering at this visit.',
      },
      {
        id: 'axspa-treatment-status',
        label: 'Treatment history',
        type: 'dropdown',
        options: [
          { value: 'naive', label: 'Treatment-naive' },
          { value: 'on-nsaid', label: 'Currently on NSAID' },
          { value: 'failed-nsaid', label: 'Failed NSAID (>=2 agents, >=4 weeks each)' },
          { value: 'on-TNFi', label: 'Currently on TNF inhibitor' },
          { value: 'failed-TNFi', label: 'Failed TNF inhibitor' },
          { value: 'on-IL17i', label: 'Currently on IL-17 inhibitor' },
          { value: 'failed-IL17i', label: 'Failed IL-17 inhibitor' },
        ],
        tooltip:
          'Treatment history determines the appropriate step in the ACR/SAA/SPARTAN 2019 algorithm.',
      },
      {
        id: 'axspa-tb-screening-done',
        label: 'TB screening (PPD or IGRA) completed?',
        type: 'toggle',
        showWhen: (answers) =>
          ['failed-nsaid', 'failed-TNFi', 'failed-IL17i'].includes(answers['axspa-treatment-status']),
        tooltip: 'TB screening is required before initiating any biologic or JAK inhibitor.',
      },
    ],
  },

  // ─── BASDAI Scoring Section ──────────────────────────────────────────────────
  {
    id: 'axspa-basdai',
    title: 'BASDAI (Bath Ankylosing Spondylitis Disease Activity Index)',
    section: 'scoring',
    questions: [
      {
        id: 'axspa-basdai-q1',
        label: 'Q1: Fatigue (0 = none, 10 = very severe)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'BASDAI Q1: How would you describe the overall level of fatigue/tiredness you have experienced?',
      },
      {
        id: 'axspa-basdai-q2',
        label: 'Q2: Spinal pain (0 = none, 10 = very severe)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'BASDAI Q2: How would you describe the overall level of AS neck, back, or hip pain you have had?',
      },
      {
        id: 'axspa-basdai-q3',
        label: 'Q3: Joint pain / swelling (0 = none, 10 = very severe)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'BASDAI Q3: How would you describe the overall level of pain/swelling in joints other than neck, back and hips?',
      },
      {
        id: 'axspa-basdai-q4',
        label: 'Q4: Enthesitis discomfort (0 = none, 10 = very severe)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'BASDAI Q4: How would you describe the overall level of discomfort you have had from areas tender to touch or pressure?',
      },
      {
        id: 'axspa-basdai-q5',
        label: 'Q5: Morning stiffness severity (0 = none, 10 = very severe)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'BASDAI Q5: How would you describe the overall level of morning stiffness you have had from the time you wake up?',
      },
      {
        id: 'axspa-basdai-q6',
        label: 'Q6: Morning stiffness duration (0 = 0 hrs, 10 = 2+ hrs)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'BASDAI Q6: How long does morning stiffness last from wake-up? (0 = 0 hours, 10 = 2 or more hours)',
      },
    ],
  },

  // ─── Labs / ASDAS Inputs Section ────────────────────────────────────────────
  {
    id: 'axspa-labs',
    title: 'Laboratory Values & ASDAS Inputs',
    section: 'scoring',
    questions: [
      {
        id: 'axspa-crp',
        label: 'CRP (mg/L)',
        type: 'numeric',
        min: 0,
        max: 500,
        tooltip: 'C-reactive protein. Used in ASDAS-CRP calculation. Normal <10 mg/L.',
      },
      {
        id: 'axspa-esr',
        label: 'ESR (mm/hr)',
        type: 'numeric',
        min: 0,
        max: 150,
        tooltip: 'Erythrocyte sedimentation rate. Used in ASDAS-ESR calculation.',
      },
      {
        id: 'axspa-patient-global',
        label: 'Patient global assessment (0 = very good, 10 = very bad)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'ASDAS input: Patient global assessment of disease activity.',
      },
    ],
  },
];
