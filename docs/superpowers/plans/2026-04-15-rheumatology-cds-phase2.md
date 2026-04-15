# RheumatologyCDS Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add PsA, AxSpA, UIA, and Fibromyalgia condition modules to the existing RheumatologyCDS app, completing all 6 rheumatology conditions.

**Architecture:** Each module follows the identical pattern established in Phase 1 (RA/Gout): Questions.js (data) + Rules.js (decision logic) + Module.jsx (UI) + optional Scoring.js. Integration via 6 touch points: ConditionSelector, useVisitState, escalationCriteria, medications, exportFormatter, App.jsx.

**Tech Stack:** React 18 (JSX), Vite, Tailwind CSS, Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/utils/scoreCalculations.js` | Modify | Add DAPSA, BASDAI, ASDAS-CRP, ASDAS-ESR, FSQ (WPI+SSS) |
| `tests/scoring.test.js` | Modify | Add tests for new score functions |
| `src/components/conditions/PsoriaticArthritis/PsAQuestions.js` | Create | PsA question definitions |
| `src/components/conditions/PsoriaticArthritis/PsARules.js` | Create | PsA decision rules (ACR/NPF 2018 + GRAPPA 2021) |
| `src/components/conditions/PsoriaticArthritis/PsAScoring.js` | Create | Re-export DAPSA from scoreCalculations |
| `src/components/conditions/PsoriaticArthritis/PsAModule.jsx` | Create | PsA visit flow |
| `tests/psaRules.test.js` | Create | PsA rule tests |
| `src/components/conditions/AxialSpondyloarthritis/AxSpAQuestions.js` | Create | AxSpA question definitions |
| `src/components/conditions/AxialSpondyloarthritis/AxSpARules.js` | Create | AxSpA decision rules (ACR/SAA/SPARTAN 2019) |
| `src/components/conditions/AxialSpondyloarthritis/AxSpAScoring.js` | Create | Re-export BASDAI, ASDAS |
| `src/components/conditions/AxialSpondyloarthritis/AxSpAModule.jsx` | Create | AxSpA visit flow |
| `tests/axspaRules.test.js` | Create | AxSpA rule tests |
| `src/components/conditions/UndifferentiatedIA/UIAQuestions.js` | Create | UIA question definitions |
| `src/components/conditions/UndifferentiatedIA/UIARules.js` | Create | UIA decision rules (EULAR 2016 early arthritis) |
| `src/components/conditions/UndifferentiatedIA/UIAModule.jsx` | Create | UIA visit flow |
| `tests/uiaRules.test.js` | Create | UIA rule tests |
| `src/components/conditions/Fibromyalgia/FibroQuestions.js` | Create | Fibro question definitions |
| `src/components/conditions/Fibromyalgia/FibroRules.js` | Create | Fibro decision rules (EULAR 2016 fibro) |
| `src/components/conditions/Fibromyalgia/FibroScoring.js` | Create | Re-export FSQ |
| `src/components/conditions/Fibromyalgia/FibroModule.jsx` | Create | Fibro visit flow |
| `tests/fibroRules.test.js` | Create | Fibro rule tests |
| `src/data/medications.js` | Modify | Add psa, axspa, fibro medication entries |
| `src/data/escalationCriteria.js` | Modify | Add psa, axspa, uia, fibro escalation arrays |
| `src/hooks/useVisitState.js` | Modify | Register 4 new rule sets |
| `src/hooks/useScoring.js` | Modify | Add PsA/AxSpA/Fibro score wiring |
| `src/utils/exportFormatter.js` | Modify | Add PsA/AxSpA/UIA/Fibro score formatting |
| `src/components/conditions/ConditionSelector.jsx` | Modify | Enable 4 conditions |
| `src/App.jsx` | Modify | Import and render 4 new modules |

---

### Task 1: New Score Calculations (TDD)

**Files:**
- Modify: `src/utils/scoreCalculations.js`
- Modify: `tests/scoring.test.js`

- [ ] **Step 1: Write failing tests for DAPSA, BASDAI, ASDAS, and FSQ**

Add to `tests/scoring.test.js`:

```js
import {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
  calculateDAPSA,
  calculateBASDAI,
  calculateASDASCRP,
  calculateASDASSER,
  calculateFSQ,
} from '../src/utils/scoreCalculations.js';

// ... existing tests stay ...

