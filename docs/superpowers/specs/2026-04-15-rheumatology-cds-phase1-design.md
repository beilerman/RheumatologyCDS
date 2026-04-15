# RheumatologyCDS Phase 1 Design Spec

## Overview

Clinical decision support tool for nurse practitioners conducting rheumatology follow-up video visits. Purely deterministic, rule-based, stateless, client-side only.

**Phase 1 scope**: Shared infrastructure + RA module + Gout module.
**Phase 2 scope**: PsA, AxSpA, UIA, Fibromyalgia modules (same patterns, data entry).

## Users and Setting

- **Users**: Nurse practitioners with limited rheumatology practical experience
- **Setting**: Video-based follow-up visits (not initial diagnosis)
- **Organization**: Multi-specialty physician group (St. Elizabeth Physicians, Northern Kentucky)
- **Design philosophy**: Over-prompt rather than assume knowledge. Every recommendation traceable to a guideline citation.

## Tech Stack

- React (functional components, hooks, JSX)
- Tailwind CSS
- Vite
- State: `useReducer` via custom `useVisitState` hook
- No backend, no database, no API calls, no auth
- Vitest for testing

## Project Structure

```
rheumatology-cds/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── shared/
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ScoreCalculator.jsx
│   │   │   ├── AlertBanner.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── MedMonitorChecklist.jsx
│   │   │   ├── ExportSummary.jsx
│   │   │   └── GuidelineCitation.jsx
│   │   ├── conditions/
│   │   │   ├── ConditionSelector.jsx
│   │   │   ├── RheumatoidArthritis/
│   │   │   │   ├── RAModule.jsx
│   │   │   │   ├── RAQuestions.js
│   │   │   │   ├── RARules.js
│   │   │   │   └── RAScoring.js
│   │   │   └── Gout/
│   │   │       ├── GoutModule.jsx
│   │   │       ├── GoutQuestions.js
│   │   │       └── GoutRules.js
│   │   └── export/
│   │       └── VisitSummaryGenerator.jsx
│   ├── data/
│   │   ├── guidelines.js
│   │   ├── medications.js
│   │   └── escalationCriteria.js
│   ├── hooks/
│   │   ├── useVisitState.js
│   │   └── useScoring.js
│   └── utils/
│       ├── scoreCalculations.js
│       ├── recommendationEngine.js
│       └── exportFormatter.js
├── tests/
│   ├── scoring.test.js
│   ├── raRules.test.js
│   ├── goutRules.test.js
│   ├── escalation.test.js
│   └── exportFormatter.test.js
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vitest.config.js
```

## State Architecture

Single state tree managed by `useReducer` in `useVisitState` hook. JSON-serializable for future persistence.

```js
{
  condition: null | 'ra' | 'gout' | ...,
  currentSection: 'condition-select',
  sectionStatus: {
    'condition-select': 'complete' | 'in-progress' | 'pending',
    'symptoms': ...,
    'scoring': ...,
    'medications': ...,
    'monitoring': ...,
    'recommendations': ...,
    'escalation': ...,
    'summary': ...
  },
  answers: {
    // Keyed by question ID, values are primitives or arrays
    'ra-morning-stiffness': 30,
    'ra-sjc28': 4,
    'ra-flares-since-last': 2,
    ...
  },
  scores: {
    // Computed or manually entered
    cdai: { score: 14.2, category: 'Moderate', source: 'calculated' },
    das28esr: null,
    ...
  },
  medications: {
    current: ['methotrexate', 'adalimumab'],
    doses: { methotrexate: '15mg weekly', adalimumab: '40mg biweekly' }
  },
  recommendations: [],  // Computed by rule engine
  escalation: { level: 'green' | 'yellow' | 'red', flags: [] },
  metadata: {
    startedAt: ISO timestamp,
    conditionSelectedAt: ISO timestamp
  }
}
```

**Dispatch actions**: `SET_CONDITION`, `SET_ANSWER`, `SET_SCORE`, `SET_MEDICATIONS`, `SET_SECTION`, `RESET_VISIT`.

Recommendations and escalation flags are derived (recomputed on every state change via the rule engine and escalation evaluator), not stored as primary state. They appear in the state tree for export convenience but are always recomputed.

## Layout

```
+------------------------------------------+
|  Header: App title | Condition badge | Progress bar  |
+--------+-----------------+---------------+
| Sidebar|   Main Content  | Right Panel   |
| (nav)  |   (cards)       | (live recs +  |
|        |                 |  alerts)      |
|        |                 | [collapsible] |
+--------+-----------------+---------------+
|  Footer: [Generate Visit Summary]        |
+------------------------------------------+
```

