export const UIA_QUESTION_GROUPS = [
  // ── Joint Assessment ───────────────────────────────────────────────────────
  {
    id: 'uia-joint-assessment',
    title: 'Joint Assessment',
    section: 'symptoms',
    questions: [
      {
        id: 'uia-joint-pattern',
        label: 'Joint involvement pattern',
        type: 'dropdown',
        options: [
          { value: 'symmetric-small', label: 'Symmetric small joints (MCPs, PIPs, wrists)' },
          { value: 'symmetric-large', label: 'Symmetric large joints (knees, shoulders, hips)' },
          { value: 'asymmetric', label: 'Asymmetric oligoarticular' },
          { value: 'oligoarticular', label: 'Oligoarticular (≤4 joints, not clearly asymmetric)' },
        ],
        tooltip: 'Symmetric small-joint involvement with seropositivity suggests RA; asymmetric pattern suggests SpA/PsA.',
      },
      {
        id: 'uia-sjc',
        label: 'Swollen joint count (0–66)',
        type: 'numeric',
        min: 0,
        max: 66,
        tooltip: '66-joint assessment used for undifferentiated arthritis to capture large joints not in DAS28.',
      },
      {
        id: 'uia-tjc',
        label: 'Tender joint count (0–68)',
        type: 'numeric',
        min: 0,
        max: 68,
      },
      {
        id: 'uia-morning-stiffness',
        label: 'Morning stiffness duration (minutes)',
        type: 'numeric',
        min: 0,
        max: 480,
        tooltip: 'Stiffness >60 minutes is a hallmark of inflammatory arthritis.',
      },
      {
        id: 'uia-symptom-duration',
        label: 'Symptom duration',
        type: 'dropdown',
        options: [
          { value: '<6w', label: 'Less than 6 weeks (very early)' },
          { value: '6w-6m', label: '6 weeks – 6 months (early)' },
          { value: '>6m', label: 'Greater than 6 months (established)' },
        ],
        tooltip: 'Duration >6 weeks distinguishes persistent from self-limiting arthritis. Duration >6 months with uncertainty is a yellow flag.',
      },
    ],
  },

  // ── Associated Features ────────────────────────────────────────────────────
  {
    id: 'uia-features',
    title: 'Associated Features & History',
    section: 'symptoms',
    questions: [
      {
        id: 'uia-psoriasis',
        label: 'History of psoriasis (skin or nail)?',
        type: 'toggle',
        tooltip: 'Psoriasis + asymmetric arthritis/dactylitis/enthesitis is highly suggestive of PsA.',
      },
      {
        id: 'uia-eye-symptoms',
        label: 'Eye symptoms (dryness, redness, photophobia)?',
        type: 'toggle',
        tooltip: 'Dry eyes suggest Sjögren\'s; uveitis (redness/photophobia) suggests SpA. Urgent ophthalmology if uveitis suspected.',
      },
      {
        id: 'uia-oral-ulcers',
        label: 'Recurrent oral ulcers?',
        type: 'toggle',
        tooltip: 'Oral ulcers can suggest Behçet disease, SLE, or reactive arthritis.',
      },
      {
        id: 'uia-raynaud',
        label: "Raynaud's phenomenon?",
        type: 'toggle',
        tooltip: "Raynaud's suggests CTD overlap (SLE, SSc, mixed CTD).",
      },
      {
        id: 'uia-family-hx-autoimmune',
        label: 'Family history of autoimmune disease?',
        type: 'toggle',
      },
      {
        id: 'uia-recent-infection',
        label: 'Recent infection preceding joint symptoms? (reactive arthritis)',
        type: 'toggle',
        tooltip: 'Preceding GI or GU infection suggests reactive arthritis (Reiter syndrome). Typically self-limiting.',
      },
      {
        id: 'uia-gi-symptoms',
        label: 'GI symptoms (diarrhea, abdominal pain)? (IBD screening)',
        type: 'toggle',
        tooltip: 'IBD-associated arthropathy can precede GI diagnosis. Consider gastroenterology referral.',
      },
      {
        id: 'uia-urethritis',
        label: 'Urethritis or genital ulceration?',
        type: 'toggle',
        tooltip: 'Urethritis with arthritis and eye symptoms: classic reactive arthritis triad.',
      },
      {
        id: 'uia-enthesitis',
        label: 'Enthesitis (tendon insertion tenderness)?',
        type: 'toggle',
        tooltip: 'Enthesitis at Achilles, plantar fascia, or patellar tendon is a SpA feature.',
      },
      {
        id: 'uia-dactylitis',
        label: 'Dactylitis (sausage digit)?',
        type: 'toggle',
        tooltip: 'Dactylitis (diffuse swelling of entire digit) strongly suggests PsA or reactive arthritis.',
      },
      {
        id: 'uia-inflammatory-back-pain',
        label: 'Inflammatory back pain (worse with rest, improved with activity)?',
        type: 'toggle',
        tooltip: 'ASAS criteria: age <40, insidious onset, improves with exercise, no improvement with rest, nocturnal pain with improvement on rising.',
      },
      {
        id: 'uia-systemic-features',
        label: 'Systemic features (fever, unexplained cytopenia, serositis)?',
        type: 'toggle',
        tooltip: 'RED FLAG: Fever with arthritis and systemic features raises concern for SLE, vasculitis, or adult-onset Still disease. Urgent evaluation.',
      },
    ],
  },

  // ── Labs / Serologies ──────────────────────────────────────────────────────
  {
    id: 'uia-labs',
    title: 'Serologies & Inflammatory Markers',
    section: 'scoring',
    questions: [
      {
        id: 'uia-rf-positive',
        label: 'RF (Rheumatoid Factor) positive?',
        type: 'toggle',
        tooltip: 'RF+ with anti-CCP+ and symmetric small joint involvement meets key RA criteria.',
      },
      {
        id: 'uia-anti-ccp-positive',
        label: 'Anti-CCP (anti-cyclic citrullinated peptide) positive?',
        type: 'toggle',
        tooltip: 'Anti-CCP is more specific than RF for RA. High-titer anti-CCP predicts erosive disease.',
      },
      {
        id: 'uia-ana-positive',
        label: 'ANA (antinuclear antibody) positive?',
        type: 'toggle',
        tooltip: 'ANA positive raises concern for CTD (SLE, Sjögren\'s, SSc). Consider reflex ENA panel.',
      },
      {
        id: 'uia-hla-b27',
        label: 'HLA-B27 positive?',
        type: 'toggle',
        tooltip: 'HLA-B27 with inflammatory back pain: strong axSpA indicator. Present in ~8% of general population, ~80-90% of AS.',
      },
      {
        id: 'uia-esr',
        label: 'ESR (mm/hr)',
        type: 'numeric',
        min: 0,
        max: 150,
      },
      {
        id: 'uia-crp',
        label: 'CRP (mg/L)',
        type: 'numeric',
        min: 0,
        max: 300,
      },
    ],
  },

  // ── Imaging ────────────────────────────────────────────────────────────────
  {
    id: 'uia-imaging',
    title: 'Imaging Findings',
    section: 'scoring',
    questions: [
      {
        id: 'uia-erosive-changes',
        label: 'Erosive changes on imaging (X-ray or MRI)?',
        type: 'toggle',
        tooltip: 'URGENT: Erosive changes indicate aggressive inflammatory arthritis. Escalate to rheumatology urgently if not involved.',
      },
      {
        id: 'uia-imaging-notes',
        label: 'Imaging notes (optional)',
        type: 'text',
      },
    ],
  },

  // ── Treatment Context ──────────────────────────────────────────────────────
  {
    id: 'uia-treatment',
    title: 'Diagnosis & Treatment Status',
    section: 'medications',
    questions: [
      {
        id: 'uia-inflammatory-arthritis-confirmed',
        label: 'Inflammatory arthritis confirmed (by clinical assessment or synovial fluid)?',
        type: 'toggle',
        tooltip: 'Once inflammatory arthritis is confirmed, prompt csDMARD initiation is recommended per EULAR 2016.',
      },
      {
        id: 'uia-treatment-status',
        label: 'Current treatment status',
        type: 'dropdown',
        options: [
          { value: 'untreated', label: 'Untreated' },
          { value: 'on-nsaid', label: 'On NSAID only' },
          { value: 'on-csDMARD', label: 'On csDMARD' },
        ],
      },
    ],
  },
];