describe('calculateDAPSA', () => {
  it('returns Remission for score <= 4', () => {
    const result = calculateDAPSA({ sjc66: 0, tjc68: 1, painVAS: 1, patientGlobalVAS: 1, crp: 0.5 });
    expect(result.score).toBe(3.5);
    expect(result.category).toBe('Remission');
    expect(result.error).toBeNull();
  });

  it('returns Low for score > 4 and <= 14', () => {
    const result = calculateDAPSA({ sjc66: 2, tjc68: 3, painVAS: 3, patientGlobalVAS: 2, crp: 1.5 });
    expect(result.score).toBe(11.5);
    expect(result.category).toBe('Low');
  });

  it('returns Moderate for score > 14 and <= 28', () => {
    const result = calculateDAPSA({ sjc66: 5, tjc68: 6, painVAS: 5, patientGlobalVAS: 4, crp: 2 });
    expect(result.score).toBe(22);
    expect(result.category).toBe('Moderate');
  });

  it('returns High for score > 28', () => {
    const result = calculateDAPSA({ sjc66: 10, tjc68: 10, painVAS: 7, patientGlobalVAS: 6, crp: 3 });
    expect(result.score).toBe(36);
    expect(result.category).toBe('High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateDAPSA({ sjc66: 2, tjc68: null, painVAS: 3, patientGlobalVAS: 2, crp: 1 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateBASDAI', () => {
  it('calculates correctly (mean of Q1-4 + mean of Q5-6, divided by 2)', () => {
    // Q1=6, Q2=5, Q3=4, Q4=3, Q5=7, Q6=5
    // Mean(Q1-4) = (6+5+4+3)/4 = 4.5
    // Mean(Q5-6) = (7+5)/2 = 6
    // BASDAI = (4.5 + 6) / 2 = 5.25
    const result = calculateBASDAI({ q1Fatigue: 6, q2SpinalPain: 5, q3JointPain: 4, q4Enthesitis: 3, q5MorningStiffnessSeverity: 7, q6MorningStiffnessDuration: 5 });
    expect(result.score).toBe(5.3);
    expect(result.category).toBe('Active');
  });

  it('returns Inactive for score < 4', () => {
    const result = calculateBASDAI({ q1Fatigue: 2, q2SpinalPain: 1, q3JointPain: 1, q4Enthesitis: 1, q5MorningStiffnessSeverity: 2, q6MorningStiffnessDuration: 1 });
    expect(result.score).toBeLessThan(4);
    expect(result.category).toBe('Inactive');
  });

  it('returns error for missing inputs', () => {
    const result = calculateBASDAI({ q1Fatigue: 6, q2SpinalPain: null, q3JointPain: 4, q4Enthesitis: 3, q5MorningStiffnessSeverity: 7, q6MorningStiffnessDuration: 5 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateASDASCRP', () => {
  it('calculates correctly for known inputs', () => {
    // Back pain (BASDAI Q2)=5, morning stiffness duration (BASDAI Q6)=4, patient global=6, peripheral pain (BASDAI Q3)=3, CRP=1.5 mg/dL
    // 0.121*backPain + 0.110*morningStiffness + 0.073*patientGlobal + 0.058*peripheralPain + 0.579*ln(CRP+1)
    // = 0.605 + 0.44 + 0.438 + 0.174 + 0.579*0.916 = 0.605+0.44+0.438+0.174+0.530 = 2.187
    const result = calculateASDASCRP({ backPain: 5, morningStiffness: 4, patientGlobal: 6, peripheralPain: 3, crp: 1.5 });
    expect(result.score).toBeCloseTo(2.2, 1);
    expect(result.category).toBe('High');
  });

  it('returns Inactive for score < 1.3', () => {
    const result = calculateASDASCRP({ backPain: 1, morningStiffness: 0, patientGlobal: 1, peripheralPain: 0, crp: 0.2 });
    expect(result.score).toBeLessThan(1.3);
    expect(result.category).toBe('Inactive');
  });

  it('returns Very High for score > 3.5', () => {
    const result = calculateASDASCRP({ backPain: 8, morningStiffness: 7, patientGlobal: 8, peripheralPain: 6, crp: 5 });
    expect(result.category).toBe('Very High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateASDASCRP({ backPain: 5, morningStiffness: null, patientGlobal: 6, peripheralPain: 3, crp: 1.5 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateASDASSER', () => {
  it('uses ESR instead of CRP', () => {
    const result = calculateASDASSER({ backPain: 5, morningStiffness: 4, patientGlobal: 6, peripheralPain: 3, esr: 25 });
    expect(result.score).not.toBeNull();
    expect(result.error).toBeNull();
  });
});

describe('calculateFSQ', () => {
  it('returns correct WPI + SSS total', () => {
    // WPI = 10, SSS = 8 => FSQ = 18
    const result = calculateFSQ({ wpiScore: 10, sssScore: 8 });
    expect(result.score).toBe(18);
    expect(result.error).toBeNull();
  });

  it('classifies severity correctly', () => {
    expect(calculateFSQ({ wpiScore: 3, sssScore: 3 }).category).toBe('Mild');
    expect(calculateFSQ({ wpiScore: 7, sssScore: 5 }).category).toBe('Moderate');
    expect(calculateFSQ({ wpiScore: 12, sssScore: 9 }).category).toBe('Severe');
  });

  it('returns error for missing inputs', () => {
    const result = calculateFSQ({ wpiScore: null, sssScore: 8 });
    expect(result.error).toBe('Missing required inputs');
  });

  it('validates diagnostic criteria met', () => {
    // WPI >= 7 AND SSS >= 5
    const result = calculateFSQ({ wpiScore: 7, sssScore: 5 });
    expect(result.diagnosticCriteriaMet).toBe(true);
    // WPI 4-6 AND SSS >= 9
    const result2 = calculateFSQ({ wpiScore: 5, sssScore: 9 });
    expect(result2.diagnosticCriteriaMet).toBe(true);
    // Neither
    const result3 = calculateFSQ({ wpiScore: 3, sssScore: 4 });
    expect(result3.diagnosticCriteriaMet).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/scoring.test.js
```

Expected: New tests FAIL (functions not exported).

- [ ] **Step 3: Implement new score functions**

Add to `src/utils/scoreCalculations.js` (after existing functions, using existing `hasMissing`, `round1`, `categorize`, `MISSING` helpers):

```js
export function calculateDAPSA({ sjc66, tjc68, painVAS, patientGlobalVAS, crp }) {
  if (hasMissing([sjc66, tjc68, painVAS, patientGlobalVAS, crp])) return MISSING;
  const score = round1(sjc66 + tjc68 + painVAS + patientGlobalVAS + crp);
  const category = categorize(score, [
    [4, 'Remission'],
    [14, 'Low'],
    [28, 'Moderate'],
    [Infinity, 'High'],
  ]);
  return { score, category, error: null };
}

export function calculateBASDAI({ q1Fatigue, q2SpinalPain, q3JointPain, q4Enthesitis, q5MorningStiffnessSeverity, q6MorningStiffnessDuration }) {
  if (hasMissing([q1Fatigue, q2SpinalPain, q3JointPain, q4Enthesitis, q5MorningStiffnessSeverity, q6MorningStiffnessDuration])) return MISSING;
  const meanQ1to4 = (q1Fatigue + q2SpinalPain + q3JointPain + q4Enthesitis) / 4;
  const meanQ5to6 = (q5MorningStiffnessSeverity + q6MorningStiffnessDuration) / 2;
  const score = round1((meanQ1to4 + meanQ5to6) / 2);
  const category = score >= 4 ? 'Active' : 'Inactive';
  return { score, category, error: null };
}

export function calculateASDASCRP({ backPain, morningStiffness, patientGlobal, peripheralPain, crp }) {
  if (hasMissing([backPain, morningStiffness, patientGlobal, peripheralPain, crp])) return MISSING;
  const score = round1(
    0.121 * backPain +
    0.110 * morningStiffness +
    0.073 * patientGlobal +
    0.058 * peripheralPain +
    0.579 * Math.log(crp + 1)
  );
  const category = score < 1.3 ? 'Inactive'
    : score < 2.1 ? 'Low'
    : score <= 3.5 ? 'High'
    : 'Very High';
  return { score, category, error: null };
}

export function calculateASDASSER({ backPain, morningStiffness, patientGlobal, peripheralPain, esr }) {
  if (hasMissing([backPain, morningStiffness, patientGlobal, peripheralPain, esr])) return MISSING;
  const score = round1(
    0.079 * backPain +
    0.069 * morningStiffness +
    0.113 * patientGlobal +
    0.086 * peripheralPain +
    0.293 * Math.sqrt(esr)
  );
  const category = score < 1.3 ? 'Inactive'
    : score < 2.1 ? 'Low'
    : score <= 3.5 ? 'High'
    : 'Very High';
  return { score, category, error: null };
}

export function calculateFSQ({ wpiScore, sssScore }) {
  if (hasMissing([wpiScore, sssScore])) return MISSING;
  const score = wpiScore + sssScore;
  const category = score <= 12 ? 'Mild'
    : score <= 20 ? 'Moderate'
    : 'Severe';
  const diagnosticCriteriaMet =
    (wpiScore >= 7 && sssScore >= 5) ||
    (wpiScore >= 4 && wpiScore <= 6 && sssScore >= 9);
  return { score, category, diagnosticCriteriaMet, error: null };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/scoring.test.js
```

Expected: All scoring tests pass (existing + new).

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoreCalculations.js tests/scoring.test.js
git commit -m "feat: add DAPSA, BASDAI, ASDAS-CRP/ESR, and FSQ score calculations

PsA: DAPSA (Remission/Low/Moderate/High)
AxSpA: BASDAI (Active/Inactive), ASDAS-CRP and ASDAS-ESR (4 tiers)
Fibro: FSQ with WPI+SSS and diagnostic criteria check"
```

---

### Task 2: Psoriatic Arthritis Module (TDD)

**Files:**
- Create: `src/components/conditions/PsoriaticArthritis/PsAQuestions.js`
- Create: `src/components/conditions/PsoriaticArthritis/PsARules.js`
- Create: `src/components/conditions/PsoriaticArthritis/PsAScoring.js`
- Create: `src/components/conditions/PsoriaticArthritis/PsAModule.jsx`
- Create: `tests/psaRules.test.js`
- Modify: `src/data/medications.js` — add `psa` key
- Modify: `src/data/escalationCriteria.js` — add `psa` escalation array

- [ ] **Step 1: Write failing PsA rule tests**

Create `tests/psaRules.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { psaRules } from '../src/components/conditions/PsoriaticArthritis/PsARules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return { condition: 'psa', answers: {}, scores: {}, medications: { current: [], doses: {} }, ...overrides };
}

describe('PsA Rules: Treatment-naive', () => {
  it('recommends csDMARD for mild peripheral arthritis', () => {
    const state = makeState({
      answers: { 'psa-treatment-status': 'naive', 'psa-dominant-domain': 'peripheral', 'psa-severity': 'mild' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-naive-mild-csdmard')).toBeDefined();
  });

  it('recommends TNFi for severe peripheral arthritis', () => {
    const state = makeState({
      answers: { 'psa-treatment-status': 'naive', 'psa-dominant-domain': 'peripheral', 'psa-severity': 'severe' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-naive-severe-tnfi')).toBeDefined();
  });
});

describe('PsA Rules: By domain', () => {
  it('recommends TNFi/IL-17i for axial disease (not csDMARDs)', () => {
    const state = makeState({
      answers: { 'psa-dominant-domain': 'axial', 'psa-treatment-status': 'failed-nsaid' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-axial-biologic')).toBeDefined();
    expect(recs.find(r => r.recommendation.includes('csDMARDs NOT effective'))).toBeDefined();
  });

  it('recommends biologic for enthesitis after NSAID failure', () => {
    const state = makeState({
      answers: { 'psa-dominant-domain': 'enthesitis', 'psa-treatment-status': 'failed-nsaid' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-enthesitis-biologic')).toBeDefined();
  });
});

describe('PsA Rules: Skin involvement', () => {
  it('notes TNFi or IL-17i preferred for significant skin disease', () => {
    const state = makeState({
      answers: { 'psa-skin-severity': 'severe', 'psa-treatment-status': 'failed-csDMARD' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-skin-preferred-biologic')).toBeDefined();
  });
});

describe('PsA Rules: IL-17i and IBD caution', () => {
  it('warns about IBD with IL-17 inhibitors', () => {
    const state = makeState({
      answers: { 'psa-ibd-history': true, 'psa-treatment-status': 'failed-csDMARD' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-il17-ibd-caution')).toBeDefined();
  });
});

describe('PsA Rules: csDMARD failure', () => {
  it('recommends biologic after csDMARD failure', () => {
    const state = makeState({
      scores: { dapsa: { score: 20, category: 'Moderate' } },
      answers: { 'psa-treatment-status': 'failed-csDMARD' },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    expect(recs.find(r => r.id === 'psa-csdmard-fail-biologic')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/psaRules.test.js
```

- [ ] **Step 3: Create PsA rules**

Create `src/components/conditions/PsoriaticArthritis/PsARules.js`:

```js
export const psaRules = [
  // Treatment-naive, mild peripheral
  {
    id: 'psa-naive-mild-csdmard',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'naive' &&
      state.answers['psa-dominant-domain'] === 'peripheral' &&
      state.answers['psa-severity'] === 'mild',
    recommendation: 'Initiate csDMARD (methotrexate, sulfasalazine, or leflunomide) for mild peripheral PsA.',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale: 'ACR/NPF 2018 conditionally recommends csDMARDs as first-line for mild peripheral arthritis in treatment-naive PsA.',
  },
  // Treatment-naive, moderate peripheral
  {
    id: 'psa-naive-moderate-csdmard-or-tnfi',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'naive' &&
      state.answers['psa-dominant-domain'] === 'peripheral' &&
      state.answers['psa-severity'] === 'moderate',
    recommendation: 'Initiate csDMARD or TNFi based on severity and patient preference. TNFi preferred if significant skin involvement.',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale: 'For moderate PsA, both csDMARDs and TNFi are reasonable first-line options.',
  },
  // Treatment-naive, severe peripheral
  {
    id: 'psa-naive-severe-tnfi',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'naive' &&
      state.answers['psa-dominant-domain'] === 'peripheral' &&
      state.answers['psa-severity'] === 'severe',
    recommendation: 'TNFi is conditionally recommended over csDMARD as first-line for severe peripheral PsA.',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale: 'ACR/NPF 2018 conditionally recommends TNFi over csDMARD for severe peripheral arthritis at presentation.',
  },
  // Axial disease
  {
    id: 'psa-axial-biologic',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'axial' &&
      ['failed-nsaid', 'failed-csDMARD', 'failed-bDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'TNFi or IL-17i recommended for axial PsA. Note: csDMARDs are NOT effective for axial disease.',
    strength: 'strong',
    guideline: 'GRAPPA_2021',
    rationale: 'GRAPPA 2021 recommends TNFi or IL-17i for axial PsA. csDMARDs have no evidence for axial symptoms.',
  },
  {
    id: 'psa-axial-csdmard-not-effective',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'axial',
    recommendation: 'Reminder: csDMARDs NOT effective for axial disease. Do not use methotrexate/sulfasalazine/leflunomide for axial symptoms.',
    strength: 'strong',
    guideline: 'GRAPPA_2021',
    rationale: 'No evidence supports csDMARD efficacy in axial spondyloarthritis.',
  },
  // Enthesitis
  {
    id: 'psa-enthesitis-biologic',
    condition: (state) =>
      state.answers['psa-dominant-domain'] === 'enthesitis' &&
      ['failed-nsaid', 'failed-csDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'TNFi, IL-17i, or IL-12/23i recommended for enthesitis-dominant PsA after NSAID failure.',
    strength: 'conditional',
    guideline: 'GRAPPA_2021',
    rationale: 'GRAPPA 2021 recommends biologics for enthesitis not responding to NSAIDs.',
  },
  // Dactylitis
  {
    id: 'psa-dactylitis-biologic',
    condition: (state) =>
      state.answers['psa-dactylitis'] === true &&
      ['failed-nsaid', 'failed-csDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'TNFi, IL-17i, or IL-12/23i recommended for dactylitis-dominant PsA.',
    strength: 'conditional',
    guideline: 'GRAPPA_2021',
    rationale: 'GRAPPA 2021 recommends biologics for active dactylitis after csDMARD or NSAID failure.',
  },
  // Skin-preferred biologic
  {
    id: 'psa-skin-preferred-biologic',
    condition: (state) =>
      ['moderate', 'severe'].includes(state.answers['psa-skin-severity']) &&
      ['failed-csDMARD', 'failed-bDMARD'].includes(state.answers['psa-treatment-status']),
    recommendation: 'TNFi or IL-17i preferred when significant skin involvement (dual joint + skin benefit). IL-12/23i and IL-23i also effective for skin.',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale: 'IL-17 and TNF inhibitors offer dual benefit for both joint and skin disease in PsA.',
  },
  // csDMARD failure
  {
    id: 'psa-csdmard-fail-biologic',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'failed-csDMARD',
    recommendation: 'Switch to TNFi (preferred), IL-17i, IL-12/23i, IL-23i, or JAKi after csDMARD failure.',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale: 'ACR/NPF 2018 recommends biologic or tsDMARD after inadequate response to csDMARD.',
  },
  // IL-17 + IBD caution
  {
    id: 'psa-il17-ibd-caution',
    condition: (state) =>
      state.answers['psa-ibd-history'] === true &&
      ['failed-csDMARD', 'failed-bDMARD', 'naive'].includes(state.answers['psa-treatment-status']),
    recommendation: 'Caution with IL-17 inhibitors in patients with IBD history. TNFi or IL-12/23i may be preferred.',
    strength: 'conditional',
    guideline: 'GRAPPA_2021',
    rationale: 'IL-17 inhibitors may exacerbate inflammatory bowel disease. Alternative biologics preferred when IBD is present.',
  },
  // Apremilast alternative
  {
    id: 'psa-apremilast-option',
    condition: (state) =>
      state.answers['psa-treatment-status'] === 'failed-csDMARD' &&
      state.answers['psa-severity'] !== 'severe',
    recommendation: 'Apremilast (PDE4 inhibitor) is an alternative oral option for mild-moderate PsA. Limited joint efficacy compared to biologics.',
    strength: 'conditional',
    guideline: 'ACR_PsA_2018',
    rationale: 'Apremilast offers an oral option for patients preferring non-injection therapy, though joint efficacy is more limited.',
  },
  // Uveitis screening
  {
    id: 'psa-uveitis-screen',
    condition: (state) =>
      state.answers['psa-eye-symptoms'] === true,
    recommendation: 'Urgent ophthalmology referral for suspected uveitis. Notify rheumatologist.',
    strength: 'strong',
    guideline: 'ACR_PsA_2018',
    rationale: 'Uveitis requires prompt ophthalmologic evaluation to prevent vision loss.',
  },
];
```

- [ ] **Step 4: Create PsA scoring re-export**

Create `src/components/conditions/PsoriaticArthritis/PsAScoring.js`:

```js
export { calculateDAPSA } from '../../../utils/scoreCalculations.js';
```

- [ ] **Step 5: Create PsA questions**

Create `src/components/conditions/PsoriaticArthritis/PsAQuestions.js`:

```js
export const PSA_QUESTION_GROUPS = [
  {
    id: 'psa-joints',
    title: 'Joint Assessment',
    section: 'symptoms',
    questions: [
      { id: 'psa-sjc66', label: 'Swollen joint count (0-66)', type: 'numeric', min: 0, max: 66, tooltip: 'PsA uses 66/68 joint count (includes feet, unlike RA 28-joint count).' },
      { id: 'psa-tjc68', label: 'Tender joint count (0-68)', type: 'numeric', min: 0, max: 68 },
      { id: 'psa-patient-pain', label: 'Patient pain VAS (0-10 cm)', type: 'slider', min: 0, max: 10 },
      { id: 'psa-patient-global', label: 'Patient global VAS (0-10 cm)', type: 'slider', min: 0, max: 10 },
      { id: 'psa-functional-status', label: 'Functional status since last visit', type: 'radio', options: [
        { value: 'improved', label: 'Improved' }, { value: 'stable', label: 'Stable' }, { value: 'worsened', label: 'Worsened' },
      ]},
    ],
  },
  {
    id: 'psa-domains',
    title: 'Domain Assessment',
    section: 'symptoms',
    questions: [
      { id: 'psa-dominant-domain', label: 'Dominant disease domain', type: 'dropdown', options: [
        { value: 'peripheral', label: 'Peripheral arthritis' }, { value: 'axial', label: 'Axial disease' },
        { value: 'enthesitis', label: 'Enthesitis' }, { value: 'dactylitis', label: 'Dactylitis' },
        { value: 'skin', label: 'Skin dominant' },
      ], tooltip: 'GRAPPA 2021 uses a domain-based treatment approach. Select the most active domain.' },
      { id: 'psa-axial-symptoms', label: 'Back pain with morning stiffness improving with activity?', type: 'toggle', tooltip: 'Inflammatory back pain pattern suggests axial involvement.' },
      { id: 'psa-enthesitis-sites', label: 'Enthesitis sites', type: 'multiselect', options: [
        { value: 'achilles', label: 'Achilles tendon' }, { value: 'plantar', label: 'Plantar fascia' },
        { value: 'lateral-epicondyle', label: 'Lateral epicondyle' }, { value: 'patellar', label: 'Patellar tendon' },
      ]},
      { id: 'psa-dactylitis', label: 'Dactylitis (sausage digits) present?', type: 'toggle', tooltip: 'Sausage-like swelling of entire digit. Characteristic of PsA.' },
      { id: 'psa-dactylitis-digits', label: 'Which digits?', type: 'text', showWhen: (a) => a['psa-dactylitis'] === true },
    ],
  },
  {
    id: 'psa-skin-nails',
    title: 'Skin & Nail Disease',
    section: 'symptoms',
    questions: [
      { id: 'psa-skin-severity', label: 'Psoriasis severity (BSA estimate)', type: 'dropdown', options: [
        { value: 'none', label: 'No active psoriasis' }, { value: 'mild', label: 'Mild (<3% BSA)' },
        { value: 'moderate', label: 'Moderate (3-10% BSA)' }, { value: 'severe', label: 'Severe (>10% BSA)' },
      ], tooltip: 'BSA: palm of patient hand ≈ 1% BSA. Significant skin disease may influence biologic choice.' },
      { id: 'psa-new-plaques', label: 'New psoriasis plaques since last visit?', type: 'toggle' },
      { id: 'psa-nail-disease', label: 'Nail disease present?', type: 'toggle', tooltip: 'Pitting, onycholysis, subungual hyperkeratosis. Nail disease correlates with enthesitis.' },
    ],
  },
  {
    id: 'psa-extra',
    title: 'Extra-articular & Context',
    section: 'symptoms',
    questions: [
      { id: 'psa-eye-symptoms', label: 'Eye symptoms? (redness, pain, photophobia, blurred vision)', type: 'toggle', tooltip: 'RED FLAG: Suspected uveitis requires urgent ophthalmology referral.' },
      { id: 'psa-ibd-history', label: 'History of inflammatory bowel disease?', type: 'toggle', tooltip: 'IL-17 inhibitors should be used with caution in IBD patients.' },
      { id: 'psa-severity', label: 'Overall PsA severity', type: 'radio', options: [
        { value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' },
      ]},
      { id: 'psa-treatment-status', label: 'Current treatment status', type: 'dropdown', options: [
        { value: 'naive', label: 'Treatment-naive' }, { value: 'on-csDMARD', label: 'On csDMARD' },
        { value: 'failed-csDMARD', label: 'Failed csDMARD' }, { value: 'failed-nsaid', label: 'Failed NSAID' },
        { value: 'on-bDMARD', label: 'On bDMARD' }, { value: 'failed-bDMARD', label: 'Failed bDMARD' },
      ]},
      { id: 'psa-flares', label: 'Flares since last visit', type: 'numeric', min: 0, max: 50 },
      { id: 'psa-fatigue', label: 'Fatigue (0-10)', type: 'slider', min: 0, max: 10 },
    ],
  },
  {
    id: 'psa-labs',
    title: 'Labs',
    section: 'scoring',
    questions: [
      { id: 'psa-crp', label: 'CRP (mg/dL)', type: 'numeric', min: 0, max: 50, step: 0.1, tooltip: 'Used for DAPSA calculation.' },
      { id: 'psa-esr', label: 'ESR (mm/hr)', type: 'numeric', min: 0, max: 200 },
    ],
  },
];
```

- [ ] **Step 6: Create PsA medications data**

Add `psa` key to `src/data/medications.js` MEDICATIONS object. PsA shares many RA medications plus:

```js
psa: [
  // Re-use RA csDMARDs (methotrexate, leflunomide, sulfasalazine) — copy entries
  { id: 'methotrexate', name: 'Methotrexate', class: 'csDMARD', monitoring: [
    { item: 'CBC with differential', frequency: 'Every 3 months initially, then every 3-6 months', notes: '' },
    { item: 'CMP (LFTs, renal function)', frequency: 'Every 3 months initially, then every 3-6 months', notes: '' },
    { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
    { item: 'Folic acid 1mg daily prescribed', frequency: 'Verify at each visit', notes: 'Reduces GI and hematologic side effects' },
  ]},
  { id: 'leflunomide', name: 'Leflunomide', class: 'csDMARD', monitoring: [
    { item: 'CBC', frequency: 'Baseline then periodically', notes: '' },
    { item: 'CMP (LFTs)', frequency: 'Monthly for first 6 months, then every 6-8 weeks', notes: '' },
    { item: 'Blood pressure', frequency: 'Each visit', notes: 'Can cause hypertension' },
  ]},
  { id: 'sulfasalazine', name: 'Sulfasalazine', class: 'csDMARD', monitoring: [
    { item: 'CBC with differential', frequency: 'Every 2-4 weeks for first 3 months, then every 3 months', notes: '' },
    { item: 'CMP', frequency: 'Every 2-4 weeks for first 3 months, then every 3 months', notes: '' },
  ]},
  // TNFi — same as RA (adalimumab, etanercept most common in PsA)
  { id: 'adalimumab', name: 'Adalimumab', class: 'TNFi', monitoring: [
    { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
    { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
    { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
    { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
  ]},
  { id: 'etanercept', name: 'Etanercept', class: 'TNFi', monitoring: [
    { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
    { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
    { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
    { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
  ]},
  // PsA-specific biologics
  { id: 'apremilast', name: 'Apremilast', class: 'PDE4 inhibitor', monitoring: [
    { item: 'Weight monitoring', frequency: 'Each visit', notes: 'Can cause weight loss' },
    { item: 'Depression/mood screening', frequency: 'Each visit', notes: '' },
    { item: 'GI tolerance assessment', frequency: 'Each visit', notes: 'Nausea/diarrhea common initially' },
  ]},
  { id: 'secukinumab', name: 'Secukinumab', class: 'IL-17i', monitoring: [
    { item: 'TB screening', frequency: 'Before starting', notes: '' },
    { item: 'Monitor for candidal infections', frequency: 'Each visit', notes: 'Oral and skin candidiasis' },
    { item: 'IBD symptom screening', frequency: 'Each visit', notes: 'New GI symptoms may indicate IBD exacerbation' },
  ]},
  { id: 'ixekizumab', name: 'Ixekizumab', class: 'IL-17i', monitoring: [
    { item: 'TB screening', frequency: 'Before starting', notes: '' },
    { item: 'Monitor for candidal infections', frequency: 'Each visit', notes: '' },
    { item: 'IBD symptom screening', frequency: 'Each visit', notes: '' },
  ]},
  { id: 'ustekinumab', name: 'Ustekinumab', class: 'IL-12/23i', monitoring: [
    { item: 'TB screening', frequency: 'Before starting', notes: '' },
    { item: 'Monitor for infection', frequency: 'Each visit', notes: 'No routine lab monitoring required per guidelines' },
  ]},
  { id: 'guselkumab', name: 'Guselkumab', class: 'IL-23i', monitoring: [
    { item: 'TB screening', frequency: 'Before starting', notes: '' },
    { item: 'Monitor for infection', frequency: 'Each visit', notes: '' },
  ]},
  // JAKi (same as RA)
  { id: 'tofacitinib', name: 'Tofacitinib', class: 'JAKi', monitoring: [
    { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
    { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
    { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
    { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
    { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors' },
  ]},
  { id: 'upadacitinib', name: 'Upadacitinib', class: 'JAKi', monitoring: [
    { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
    { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
    { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
    { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
    { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors' },
  ]},
],
```

- [ ] **Step 7: Create PsA escalation criteria**

Add to `src/data/escalationCriteria.js`:

```js
const psaEscalation = [
  { id: 'psa-red-uveitis', level: 'red', condition: (state) => state.answers['psa-eye-symptoms'] === true,
    message: 'Suspected uveitis. Urgent ophthalmology referral + rheumatologist notification.', guideline: 'ACR_PsA_2018' },
  { id: 'psa-red-multidomain', level: 'red',
    condition: (state) => {
      const domains = ['psa-axial-symptoms', 'psa-dactylitis', 'psa-eye-symptoms'].filter(k => state.answers[k] === true);
      const hasEnthesitis = Array.isArray(state.answers['psa-enthesitis-sites']) && state.answers['psa-enthesitis-sites'].length > 0;
      const hasSkin = ['moderate', 'severe'].includes(state.answers['psa-skin-severity']);
      return (domains.length + (hasEnthesitis ? 1 : 0) + (hasSkin ? 1 : 0)) >= 3 && ['on-bDMARD', 'failed-bDMARD'].includes(state.answers['psa-treatment-status']);
    },
    message: 'Multi-domain active PsA not responding to current therapy. Urgent rheumatology contact.', guideline: 'GRAPPA_2021' },
  { id: 'psa-yellow-not-mda', level: 'yellow',
    condition: (state) => ['on-csDMARD', 'on-bDMARD'].includes(state.answers['psa-treatment-status']) && state.answers['psa-severity'] !== 'mild',
    message: 'Not meeting MDA on current therapy. Schedule rheumatology follow-up.', guideline: 'ACR_PsA_2018' },
  { id: 'psa-yellow-new-domain', level: 'yellow',
    condition: (state) => state.answers['psa-axial-symptoms'] === true && state.answers['psa-dominant-domain'] === 'peripheral',
    message: 'New axial symptoms in previously peripheral-only PsA. Rheumatology follow-up recommended.', guideline: 'GRAPPA_2021' },
  { id: 'psa-yellow-skin-flare', level: 'yellow',
    condition: (state) => state.answers['psa-skin-severity'] === 'severe',
    message: 'Severe skin flare — consider dermatology co-management.', guideline: 'ACR_PsA_2018' },
];
```

Add `psa: psaEscalation` to `escalationByCondition`.

- [ ] **Step 8: Create PsA module component**

Create `src/components/conditions/PsoriaticArthritis/PsAModule.jsx` — follows same pattern as RAModule/GoutModule. Renders QuestionCard groups for symptoms, ScoreCalculator for DAPSA in scoring section, medication grid from MEDICATIONS.psa, MedMonitorChecklist for monitoring.

- [ ] **Step 9: Run tests**

```bash
npm test
```

Expected: All tests pass including new psaRules tests.

- [ ] **Step 10: Commit**

```bash
git add src/components/conditions/PsoriaticArthritis/ tests/psaRules.test.js src/data/medications.js src/data/escalationCriteria.js
git commit -m "feat: add Psoriatic Arthritis module

Questions (peripheral, axial, enthesitis, dactylitis, skin, nails),
DAPSA scoring, ACR/NPF 2018 + GRAPPA 2021 domain-based rules,
IL-17/IBD caution, PsA-specific medications and monitoring,
escalation criteria (uveitis, multi-domain)."
```

---

### Task 3: Axial Spondyloarthritis Module (TDD)

**Files:**
- Create: `src/components/conditions/AxialSpondyloarthritis/AxSpAQuestions.js`
- Create: `src/components/conditions/AxialSpondyloarthritis/AxSpARules.js`
- Create: `src/components/conditions/AxialSpondyloarthritis/AxSpAScoring.js`
- Create: `src/components/conditions/AxialSpondyloarthritis/AxSpAModule.jsx`
- Create: `tests/axspaRules.test.js`
- Modify: `src/data/medications.js` — add `axspa` key
- Modify: `src/data/escalationCriteria.js` — add `axspa` escalation

The AxSpA module covers ACR/SAA/SPARTAN 2019 recommendations. Key features:
- BASDAI and ASDAS scoring
- NSAIDs as first-line (at least 2 tried for >=4 weeks each)
- Exercise/PT strongly recommended for ALL patients
- csDMARDs NOT effective for axial disease (critical warning)
- TNFi first biologic, IL-17i second, JAKi third
- Axspa medications: NSAIDs, TNFi (adalimumab, etanercept, infliximab, certolizumab, golimumab), IL-17i (secukinumab, ixekizumab), JAKi (tofacitinib, upadacitinib), sulfasalazine (peripheral only)
- NSAID monitoring: renal function, GI risk, CV risk, PPI co-prescription
- Exercise documentation at every visit
- Red flags: new anterior uveitis, new/worsening IBD, neurological symptoms, very high ASDAS >3.5 despite biologic
- Yellow flags: BASDAI >=4 or ASDAS >=2.1 despite 3 months treatment, biologic initiation needed, progressive structural damage concerns

Follow the exact same test/rule/question/module/escalation pattern as Task 2 (PsA). Tests should cover: NSAID-first, NSAID failure → TNFi, TNFi failure → IL-17i, exercise reinforcement, csDMARD axial warning, and special populations (uveitis, IBD).

- [ ] **Step 1-10: Same TDD pattern as Task 2** (write tests → verify fail → implement rules → implement questions → add medications → add escalation → create module → verify pass → commit)

Commit message:
```
"feat: add Axial Spondyloarthritis module

BASDAI/ASDAS scoring, ACR/SAA/SPARTAN 2019 algorithm,
NSAIDs first-line, exercise for all, csDMARD axial warning,
TNFi/IL-17i/JAKi step therapy, NSAID monitoring,
escalation (uveitis, IBD, neurological, very high ASDAS)."
```

---

### Task 4: Undifferentiated Inflammatory Arthritis Module (TDD)

**Files:**
- Create: `src/components/conditions/UndifferentiatedIA/UIAQuestions.js`
- Create: `src/components/conditions/UndifferentiatedIA/UIARules.js`
- Create: `src/components/conditions/UndifferentiatedIA/UIAModule.jsx`
- Create: `tests/uiaRules.test.js`
- Modify: `src/data/escalationCriteria.js` — add `uia` escalation

UIA is fundamentally different: primary function is tracking evolution toward classifiable diagnosis. No specific scoring. Uses RA medication list (MEDICATIONS.ra) since csDMARDs are the main treatment.

Key rules:
- If RF+/anti-CCP+ + symmetric small joints → suggest reclassify as RA
- If psoriasis + asymmetric + dactylitis/enthesitis → suggest PsA
- If inflammatory back pain + HLA-B27+ → suggest axSpA
- If inflammatory arthritis confirmed → initiate csDMARD (MTX preferred) promptly
- If uncertain → NSAIDs + short-course GC + close follow-up
- Do NOT initiate biologics without rheumatologist
- Autoantibody panel recheck at 3-6 months if initially negative
- Red flags: rapid progressive joint destruction, new systemic features (fever, serositis, cytopenias → SLE/vasculitis)
- Yellow flags: features evolving toward classifiable diagnosis, inadequate csDMARD response at 3 months, diagnostic uncertainty >6 months

Questions: joint pattern (symmetric/asymmetric, small/large, axial), joint count, morning stiffness, duration (<6wk/6wk-6mo/>6mo), associated features screening (skin, eyes, oral ulcers, Raynaud's, family hx, recent infection, GI, urethritis/enthesitis), available labs (RF, anti-CCP, ANA, HLA-B27, ESR, CRP), imaging findings.

- [ ] **Step 1-10: Same TDD pattern** (tests → rules → questions → escalation → module → commit)

Commit message:
```
"feat: add Undifferentiated Inflammatory Arthritis module

Diagnostic evolution tracking (RA/PsA/axSpA reclassification),
EULAR 2016 early arthritis approach, csDMARD initiation,
no-biologic-without-rheumatologist guard, autoantibody monitoring,
escalation (progressive destruction, systemic features, diagnostic uncertainty)."
```

---

### Task 5: Fibromyalgia Module (TDD)

**Files:**
- Create: `src/components/conditions/Fibromyalgia/FibroQuestions.js`
- Create: `src/components/conditions/Fibromyalgia/FibroRules.js`
- Create: `src/components/conditions/Fibromyalgia/FibroScoring.js`
- Create: `src/components/conditions/Fibromyalgia/FibroModule.jsx`
- Create: `tests/fibroRules.test.js`
- Modify: `src/data/medications.js` — add `fibro` key
- Modify: `src/data/escalationCriteria.js` — add `fibro` escalation

Fibro uses EULAR 2016 recommendations. Key differences from other modules:
- FSQ scoring (WPI + SSS) with diagnostic criteria verification at each visit
- Non-pharmacologic treatment is FIRST-LINE (exercise, CBT, multimodal rehab)
- Medications are ADJUNCTIVE only
- PHQ-2/PHQ-9 mood screening built into questions
- Strongly AGAINST: opioids, systemic corticosteroids, NSAIDs as primary treatment
- Polypharmacy flag: >2 fibro medications = yellow flag

Medications (fibro-specific):
- duloxetine: BP monitoring, LFTs, suicidal ideation screening, hepatic contraindication
- milnacipran: BP and HR monitoring, suicidal ideation screening
- pregabalin: weight, edema, dizziness/somnolence, renal dose adjustment
- gabapentin: renal dose adjustment, somnolence, weight
- amitriptyline: ECG if cardiac risk, anticholinergic effects, weight
- cyclobenzaprine: similar to amitriptyline monitoring, MAOI contraindication

Rules:
- Always recommend exercise (graded, 150min/week goal) — every visit
- CBT strongly recommended
- Duloxetine if pain + depression/anxiety
- Pregabalin if pain + sleep disturbance
- Amitriptyline if pain + sleep (low-dose)
- Against opioids (flag if patient requesting)
- Against NSAIDs as primary treatment
- Medication trial: evaluate at 4-8 weeks, taper if no benefit
- Polypharmacy flag: >2 fibro meds simultaneously

Red flags: new neuro findings (alternative dx), active suicidal ideation (PHQ-9), symptoms suggesting undiagnosed inflammatory arthritis, substance use disorder
Yellow flags: PHQ-9 >=10 (moderate depression), >=3 fibro meds without benefit, functional decline, disability request, opioid request

- [ ] **Step 1-10: Same TDD pattern** (tests → rules → questions → medications → escalation → scoring → module → commit)

Commit message:
```
"feat: add Fibromyalgia module

FSQ (WPI+SSS) with diagnostic criteria check, EULAR 2016
non-pharmacologic first-line (exercise, CBT), adjunctive
medications (duloxetine, pregabalin, amitriptyline),
anti-opioid/NSAID guidance, mood screening, polypharmacy flag,
escalation (suicidal ideation, neuro findings, substance use)."
```

---

### Task 6: Integration Wiring + Enable All Conditions

**Files:**
- Modify: `src/components/conditions/ConditionSelector.jsx` — enable all 4
- Modify: `src/hooks/useVisitState.js` — register 4 rule sets
- Modify: `src/hooks/useScoring.js` — add PsA/AxSpA/Fibro score wiring
- Modify: `src/utils/exportFormatter.js` — add score formatting for new conditions
- Modify: `src/App.jsx` — import and render 4 new modules

- [ ] **Step 1: Enable conditions in selector**

In `src/components/conditions/ConditionSelector.jsx`, change `enabled: false` to `enabled: true` for psa, axspa, uia, fibro. Remove "Phase 2" badges.

- [ ] **Step 2: Register rules in useVisitState**

Add imports and register in rulesByCondition:

```js
import { psaRules } from '../components/conditions/PsoriaticArthritis/PsARules.js';
import { axspaRules } from '../components/conditions/AxialSpondyloarthritis/AxSpARules.js';
import { uiaRules } from '../components/conditions/UndifferentiatedIA/UIARules.js';
import { fibroRules } from '../components/conditions/Fibromyalgia/FibroRules.js';

const rulesByCondition = { ra: raRules, gout: goutRules, psa: psaRules, axspa: axspaRules, uia: uiaRules, fibro: fibroRules };
```

- [ ] **Step 3: Add scoring hook wiring**

In `src/hooks/useScoring.js`, add DAPSA, BASDAI, ASDAS, FSQ calculations from answers:

```js
import { calculateCDAI, calculateDAS28ESR, calculateDAS28CRP, calculateRAPID3, calculateDAPSA, calculateBASDAI, calculateASDASCRP, calculateASDASSER, calculateFSQ } from '../utils/scoreCalculations.js';

export function useScoring(answers, condition) {
  return useMemo(() => {
    if (condition === 'ra') {
      // ... existing RA scoring
    }
    if (condition === 'psa') {
      return {
        dapsa: calculateDAPSA({
          sjc66: answers['psa-sjc66'] ?? null, tjc68: answers['psa-tjc68'] ?? null,
          painVAS: answers['psa-patient-pain'] ?? null, patientGlobalVAS: answers['psa-patient-global'] ?? null,
          crp: answers['psa-crp'] ?? null,
        }),
      };
    }
    if (condition === 'axspa') {
      return {
        basdai: calculateBASDAI({
          q1Fatigue: answers['axspa-basdai-q1'] ?? null, q2SpinalPain: answers['axspa-basdai-q2'] ?? null,
          q3JointPain: answers['axspa-basdai-q3'] ?? null, q4Enthesitis: answers['axspa-basdai-q4'] ?? null,
          q5MorningStiffnessSeverity: answers['axspa-basdai-q5'] ?? null, q6MorningStiffnessDuration: answers['axspa-basdai-q6'] ?? null,
        }),
        asdasCrp: calculateASDASCRP({
          backPain: answers['axspa-basdai-q2'] ?? null, morningStiffness: answers['axspa-basdai-q6'] ?? null,
          patientGlobal: answers['axspa-patient-global'] ?? null, peripheralPain: answers['axspa-basdai-q3'] ?? null,
          crp: answers['axspa-crp'] ?? null,
        }),
        asdasEsr: calculateASDASSER({
          backPain: answers['axspa-basdai-q2'] ?? null, morningStiffness: answers['axspa-basdai-q6'] ?? null,
          patientGlobal: answers['axspa-patient-global'] ?? null, peripheralPain: answers['axspa-basdai-q3'] ?? null,
          esr: answers['axspa-esr'] ?? null,
        }),
      };
    }
    if (condition === 'fibro') {
      return {
        fsq: calculateFSQ({ wpiScore: answers['fibro-wpi'] ?? null, sssScore: answers['fibro-sss'] ?? null }),
      };
    }
    return {};
  }, [answers, condition]);
}
```

- [ ] **Step 4: Add export formatter score sections**

In `src/utils/exportFormatter.js`, add PsA/AxSpA/UIA/Fibro handling to `formatScores`:

```js
if (condition === 'psa') {
  if (scores.dapsa?.score != null) lines.push(`DAPSA: ${scores.dapsa.score} (${scores.dapsa.category})`);
  if (answers['psa-sjc66'] != null) symptoms.push(`SJC66: ${answers['psa-sjc66']}`);
  // ... etc
}
if (condition === 'axspa') {
  if (scores.basdai?.score != null) lines.push(`BASDAI: ${scores.basdai.score} (${scores.basdai.category})`);
  if (scores.asdasCrp?.score != null) lines.push(`ASDAS-CRP: ${scores.asdasCrp.score} (${scores.asdasCrp.category})`);
}
if (condition === 'uia') {
  // Labs and feature tracking
}
if (condition === 'fibro') {
  if (scores.fsq?.score != null) lines.push(`FSQ: ${scores.fsq.score} (${scores.fsq.category})`);
  if (scores.fsq?.diagnosticCriteriaMet != null) lines.push(`Diagnostic criteria met: ${scores.fsq.diagnosticCriteriaMet ? 'Yes' : 'No'}`);
}
```

- [ ] **Step 5: Add module imports and renders to App.jsx**

```js
import PsAModule from './components/conditions/PsoriaticArthritis/PsAModule';
import AxSpAModule from './components/conditions/AxialSpondyloarthritis/AxSpAModule';
import UIAModule from './components/conditions/UndifferentiatedIA/UIAModule';
import FibroModule from './components/conditions/Fibromyalgia/FibroModule';

// In renderMainContent:
if (state.condition === 'psa') return <PsAModule state={state} dispatch={dispatch} currentSection={state.currentSection} />;
if (state.condition === 'axspa') return <AxSpAModule state={state} dispatch={dispatch} currentSection={state.currentSection} />;
if (state.condition === 'uia') return <UIAModule state={state} dispatch={dispatch} currentSection={state.currentSection} />;
if (state.condition === 'fibro') return <FibroModule state={state} dispatch={dispatch} currentSection={state.currentSection} />;
```

- [ ] **Step 6: Run all tests + build**

```bash
npm test && npm run build
```

Expected: All tests pass, build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/conditions/ConditionSelector.jsx src/hooks/useVisitState.js src/hooks/useScoring.js src/utils/exportFormatter.js src/App.jsx
git commit -m "feat: wire all Phase 2 modules into application

Enable PsA, AxSpA, UIA, Fibromyalgia in condition selector.
Register rules, scoring, export formatting, and module rendering
for all 6 conditions."
```

---

### Task 7: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass (scoring, raRules, goutRules, psaRules, axspaRules, uiaRules, fibroRules, escalation, exportFormatter).

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Clean up smoke test**

```bash
rm tests/smoke.test.js
git add -A && git commit -m "chore: remove smoke test, verify Phase 2 complete"
```

---

## Self-Review

**Spec coverage:**
- [x] PsA: peripheral/axial/enthesitis/dactylitis/skin/nail assessment, DAPSA scoring, MDA reference, ACR/NPF 2018 + GRAPPA 2021 rules, domain-based approach, PsA medications + monitoring, escalation — Task 2
- [x] AxSpA: BASDAI/ASDAS scoring, inflammatory back pain, NSAIDs first-line, exercise mandatory, csDMARD axial warning, TNFi/IL-17i/JAKi step therapy, escalation — Task 3
- [x] UIA: diagnostic evolution tracking, classification criteria screening, csDMARD initiation, no-biologic guard, autoantibody monitoring — Task 4
- [x] Fibromyalgia: FSQ (WPI+SSS), diagnostic criteria check, non-pharmacologic first-line, exercise/CBT, adjunctive medications, anti-opioid, mood screening, polypharmacy flag — Task 5
- [x] Score functions: DAPSA, BASDAI, ASDAS-CRP, ASDAS-ESR, FSQ — Task 1
- [x] Integration wiring: ConditionSelector, useVisitState, useScoring, exportFormatter, App.jsx — Task 6

**Placeholder scan:** No TBD/TODO. Tasks 3-5 reference "same pattern as Task 2" which is acceptable as they describe the pattern (TDD: tests → rules → questions → meds → escalation → module → commit) but each has unique clinical content specified.

**Type consistency:**
- `getRecommendations(state, rules, GUIDELINES)` — same signature used throughout
- `evaluateEscalation(state)` — consistent
- `useScoring(answers, condition)` — Task 6 adds `condition` parameter (modification from Phase 1's `useScoring(answers)`)
- Question IDs match rule conditions within each module
- Score keys in useScoring match ScoreCalculator scoreKey props
