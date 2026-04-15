export const FIBRO_QUESTION_GROUPS = [
  // --- SYMPTOMS: Pain ---
  {
    id: 'fibro-pain',
    title: 'Pain & Core Symptoms',
    section: 'symptoms',
    questions: [
      {
        id: 'fibro-wpi',
        label: 'Widespread Pain Index (WPI)',
        type: 'numeric',
        min: 0,
        max: 19,
        tooltip:
          'Count of 19 body regions with pain in past week: jaw (L/R), shoulder girdle (L/R), upper arm (L/R), lower arm (L/R), hip/buttock/trochanter (L/R), upper leg (L/R), lower leg (L/R), chest, abdomen, upper back, lower back, neck.',
      },
      {
        id: 'fibro-sss',
        label: 'Symptom Severity Score (SSS)',
        type: 'numeric',
        min: 0,
        max: 12,
        tooltip:
          'Fatigue (0-3) + Waking unrefreshed (0-3) + Cognitive symptoms (0-3) + Somatic symptoms (0-3). Sum = 0-12.',
      },
      {
        id: 'fibro-pain-severity',
        label: 'Overall pain severity (0=none, 10=worst imaginable)',
        type: 'slider',
        min: 0,
        max: 10,
      },
      {
        id: 'fibro-fatigue',
        label: 'Fatigue severity (0=none, 10=worst)',
        type: 'slider',
        min: 0,
        max: 10,
      },
      {
        id: 'fibro-cognitive-symptoms',
        label: 'Cognitive symptoms ("fibro fog")',
        type: 'radio',
        tooltip: 'Difficulty with concentration, memory, finding words. Also called "dyscognition" or "fibro fog".',
        options: [
          { value: 'none', label: 'None' },
          { value: 'mild', label: 'Mild' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'severe', label: 'Severe' },
        ],
      },
    ],
  },

  // --- SYMPTOMS: Sleep & Mood ---
  {
    id: 'fibro-sleep-mood',
    title: 'Sleep & Mood',
    section: 'symptoms',
    questions: [
      {
        id: 'fibro-sleep-quality',
        label: 'Sleep quality (0=worst, 10=best)',
        type: 'slider',
        min: 0,
        max: 10,
      },
      {
        id: 'fibro-sleep-hours',
        label: 'Average hours of sleep per night',
        type: 'numeric',
        min: 0,
        max: 24,
        step: 0.5,
      },
      {
        id: 'fibro-sleep-restorative',
        label: 'Does sleep feel restorative?',
        type: 'radio',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'fibro-depression-screen',
        label: 'Depression screen (PHQ-2)',
        type: 'dropdown',
        tooltip: 'PHQ-2 positive if score ≥3. Ask: (1) Little interest or pleasure in doing things? (2) Feeling down, depressed, or hopeless?',
        options: [
          { value: 'negative', label: 'Negative (score <3)' },
          { value: 'positive', label: 'Positive (score ≥3)' },
        ],
      },
      {
        id: 'fibro-anxiety-screen',
        label: 'Anxiety screen (GAD-2)',
        type: 'dropdown',
        tooltip: 'GAD-2 positive if score ≥3. Ask: (1) Feeling nervous, anxious, or on edge? (2) Not being able to stop or control worrying?',
        options: [
          { value: 'negative', label: 'Negative (score <3)' },
          { value: 'positive', label: 'Positive (score ≥3)' },
        ],
      },
      {
        id: 'fibro-phq9-score',
        label: 'PHQ-9 score (0-27)',
        type: 'numeric',
        min: 0,
        max: 27,
        showWhen: (answers) => answers['fibro-depression-screen'] === 'positive',
      },
    ],
  },

  // --- SYMPTOMS: Function ---
  {
    id: 'fibro-function',
    title: 'Function & Activity',
    section: 'symptoms',
    questions: [
      {
        id: 'fibro-exercise-type',
        label: 'Current exercise type(s)',
        type: 'text',
      },
      {
        id: 'fibro-exercise-frequency',
        label: 'Exercise frequency',
        type: 'dropdown',
        options: [
          { value: 'none', label: 'None' },
          { value: '1-2x-week', label: '1-2x per week' },
          { value: '3-4x-week', label: '3-4x per week' },
          { value: '5+-week', label: '5+ times per week' },
        ],
      },
      {
        id: 'fibro-exercise-tolerance',
        label: 'Exercise tolerance',
        type: 'radio',
        options: [
          { value: 'good', label: 'Good (tolerates and recovers well)' },
          { value: 'moderate', label: 'Moderate (some post-exertional malaise)' },
          { value: 'poor', label: 'Poor (significant symptom flare with activity)' },
        ],
      },
      {
        id: 'fibro-work-status',
        label: 'Work status',
        type: 'dropdown',
        options: [
          { value: 'full-time', label: 'Full-time' },
          { value: 'part-time', label: 'Part-time' },
          { value: 'disabled', label: 'Disabled (fibromyalgia-related)' },
          { value: 'not-working', label: 'Not working (other reason)' },
        ],
      },
      {
        id: 'fibro-adl-limitations',
        label: 'Activities of daily living (ADL) limitations',
        type: 'radio',
        options: [
          { value: 'none', label: 'None' },
          { value: 'mild', label: 'Mild (minimal impact on daily activities)' },
          { value: 'moderate', label: 'Moderate (significant impact on daily activities)' },
          { value: 'severe', label: 'Severe (unable to perform many daily activities)' },
        ],
      },
      {
        id: 'fibro-current-stressors',
        label: 'Current psychosocial stressors',
        type: 'text',
      },
    ],
  },

  // --- MEDICATIONS: Treatment Context ---
  {
    id: 'fibro-treatment',
    title: 'Treatment Context',
    section: 'medications',
    questions: [
      {
        id: 'fibro-requesting-opioids',
        label: 'Patient requesting opioids for fibromyalgia?',
        type: 'toggle',
      },
      {
        id: 'fibro-med-trial-duration',
        label: 'Duration of current medication trial',
        type: 'dropdown',
        options: [
          { value: '<4 weeks', label: '<4 weeks' },
          { value: '4-8 weeks', label: '4-8 weeks' },
          { value: '>8 weeks', label: '>8 weeks' },
        ],
      },
      {
        id: 'fibro-alternative-diagnosis-concern',
        label: 'Concern for alternative diagnosis?',
        type: 'toggle',
        tooltip:
          'New features suggesting inflammatory arthritis, hypothyroidism, sleep apnea, vitamin D deficiency, or other masquerader.',
      },
    ],
  },
];