- **Sidebar**: Section list with completion indicators (empty/half/filled circles). Click to jump.
- **Main content**: Single-column, card-based. One question group per `QuestionCard`.
- **Right panel**: Collapsible. Shows live recommendations and escalation alerts as data enters.
- **Footer**: Sticky "Generate Visit Summary" button, always visible.

### Colors

| Purpose | Hex |
|---------|-----|
| Primary (clinical trust) | #1e3a5f |
| Background | #f8f9fa |
| Green (on-track) | #16a34a |
| Yellow (attention) | #eab308 |
| Red (escalation) | #dc2626 |
| Info/tooltips | #3b82f6 |

### Responsive

Desktop-first. Minimum viewport 1024px. Tablet functional, mobile not prioritized.

## Shared Components

### QuestionCard

Renders a group of related questions within a card. Supports input types: dropdown, toggle (yes/no), numeric stepper, slider (0-10), radio group, multi-select. Each question can have an optional `tooltip` (education "why this matters" content) rendered as an expandable section.

### ScoreCalculator

Dual-mode: enter raw component values (auto-calculates) OR enter a pre-calculated composite score. Shows the score category with color coding (remission=green, low=green, moderate=yellow, high=red).

### AlertBanner

Red/yellow/green banner. Red = immediate escalation. Yellow = scheduled follow-up. Green = continue current plan. Shows specific reason text.

### RecommendationCard

Displays a single recommendation with: text, strength (strong/conditional), inline `GuidelineCitation`, rationale (expandable), and any special population flags.

### MedMonitorChecklist

Given the list of current medications, renders a checklist of monitoring items. Each item has: what to check, frequency, and whether it's due/overdue/current (NP marks manually since we have no lab data).

### GuidelineCitation

Inline citation component. Shows short reference on hover/click expands to full citation with DOI link.

### ExportSummary / VisitSummaryGenerator

Generates structured text block for EPIC copy-paste. Copy-to-clipboard button.

## Rule Engine

Data-driven array of rule objects per condition module:

```js
{
  id: 'ra-initial-moderate-high',
  condition: (state) => {
    const da = state.scores.cdai?.category || state.scores.das28esr?.category;
    return ['Moderate', 'High'].includes(da) && state.answers['ra-dmard-history'] === 'naive';
  },
  recommendation: 'Initiate methotrexate monotherapy',
  strength: 'strong',
  guideline: 'ACR_RA_2021',
  rationale: 'Methotrexate is strongly recommended as first-line DMARD for DMARD-naive RA with moderate-to-high disease activity.',
  specialPopulations: [
    { condition: (s) => s.answers['ra-hepatitis-b'] === true, note: 'Screen for hepatitis B before initiating.' }
  ]
}
```

`getRecommendations(state)` in `recommendationEngine.js`:
1. Selects the rule set for `state.condition`
2. Filters rules where `rule.condition(state)` is true
3. Evaluates `specialPopulations` flags
4. Hydrates with guideline references from `guidelines.js`
5. Returns sorted by strength (strong first)

## Escalation Engine

Same pattern — array of flag objects in `escalationCriteria.js`:

```js
{
  id: 'ra-red-extraarticular',
  level: 'red',
  condition: (state) => state.answers['ra-extraarticular'] && state.answers['ra-extraarticular'].length > 0,
  message: 'New extra-articular manifestation reported. Immediate rheumatologist contact recommended.',
  guideline: 'ACR_RA_2021'
}
```

Highest-level flag wins (red > yellow > green).

## Module 1: Rheumatoid Arthritis

### Questions (RAQuestions.js)

Organized into groups for QuestionCard rendering:

**Symptoms group:**
- `ra-morning-stiffness`: numeric (minutes)
- `ra-sjc28`: numeric stepper (0-28)
- `ra-tjc28`: numeric stepper (0-28)
- `ra-patient-global`: slider (0-10)
- `ra-provider-global`: slider (0-10)
- `ra-pain-vas`: slider (0-10)
- `ra-functional-status`: radio (improved/stable/worsened)
- `ra-new-joints`: toggle + text (location)
- `ra-flares-since-last`: numeric + severity/duration
- `ra-extraarticular`: multi-select (nodules, ILD, vasculitis, eye)
- `ra-fatigue`: slider (0-10)
- `ra-exercise`: toggle

**Context group (for rule engine):**
- `ra-dmard-history`: dropdown (naive / on-csDMARD / failed-csDMARD / on-bDMARD / failed-bDMARD)
- `ra-current-biologic-mechanism`: dropdown (TNFi / IL-6i / JAKi / abatacept / rituximab / none)
- `ra-prednisone-duration`: dropdown (<1 month / 1-3 months / >3 months / not on prednisone)
- `ra-heart-failure`: toggle
- `ra-prior-serious-infection`: toggle
- `ra-hepatitis-b`: toggle
- `ra-hepatitis-c`: toggle
- `ra-lymphoproliferative-history`: toggle
- `ra-ntb-lung-disease`: toggle

