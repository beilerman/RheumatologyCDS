export const uiaRules = [
  // ── Classification evolution ──────────────────────────────────────────────

  {
    id: 'uia-evolve-ra',
    condition: (state) =>
      state.answers['uia-rf-positive'] === true &&
      state.answers['uia-anti-ccp-positive'] === true &&
      state.answers['uia-joint-pattern'] === 'symmetric-small',
    recommendation:
      'Features evolving toward Rheumatoid Arthritis (RF+, anti-CCP+, symmetric small joint involvement). Recommend rheumatology evaluation for reclassification.',
    strength: 'strong',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Positive RF and anti-CCP with symmetric small joint involvement meets key RA classification features.',
  },

  {
    id: 'uia-evolve-psa',
    condition: (state) =>
      state.answers['uia-psoriasis'] === true &&
      (state.answers['uia-joint-pattern'] === 'asymmetric' ||
        state.answers['uia-dactylitis'] === true ||
        state.answers['uia-enthesitis'] === true),
    recommendation:
      'Features consistent with Psoriatic Arthritis (psoriasis + asymmetric arthritis/dactylitis/enthesitis). Recommend rheumatology evaluation.',
    strength: 'strong',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Psoriasis with asymmetric joint involvement, dactylitis, or enthesitis is highly suggestive of PsA.',
  },

  {
    id: 'uia-evolve-axspa',
    condition: (state) =>
      state.answers['uia-inflammatory-back-pain'] === true &&
      state.answers['uia-hla-b27'] === true,
    recommendation:
      'Features suggestive of Axial Spondyloarthritis (inflammatory back pain + HLA-B27 positive). Recommend rheumatology evaluation.',
    strength: 'strong',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Inflammatory back pain with HLA-B27 positivity warrants axSpA evaluation.',
  },

  // ── Treatment ─────────────────────────────────────────────────────────────

  {
    id: 'uia-confirmed-ia-csdmard',
    condition: (state) =>
      state.answers['uia-inflammatory-arthritis-confirmed'] === true &&
      state.answers['uia-treatment-status'] === 'untreated',
    recommendation:
      'If inflammatory arthritis confirmed, initiate csDMARD (methotrexate preferred) promptly. Delay increases joint damage risk.',
    strength: 'strong',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'EULAR 2016 recommends prompt csDMARD initiation once inflammatory arthritis is confirmed to prevent structural damage.',
  },

  {
    id: 'uia-uncertain-conservative',
    condition: (state) =>
      state.answers['uia-inflammatory-arthritis-confirmed'] !== true,
    recommendation:
      'If diagnosis uncertain: NSAIDs for symptom management, short-course glucocorticoids acceptable, close follow-up in 4–6 weeks.',
    strength: 'conditional',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Conservative management appropriate while awaiting diagnostic clarification.',
  },

  // ── No biologics guard ────────────────────────────────────────────────────

  {
    id: 'uia-no-biologics-without-rheum',
    condition: () => true,
    recommendation:
      'Do NOT initiate biologics for undifferentiated IA without rheumatologist involvement.',
    strength: 'strong',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Biologic therapy requires confirmed diagnosis and rheumatologist oversight.',
  },

  // ── Autoantibody recheck ──────────────────────────────────────────────────

  {
    id: 'uia-autoantibody-recheck',
    condition: (state) =>
      state.answers['uia-rf-positive'] !== true &&
      state.answers['uia-anti-ccp-positive'] !== true &&
      state.answers['uia-ana-positive'] !== true,
    recommendation:
      'Autoantibody panel was negative. Recheck RF, anti-CCP, and ANA at 3–6 months if initially negative.',
    strength: 'conditional',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Autoantibodies may seroconvert over time. Repeat testing helps clarify evolving diagnosis.',
  },

  // ── Erosive disease ───────────────────────────────────────────────────────

  {
    id: 'uia-erosive-urgent',
    condition: (state) => state.answers['uia-erosive-changes'] === true,
    recommendation:
      'Erosive changes detected on imaging. Aggressive treatment needed. Urgent rheumatology referral if not already involved.',
    strength: 'strong',
    guideline: 'EULAR_EARLY_ARTHRITIS_2016',
    rationale:
      'Erosive disease indicates aggressive inflammatory arthritis requiring prompt treatment escalation.',
  },
];
