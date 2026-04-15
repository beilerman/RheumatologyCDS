export const fibroRules = [
  // Exercise — ALWAYS
  {
    id: 'fibro-exercise-always',
    condition: () => true,
    recommendation:
      'Aerobic exercise is strongly recommended. Graded exercise therapy. Goal: 150 min/week moderate intensity. Start low, progress gradually.',
    strength: 'strong',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Exercise is the single most effective intervention for fibromyalgia with strong evidence for pain and function improvement.',
  },
  // CBT
  {
    id: 'fibro-cbt',
    condition: () => true,
    recommendation:
      'Cognitive behavioral therapy (CBT) is strongly recommended. Surface availability and referral options.',
    strength: 'strong',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'CBT has strong evidence for improving pain, disability, and mood in fibromyalgia.',
  },
  // Mind-body
  {
    id: 'fibro-mind-body',
    condition: () => true,
    recommendation:
      'Consider mind-body practices: yoga, tai chi, or mindfulness-based stress reduction.',
    strength: 'conditional',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Mind-body therapies show moderate evidence for fibromyalgia symptom improvement.',
  },
  // Set realistic expectations — ALWAYS
  {
    id: 'fibro-expectations',
    condition: () => true,
    recommendation:
      'Set realistic expectations: Goal is function improvement, not pain elimination. Fibromyalgia management is primarily non-pharmacologic.',
    strength: 'strong',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Patient education about realistic outcomes is essential for adherence and satisfaction.',
  },
  // Duloxetine for depression/anxiety
  {
    id: 'fibro-duloxetine-depression',
    condition: (state) =>
      state.answers['fibro-depression-screen'] === 'positive' ||
      state.answers['fibro-anxiety-screen'] === 'positive',
    recommendation:
      'Duloxetine (30-60 mg) recommended for pain with comorbid depression or anxiety.',
    strength: 'conditional',
    guideline: 'EULAR_FIBRO_2016',
    rationale: 'SNRIs address both pain and mood symptoms in fibromyalgia.',
  },
  // Pregabalin for sleep
  {
    id: 'fibro-pregabalin-sleep',
    condition: (state) =>
      state.answers['fibro-sleep-quality'] != null &&
      state.answers['fibro-sleep-quality'] <= 4,
    recommendation:
      'Pregabalin (150-450 mg/day) recommended for pain with significant sleep disturbance.',
    strength: 'conditional',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Pregabalin addresses both pain and sleep disruption in fibromyalgia.',
  },
  // Amitriptyline
  {
    id: 'fibro-amitriptyline-sleep',
    condition: (state) =>
      state.answers['fibro-sleep-quality'] != null &&
      state.answers['fibro-sleep-quality'] <= 4,
    recommendation:
      'Amitriptyline (low-dose, 10-50 mg at bedtime) is an alternative for pain with sleep disturbance.',
    strength: 'conditional',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Low-dose amitriptyline improves sleep quality and reduces pain in fibromyalgia.',
  },
  // Against opioids
  {
    id: 'fibro-against-opioids',
    condition: (state) => state.answers['fibro-requesting-opioids'] === true,
    recommendation:
      'Opioids are strongly recommended AGAINST for fibromyalgia. Evidence shows no benefit and risk of harm.',
    strength: 'strong',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'EULAR 2016 strongly recommends against opioids for fibromyalgia due to lack of efficacy and addiction risk.',
  },
  // Against NSAIDs as primary
  {
    id: 'fibro-against-nsaids',
    condition: (state) => {
      const meds = state.medications?.current || [];
      return meds.some((m) => ['naproxen', 'ibuprofen', 'celecoxib'].includes(m));
    },
    recommendation:
      'NSAIDs are not recommended as primary treatment for fibromyalgia.',
    strength: 'strong',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'NSAIDs do not address central sensitization, the primary mechanism of fibromyalgia pain.',
  },
  // Polypharmacy flag
  {
    id: 'fibro-polypharmacy',
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
      return count > 2;
    },
    recommendation:
      'More than 2 fibromyalgia medications simultaneously. Review for efficacy — taper and discontinue medications without clear benefit rather than layering.',
    strength: 'strong',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Polypharmacy in fibromyalgia often reflects sequential additions without adequate trial evaluation. More medications does not equal better outcomes.',
  },
  // Medication trial evaluation
  {
    id: 'fibro-med-trial-eval',
    condition: (state) =>
      (state.medications?.current || []).length > 0 &&
      state.answers['fibro-med-trial-duration'] === '>8 weeks',
    recommendation:
      'Evaluate medication benefit after 4-8 weeks. If no clear improvement, taper and discontinue rather than adding more medications.',
    strength: 'conditional',
    guideline: 'EULAR_FIBRO_2016',
    rationale:
      'Medications should demonstrate measurable benefit within 4-8 weeks or be discontinued.',
  },
];