### Scoring (RAScoring.js)

Pure functions:

- `calculateCDAI({ sjc28, tjc28, patientGlobal, providerGlobal })` — Sum. Remission <=2.8, Low <=10, Moderate <=22, High >22.
- `calculateDAS28ESR({ sjc28, tjc28, esr, patientGlobal })` — 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.70*ln(ESR) + 0.014*PGA. Remission <2.6, Low <3.2, Moderate <=5.1, High >5.1.
- `calculateDAS28CRP({ sjc28, tjc28, crp, patientGlobal })` — 0.56*sqrt(TJC28) + 0.28*sqrt(SJC28) + 0.36*ln(CRP+1) + 0.014*PGA + 0.96. Same categories.
- `calculateRAPID3({ function0to10, pain0to10, globalVAS0to10 })` — Sum (0-30). Near-remission <=3, Low <=6, Moderate <=12, High >12.

All return `{ score, category, error }`.

### Rules (RARules.js)

Covers the full ACR 2021 algorithm:
- DMARD-naive: low DA → HCQ; moderate/high DA → MTX; MTX contraindicated → LEF or SSZ
- MTX inadequate: add/switch bDMARD or tsDMARD (conditional over triple therapy)
- Failed first bDMARD: switch mechanism or tsDMARD; failed TNFi → non-TNF or tsDMARD
- GC rules: flag >3 months prednisone; recommend against long-term use
- Special populations: HF→avoid TNFi, infection history, hep B/C, lymphoproliferative, NTB lung

### Medication Monitoring

Medications relevant to RA with monitoring arrays: methotrexate, leflunomide, hydroxychloroquine, sulfasalazine, TNFi (adalimumab, etanercept, infliximab, certolizumab, golimumab), IL-6i (tocilizumab, sarilumab), JAKi (tofacitinib, baricitinib, upadacitinib), abatacept, rituximab, prednisone.

Each entry: `{ name, class, monitoring: [{ item, frequency, notes }] }`.

### Escalation

**Red flags**: new extra-articular, suspected biologic serious infection, ANC <1000 or plt <50K, new/worsening HF on TNFi, CDAI >22 or DAS28 >5.1 despite bDMARD/tsDMARD, suspected severe medication reaction.

**Yellow flags**: moderate DA not at target >=3 months, need to discuss biologic start/switch, prednisone >7.5mg unable to taper, lab abnormalities needing dose change, patient requesting medication change beyond NP scope, suboptimal first-line DMARD response.

## Module 2: Gout

### Questions (GoutQuestions.js)

**Current status group:**
- `gout-current-flare`: toggle (branches to acute management if yes)
- `gout-flare-frequency`: numeric (since last visit)
- `gout-flare-joints`: multi-select
- `gout-tophi`: toggle + location + size change (growing/stable/shrinking)
- `gout-pain`: slider (0-10)
- `gout-functional-limitation`: radio (none/mild/moderate/severe)

**Lifestyle group:**
- `gout-alcohol`: dropdown (none / occasional / moderate / heavy) + type (beer/spirits/wine)
- `gout-purine-diet`: radio (adherent / partially / non-adherent)
- `gout-hfcs-intake`: radio (none / occasional / frequent)
- `gout-hydration`: radio (adequate / inadequate)
- `gout-weight-change`: radio (loss / stable / gain) + amount

**Comorbidities group:**
- `gout-ckd-stage`: dropdown (none / 1 / 2 / 3a / 3b / 4 / 5)
- `gout-hypertension`: toggle
- `gout-cvd`: toggle
- `gout-diabetes`: toggle
- `gout-nephrolithiasis`: toggle

**Labs group:**
- `gout-serum-urate`: numeric (mg/dL)
- `gout-urate-at-target`: derived (< 6 mg/dL)
- `gout-egfr`: numeric
- `gout-creatinine`: numeric

**ULT context group:**
- `gout-on-ult`: toggle
- `gout-ult-medication`: dropdown (allopurinol / febuxostat / probenecid / none)
- `gout-ult-dose`: text
- `gout-ult-adherence`: radio (good / partial / poor)
- `gout-hla-b5801-tested`: toggle (if starting allopurinol + Southeast Asian or African American)
- `gout-flare-prophylaxis`: toggle + medication

### Rules (GoutRules.js)

Covers ACR 2020 algorithm:

**ULT indications** (verify at each visit):
- Strongly recommended if: tophi >=1, radiographic damage, >=2 flares/year
- Conditionally recommended if: <2 flares/year with prior >1 flare
- Conditionally recommended if: first flare + CKD >=3 or SU >9 or urolithiasis
- Conditionally against if: first flare without above features

**ULT management** (treat-to-target):
- Target SU <6 mg/dL
- First-line: allopurinol (start <=100mg, <=50mg if eGFR <30; titrate q2-5wk by 100mg/50mg; max 800mg)
- Febuxostat second-line (CV warning discussion required)
- Probenecid third-line (adequate renal function, no urolithiasis)
- Pegloticase NOT first-line (rheumatologist only)

**Flare prophylaxis**:
- Required during ULT initiation/titration
- Colchicine, low-dose NSAID, or low-dose GC
- Duration >=3-6 months

**Acute flare**:
- Colchicine (within 36h onset), NSAIDs, or GC
- Combination if severe
- IL-1 inhibitors reserved for refractory

**Concurrent medications**:
- Losartan preferred antihypertensive (uricosuric)
- Don't stop low-dose aspirin
- Against fenofibrate for ULT
- Consider switching HCTZ

**Lifestyle recommendations**: limit alcohol (especially beer/spirits), limit organ meats, limit HFCS, weight loss if overweight. Against vitamin C supplementation and cherry extract.

### Medication Monitoring

- Allopurinol: SU q2-5wk during titration then q6mo; renal annually; HLA-B*5801 before starting (SE Asian, African American)
- Febuxostat: SU during titration; LFTs; CV risk discussion
- Colchicine: CBC if prolonged; renal/hepatic; drug interactions (clarithromycin, cyclosporine, statins)
- Probenecid: renal function; drug interactions

### Escalation

**Red flags**: suspected allopurinol hypersensitivity syndrome, refractory tophaceous gout (pegloticase candidate), polyarticular flare unresponsive to standard therapy, suspected septic joint.

**Yellow flags**: not at SU target despite allopurinol >=300mg, recurrent flares despite ULT+prophylaxis, febuxostat initiation discussion needed, new CKD progression, ULT non-adherence.

## Guideline Citation Library

```js
{
  ACR_RA_2021: { short, full, url },
  ACR_GOUT_2020: { short, full, url },
  ACR_PsA_2018: { short, full, url },
  ACR_axSpA_2019: { short, full, url },
  EULAR_FIBRO_2016: { short, full, url },
  GRAPPA_2021: { short, full, url },
  EULAR_EARLY_ARTHRITIS_2016: { short, full, url },
  ACR_RA_MEASURES_2019: { short, full, url },
  EULAR_RA_2022: { short, full, url }
}
```

Full citations and DOI URLs as specified in the original prompt.

## Visit Summary Export Format

```
RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY
=====================================
Date: [auto-generated]
Condition: [selected condition]
Visit Type: Video Follow-Up

DISEASE ACTIVITY:
[Score name]: [value] ([category])
[Key symptom summary]

CURRENT MEDICATIONS:
- [Med]: [dose]

MEDICATION MONITORING STATUS:
- [Item]: [Due/Overdue/Current/Needs ordering]

CLINICAL RECOMMENDATIONS:
- [Recommendation] (Source: [Guideline citation])

ESCALATION STATUS:
[GREEN/YELLOW/RED]: [Reason if yellow/red]

PLAN:
- [Action items from recommendations]

FOLLOW-UP:
- Next video visit: [suggested timeframe]
- Labs to order: [if any due]
```

Copy-to-clipboard button on the generated summary.

## Testing Strategy

Unit tests with Vitest:

1. **Score calculations**: Known inputs → expected scores and categories for CDAI, DAS28-ESR, DAS28-CRP, RAPID3. Edge cases (boundary values, missing inputs).
2. **RA rules**: Clinical scenarios — DMARD-naive low DA, DMARD-naive high DA, MTX failure, bDMARD failure, special populations (HF, hep B, etc.).
3. **Gout rules**: ULT indications (tophi, flare frequency, CKD), titration logic, flare management, concurrent medication flags.
4. **Escalation flags**: Red/yellow threshold triggering for both RA and Gout.
5. **Export formatter**: Complete output with all sections populated, partial data handling.

## Future Extensibility (Architected, Not Built)

- **Phase 2 modules**: PsA, AxSpA, UIA, Fibromyalgia — condition selector shows them greyed out
- **SLE**: "Coming Soon" placeholder in selector
- **State serialization**: JSON-serializable state enables future persistence/comparison
- **Text externalization**: All user-facing strings in data files, not hardcoded in JSX
- **EPIC pre-population**: State shape structured for future external data source integration
