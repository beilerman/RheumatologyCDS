# RheumatologyCDS Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clinical decision support web app for rheumatology NP follow-up visits with RA and Gout modules, guideline-based recommendations, and exportable visit summaries.

**Architecture:** Client-side React app with Vite + Tailwind. Single `useReducer` state tree. Data-driven rule engine evaluates condition-specific rules against visit state. All clinical logic in pure functions, tested with Vitest.

**Tech Stack:** React 18 (JSX), Vite, Tailwind CSS, Vitest

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vitest.config.js`, `index.html` | Project scaffolding |
| `src/main.jsx` | React entry point |
| `src/index.css` | Tailwind directives + custom design tokens |
| `src/App.jsx` | Top-level layout, routes visit state to condition modules |
| `src/hooks/useVisitState.js` | `useReducer` state tree, dispatch actions, derived recommendations/escalation |
| `src/hooks/useScoring.js` | Score calculation hook wiring raw answers to score functions |
| `src/utils/scoreCalculations.js` | Pure score functions: CDAI, DAS28-ESR, DAS28-CRP, RAPID3 |
| `src/utils/recommendationEngine.js` | `getRecommendations(state)` — filters rules, hydrates citations |
| `src/utils/exportFormatter.js` | `formatVisitSummary(state)` — structured text for EPIC |
| `src/data/guidelines.js` | Citation reference library (9 guidelines) |
| `src/data/medications.js` | Medication database with monitoring arrays |
| `src/data/escalationCriteria.js` | Red/yellow flag definitions per condition |
| `src/components/layout/Header.jsx` | App title, condition badge, progress bar |
| `src/components/layout/Sidebar.jsx` | Section nav with completion indicators |
| `src/components/layout/ProgressBar.jsx` | Visual progress indicator |
| `src/components/shared/QuestionCard.jsx` | Card rendering question groups (dropdown, toggle, slider, radio, multi-select, numeric) |
| `src/components/shared/ScoreCalculator.jsx` | Dual-mode score entry (raw inputs or pre-calculated) |
| `src/components/shared/AlertBanner.jsx` | Red/yellow/green escalation banner |
| `src/components/shared/RecommendationCard.jsx` | Single recommendation with citation + rationale |
| `src/components/shared/MedMonitorChecklist.jsx` | Medication monitoring checklist |
| `src/components/shared/GuidelineCitation.jsx` | Inline citation with hover/expand |
| `src/components/shared/ExportSummary.jsx` | Copy-to-clipboard visit summary |
| `src/components/conditions/ConditionSelector.jsx` | Condition picker (RA/Gout active, others greyed) |
| `src/components/conditions/RheumatoidArthritis/RAQuestions.js` | RA question definitions |
| `src/components/conditions/RheumatoidArthritis/RAScoring.js` | RA score functions (re-exports from scoreCalculations) |
| `src/components/conditions/RheumatoidArthritis/RARules.js` | RA decision rules array |
| `src/components/conditions/RheumatoidArthritis/RAModule.jsx` | RA visit flow orchestrator |
| `src/components/conditions/Gout/GoutQuestions.js` | Gout question definitions |
| `src/components/conditions/Gout/GoutRules.js` | Gout decision rules array |
| `src/components/conditions/Gout/GoutModule.jsx` | Gout visit flow orchestrator |
| `src/components/export/VisitSummaryGenerator.jsx` | Summary generation UI with export |
| `tests/scoring.test.js` | Score calculation tests |
| `tests/raRules.test.js` | RA rule engine tests |
| `tests/goutRules.test.js` | Gout rule engine tests |
| `tests/escalation.test.js` | Escalation flag tests |
| `tests/exportFormatter.test.js` | Export formatter tests |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vitest.config.js`, `index.html`, `src/main.jsx`, `src/index.css`, `src/App.jsx`

- [ ] **Step 1: Initialize project with Vite**

```bash
cd /c/Users/medpe/rheum
npm create vite@latest . -- --template react
```

Select React, JavaScript when prompted. If the directory is not empty, confirm overwrite.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss @tailwindcss/vite vitest
```

- [ ] **Step 3: Configure Vite with Tailwind**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

- [ ] **Step 5: Set up Tailwind CSS entry**

Replace `src/index.css`:

```css
@import "tailwindcss";

:root {
  --color-primary: #1e3a5f;
  --color-bg: #f8f9fa;
  --color-green: #16a34a;
  --color-yellow: #eab308;
  --color-red: #dc2626;
  --color-info: #3b82f6;
}

body {
  background-color: var(--color-bg);
  min-width: 1024px;
}
```

- [ ] **Step 6: Set up index.html**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RheumatologyCDS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Set up React entry**

Replace `src/main.jsx`:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 8: Create placeholder App**

Replace `src/App.jsx`:

```jsx
export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <h1 className="text-2xl font-bold text-[var(--color-primary)] p-8">
        RheumatologyCDS
      </h1>
    </div>
  );
}
```

- [ ] **Step 9: Add scripts to package.json**

Add to `"scripts"` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 10: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts, page shows "RheumatologyCDS" heading.

- [ ] **Step 11: Verify test runner works**

Create `tests/smoke.test.js`:

```js
import { describe, it, expect } from 'vitest';

describe('smoke test', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

```bash
npm test
```

Expected: 1 test passes.

- [ ] **Step 12: Commit**

```bash
git init
echo "node_modules\ndist\n.DS_Store" > .gitignore
git add -A
git commit -m "chore: scaffold Vite + React + Tailwind + Vitest project"
```

---

### Task 2: Guideline Citations + Medication Data

**Files:**
- Create: `src/data/guidelines.js`, `src/data/medications.js`

- [ ] **Step 1: Create guidelines data**

Create `src/data/guidelines.js`:

```js
export const GUIDELINES = {
  ACR_RA_2021: {
    short: 'ACR 2021 RA Guideline',
    full: 'Fraenkel L, et al. 2021 American College of Rheumatology Guideline for the Treatment of Rheumatoid Arthritis. Arthritis Rheumatol. 2021;73(7):1108-1123.',
    url: 'https://doi.org/10.1002/art.41752',
  },
  ACR_GOUT_2020: {
    short: 'ACR 2020 Gout Guideline',
    full: 'FitzGerald JD, et al. 2020 American College of Rheumatology Guideline for the Management of Gout. Arthritis Care Res. 2020;72(6):744-760.',
    url: 'https://doi.org/10.1002/acr.24180',
  },
  ACR_PsA_2018: {
    short: 'ACR/NPF 2018 PsA Guideline',
    full: 'Singh JA, et al. 2018 American College of Rheumatology/National Psoriasis Foundation Guideline for the Treatment of Psoriatic Arthritis. Arthritis Rheumatol. 2019;71(1):5-32.',
    url: 'https://doi.org/10.1002/art.40726',
  },
  ACR_axSpA_2019: {
    short: 'ACR/SAA/SPARTAN 2019 axSpA Guideline',
    full: 'Ward MM, et al. 2019 Update of the American College of Rheumatology/Spondylitis Association of America/Spondyloarthritis Research and Treatment Network Recommendations for the Treatment of Ankylosing Spondylitis and Nonradiographic Axial Spondyloarthritis. Arthritis Rheumatol. 2019;71(10):1599-1613.',
    url: 'https://doi.org/10.1002/art.41042',
  },
  EULAR_FIBRO_2016: {
    short: 'EULAR 2016 Fibromyalgia Recommendations',
    full: 'Macfarlane GJ, et al. EULAR Revised Recommendations for the Management of Fibromyalgia. Ann Rheum Dis. 2017;76(2):318-328.',
    url: 'https://doi.org/10.1136/annrheumdis-2016-209724',
  },
  GRAPPA_2021: {
    short: 'GRAPPA 2021 PsA Recommendations',
    full: 'Coates LC, et al. Group for Research and Assessment of Psoriasis and Psoriatic Arthritis (GRAPPA): Updated Treatment Recommendations for Psoriatic Arthritis 2021. Nat Rev Rheumatol. 2022;18:465-479.',
    url: 'https://doi.org/10.1038/s41584-022-00798-0',
  },
  EULAR_EARLY_ARTHRITIS_2016: {
    short: 'EULAR 2016 Early Arthritis Recommendations',
    full: 'Combe B, et al. 2016 Update of the EULAR Recommendations for the Management of Early Inflammatory Arthritis. Ann Rheum Dis. 2017;76(6):948-959.',
    url: 'https://doi.org/10.1136/annrheumdis-2016-210602',
  },
  ACR_RA_MEASURES_2019: {
    short: 'ACR 2019 RA Disease Activity Measures',
    full: 'England BR, et al. 2019 Update of the American College of Rheumatology Recommended Rheumatoid Arthritis Disease Activity Measures. Arthritis Care Res. 2019;71(12):1540-1555.',
    url: 'https://doi.org/10.1002/acr.24042',
  },
  EULAR_RA_2022: {
    short: 'EULAR 2022 RA Recommendations',
    full: 'Smolen JS, et al. EULAR Recommendations for the Management of Rheumatoid Arthritis with Synthetic and Biological Disease-Modifying Antirheumatic Drugs: 2022 Update. Ann Rheum Dis. 2023;82(1):3-18.',
    url: 'https://doi.org/10.1136/ard-2022-223356',
  },
};
```

- [ ] **Step 2: Create medications data**

Create `src/data/medications.js`:

```js
export const MEDICATIONS = {
  ra: [
    {
      id: 'methotrexate',
      name: 'Methotrexate',
      class: 'csDMARD',
      monitoring: [
        { item: 'CBC with differential', frequency: 'Every 3 months initially, then every 3-6 months', notes: '' },
        { item: 'CMP (LFTs, renal function)', frequency: 'Every 3 months initially, then every 3-6 months', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'Folic acid 1mg daily prescribed', frequency: 'Verify at each visit', notes: 'Reduces GI and hematologic side effects' },
        { item: 'Pregnancy test', frequency: 'Before starting and as needed', notes: 'Teratogenic — contraindicated in pregnancy' },
      ],
    },
    {
      id: 'leflunomide',
      name: 'Leflunomide',
      class: 'csDMARD',
      monitoring: [
        { item: 'CBC', frequency: 'Baseline then periodically', notes: '' },
        { item: 'CMP (LFTs)', frequency: 'Monthly for first 6 months, then every 6-8 weeks', notes: '' },
        { item: 'Blood pressure', frequency: 'Each visit', notes: 'Can cause hypertension' },
        { item: 'Pregnancy status', frequency: 'Before starting', notes: 'Active metabolite persists — cholestyramine washout required before conception' },
      ],
    },
    {
      id: 'hydroxychloroquine',
      name: 'Hydroxychloroquine',
      class: 'csDMARD',
      monitoring: [
        { item: 'Baseline eye exam (retinal/OCT)', frequency: 'Within first year of use', notes: '' },
        { item: 'Annual eye exam', frequency: 'After 5 years of use (sooner with risk factors)', notes: 'Risk factors: renal impairment, tamoxifen use, macular disease' },
      ],
    },
    {
      id: 'sulfasalazine',
      name: 'Sulfasalazine',
      class: 'csDMARD',
      monitoring: [
        { item: 'CBC with differential', frequency: 'Every 2-4 weeks for first 3 months, then every 3 months', notes: '' },
        { item: 'CMP', frequency: 'Every 2-4 weeks for first 3 months, then every 3 months', notes: '' },
        { item: 'G6PD testing', frequency: 'Before starting in at-risk populations', notes: '' },
      ],
    },
    {
      id: 'adalimumab',
      name: 'Adalimumab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: 'Contraindicated in moderate-severe HF' },
      ],
    },
    {
      id: 'etanercept',
      name: 'Etanercept',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'infliximab',
      name: 'Infliximab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'certolizumab',
      name: 'Certolizumab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'golimumab',
      name: 'Golimumab',
      class: 'TNFi',
      monitoring: [
        { item: 'TB screening (PPD or IGRA)', frequency: 'Before starting and annually', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Baseline and periodically', notes: '' },
        { item: 'Monitor for infection signs', frequency: 'Each visit', notes: '' },
        { item: 'Heart failure screening', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'tocilizumab',
      name: 'Tocilizumab',
      class: 'IL-6i',
      monitoring: [
        { item: 'CBC (neutrophils, platelets)', frequency: 'Every 4-8 weeks initially', notes: '' },
        { item: 'LFTs', frequency: 'Every 4-8 weeks initially', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Monitor for GI perforation symptoms', frequency: 'Each visit', notes: 'Particularly in patients with diverticulitis history' },
      ],
    },
    {
      id: 'sarilumab',
      name: 'Sarilumab',
      class: 'IL-6i',
      monitoring: [
        { item: 'CBC (neutrophils, platelets)', frequency: 'Every 4-8 weeks initially', notes: '' },
        { item: 'LFTs', frequency: 'Every 4-8 weeks initially', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Monitor for GI perforation symptoms', frequency: 'Each visit', notes: '' },
      ],
    },
    {
      id: 'tofacitinib',
      name: 'Tofacitinib',
      class: 'JAKi',
      monitoring: [
        { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
        { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Renal function', frequency: 'Baseline then periodically', notes: '' },
        { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
        { item: 'VTE risk assessment', frequency: 'Before starting', notes: '' },
        { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors: increased risk of serious cardiac events, malignancy, thrombosis, death' },
      ],
    },
    {
      id: 'baricitinib',
      name: 'Baricitinib',
      class: 'JAKi',
      monitoring: [
        { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
        { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Renal function', frequency: 'Baseline then periodically', notes: '' },
        { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
        { item: 'VTE risk assessment', frequency: 'Before starting', notes: '' },
        { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors' },
      ],
    },
    {
      id: 'upadacitinib',
      name: 'Upadacitinib',
      class: 'JAKi',
      monitoring: [
        { item: 'CBC with differential and lymphocytes', frequency: 'Baseline, 4-8 weeks, then every 3 months', notes: '' },
        { item: 'LFTs', frequency: 'Baseline then periodically', notes: '' },
        { item: 'Lipid panel', frequency: 'Baseline and 4-8 weeks after starting', notes: '' },
        { item: 'Renal function', frequency: 'Baseline then periodically', notes: '' },
        { item: 'TB and viral hepatitis screening', frequency: 'Before starting', notes: '' },
        { item: 'VTE risk assessment', frequency: 'Before starting', notes: '' },
        { item: 'FDA boxed warning discussion', frequency: 'Before starting', notes: 'Age >65 or CV risk factors' },
      ],
    },
    {
      id: 'abatacept',
      name: 'Abatacept',
      class: 'T-cell co-stimulation modulator',
      monitoring: [
        { item: 'TB screening', frequency: 'Before starting', notes: '' },
        { item: 'Hepatitis B/C screening', frequency: 'Before starting', notes: '' },
        { item: 'CBC, CMP', frequency: 'Periodically (no strict schedule)', notes: 'No routine labs required per guidelines but reasonable to check' },
      ],
    },
    {
      id: 'rituximab',
      name: 'Rituximab',
      class: 'B-cell depleting',
      monitoring: [
        { item: 'CBC', frequency: 'Before each cycle', notes: '' },
        { item: 'Quantitative immunoglobulins', frequency: 'Baseline and before each cycle', notes: 'Hypogammaglobulinemia increases infection risk' },
        { item: 'Hepatitis B screening', frequency: 'Before starting', notes: 'Can reactivate HBV — fatal cases reported' },
        { item: 'Monitor for infusion reactions', frequency: 'During and after infusion', notes: '' },
      ],
    },
    {
      id: 'prednisone',
      name: 'Prednisone',
      class: 'Glucocorticoid',
      monitoring: [
        { item: 'Blood glucose', frequency: 'Each visit', notes: '' },
        { item: 'Blood pressure', frequency: 'Each visit', notes: '' },
        { item: 'Bone density (DEXA)', frequency: 'If >3 months use', notes: '' },
        { item: 'Ophthalmology referral', frequency: 'If prolonged use', notes: 'Cataracts and glaucoma risk' },
        { item: 'Weight monitoring', frequency: 'Each visit', notes: '' },
        { item: 'Document taper plan', frequency: 'Each visit', notes: 'Strongly recommend against long-term use' },
      ],
    },
  ],
  gout: [
    {
      id: 'allopurinol',
      name: 'Allopurinol',
      class: 'Xanthine oxidase inhibitor',
      monitoring: [
        { item: 'Serum urate', frequency: 'Every 2-5 weeks during titration, then every 6 months', notes: 'Target <6 mg/dL' },
        { item: 'Renal function', frequency: 'Annually', notes: '' },
        { item: 'HLA-B*5801 testing', frequency: 'Before starting', notes: 'Recommended in Southeast Asian and African American patients — allopurinol hypersensitivity risk' },
      ],
    },
    {
      id: 'febuxostat',
      name: 'Febuxostat',
      class: 'Xanthine oxidase inhibitor',
      monitoring: [
        { item: 'Serum urate', frequency: 'During titration then every 6 months', notes: 'Target <6 mg/dL' },
        { item: 'LFTs', frequency: 'Baseline and periodically', notes: '' },
        { item: 'CV risk discussion', frequency: 'Before starting and each visit', notes: 'FDA boxed warning: increased CV death risk in patients with established CV disease' },
      ],
    },
    {
      id: 'colchicine',
      name: 'Colchicine',
      class: 'Anti-inflammatory',
      monitoring: [
        { item: 'CBC', frequency: 'If prolonged use', notes: '' },
        { item: 'Renal function', frequency: 'Periodically', notes: 'Dose adjust for CKD' },
        { item: 'Hepatic function', frequency: 'Periodically', notes: '' },
        { item: 'Drug interaction check', frequency: 'Each visit', notes: 'Clarithromycin, cyclosporine, statins increase myopathy risk' },
      ],
    },
    {
      id: 'probenecid',
      name: 'Probenecid',
      class: 'Uricosuric',
      monitoring: [
        { item: 'Renal function', frequency: 'Periodically', notes: 'Requires adequate renal function; avoid if urolithiasis' },
        { item: 'Drug interaction check', frequency: 'Each visit', notes: 'Affects excretion of many drugs' },
      ],
    },
  ],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/data/guidelines.js src/data/medications.js
git commit -m "feat: add guideline citations and medication monitoring data"
```

---

### Task 3: Score Calculations (TDD)

**Files:**
- Create: `src/utils/scoreCalculations.js`, `tests/scoring.test.js`

- [ ] **Step 1: Write failing tests for all RA scores**

Create `tests/scoring.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
} from '../src/utils/scoreCalculations.js';

describe('calculateCDAI', () => {
  it('returns Remission for score <= 2.8', () => {
    const result = calculateCDAI({ sjc28: 0, tjc28: 0, patientGlobal: 1, providerGlobal: 1 });
    expect(result.score).toBe(2);
    expect(result.category).toBe('Remission');
    expect(result.error).toBeNull();
  });

  it('returns Low for score > 2.8 and <= 10', () => {
    const result = calculateCDAI({ sjc28: 2, tjc28: 3, patientGlobal: 2, providerGlobal: 2 });
    expect(result.score).toBe(9);
    expect(result.category).toBe('Low');
  });

  it('returns Moderate for score > 10 and <= 22', () => {
    const result = calculateCDAI({ sjc28: 5, tjc28: 5, patientGlobal: 4, providerGlobal: 4 });
    expect(result.score).toBe(18);
    expect(result.category).toBe('Moderate');
  });

  it('returns High for score > 22', () => {
    const result = calculateCDAI({ sjc28: 10, tjc28: 10, patientGlobal: 7, providerGlobal: 7 });
    expect(result.score).toBe(34);
    expect(result.category).toBe('High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateCDAI({ sjc28: 5, tjc28: null, patientGlobal: 3, providerGlobal: 3 });
    expect(result.score).toBeNull();
    expect(result.error).toBe('Missing required inputs');
  });

  it('handles boundary at 2.8 (Remission)', () => {
    const result = calculateCDAI({ sjc28: 0, tjc28: 0, patientGlobal: 1.4, providerGlobal: 1.4 });
    expect(result.score).toBe(2.8);
    expect(result.category).toBe('Remission');
  });

  it('handles boundary at 10 (Low)', () => {
    const result = calculateCDAI({ sjc28: 2, tjc28: 3, patientGlobal: 2.5, providerGlobal: 2.5 });
    expect(result.score).toBe(10);
    expect(result.category).toBe('Low');
  });
});

describe('calculateDAS28ESR', () => {
  it('calculates correctly for known inputs', () => {
    // TJC=4, SJC=2, ESR=28, PGA=50 (mm scale 0-100)
    // 0.56*sqrt(4) + 0.28*sqrt(2) + 0.70*ln(28) + 0.014*50
    // = 0.56*2 + 0.28*1.4142 + 0.70*3.3322 + 0.7
    // = 1.12 + 0.396 + 2.3325 + 0.7 = 4.5485
    const result = calculateDAS28ESR({ sjc28: 2, tjc28: 4, esr: 28, patientGlobal: 50 });
    expect(result.score).toBeCloseTo(4.55, 1);
    expect(result.category).toBe('Moderate');
  });

  it('returns Remission for score < 2.6', () => {
    const result = calculateDAS28ESR({ sjc28: 0, tjc28: 0, esr: 5, patientGlobal: 5 });
    expect(result.score).toBeLessThan(2.6);
    expect(result.category).toBe('Remission');
  });

  it('returns High for score > 5.1', () => {
    const result = calculateDAS28ESR({ sjc28: 15, tjc28: 15, esr: 60, patientGlobal: 80 });
    expect(result.category).toBe('High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateDAS28ESR({ sjc28: 2, tjc28: 4, esr: null, patientGlobal: 50 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateDAS28CRP', () => {
  it('calculates correctly for known inputs', () => {
    // TJC=4, SJC=2, CRP=1.5 mg/dL, PGA=50
    // 0.56*sqrt(4) + 0.28*sqrt(2) + 0.36*ln(1.5+1) + 0.014*50 + 0.96
    // = 1.12 + 0.396 + 0.36*0.9163 + 0.7 + 0.96
    // = 1.12 + 0.396 + 0.3299 + 0.7 + 0.96 = 3.506
    const result = calculateDAS28CRP({ sjc28: 2, tjc28: 4, crp: 1.5, patientGlobal: 50 });
    expect(result.score).toBeCloseTo(3.51, 1);
    expect(result.category).toBe('Moderate');
  });

  it('returns error for missing inputs', () => {
    const result = calculateDAS28CRP({ sjc28: 2, tjc28: 4, crp: undefined, patientGlobal: 50 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateRAPID3', () => {
  it('returns Near-remission for score <= 3', () => {
    const result = calculateRAPID3({ function0to10: 1, pain0to10: 1, globalVAS0to10: 1 });
    expect(result.score).toBe(3);
    expect(result.category).toBe('Near-remission');
  });

  it('returns Low for score > 3 and <= 6', () => {
    const result = calculateRAPID3({ function0to10: 2, pain0to10: 2, globalVAS0to10: 2 });
    expect(result.score).toBe(6);
    expect(result.category).toBe('Low');
  });

  it('returns Moderate for score > 6 and <= 12', () => {
    const result = calculateRAPID3({ function0to10: 4, pain0to10: 4, globalVAS0to10: 4 });
    expect(result.score).toBe(12);
    expect(result.category).toBe('Moderate');
  });

  it('returns High for score > 12', () => {
    const result = calculateRAPID3({ function0to10: 8, pain0to10: 7, globalVAS0to10: 6 });
    expect(result.score).toBe(21);
    expect(result.category).toBe('High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateRAPID3({ function0to10: 3, pain0to10: null, globalVAS0to10: 2 });
    expect(result.error).toBe('Missing required inputs');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: All scoring tests FAIL (module not found).

- [ ] **Step 3: Implement score calculations**

Create `src/utils/scoreCalculations.js`:

```js
function categorize(score, thresholds) {
  for (const [max, label] of thresholds) {
    if (score <= max) return label;
  }
  return thresholds[thresholds.length - 1][1];
}

function hasMissing(values) {
  return values.some((v) => v === null || v === undefined);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

const MISSING = { score: null, category: null, error: 'Missing required inputs' };

export function calculateCDAI({ sjc28, tjc28, patientGlobal, providerGlobal }) {
  if (hasMissing([sjc28, tjc28, patientGlobal, providerGlobal])) return MISSING;
  const score = round1(sjc28 + tjc28 + patientGlobal + providerGlobal);
  const category = categorize(score, [
    [2.8, 'Remission'],
    [10, 'Low'],
    [22, 'Moderate'],
    [Infinity, 'High'],
  ]);
  return { score, category, error: null };
}

export function calculateDAS28ESR({ sjc28, tjc28, esr, patientGlobal }) {
  if (hasMissing([sjc28, tjc28, esr, patientGlobal])) return MISSING;
  const score = round1(
    0.56 * Math.sqrt(tjc28) +
    0.28 * Math.sqrt(sjc28) +
    0.70 * Math.log(esr) +
    0.014 * patientGlobal
  );
  const category = categorize(score, [
    [2.5, 'Remission'],  // < 2.6 means <= 2.5 at 1 decimal
    [3.2, 'Low'],
    [5.1, 'Moderate'],
    [Infinity, 'High'],
  ]);
  // Refine: Remission is strictly < 2.6
  const finalCategory = score < 2.6 ? 'Remission'
    : score <= 3.2 ? 'Low'
    : score <= 5.1 ? 'Moderate'
    : 'High';
  return { score, category: finalCategory, error: null };
}

export function calculateDAS28CRP({ sjc28, tjc28, crp, patientGlobal }) {
  if (hasMissing([sjc28, tjc28, crp, patientGlobal])) return MISSING;
  const score = round1(
    0.56 * Math.sqrt(tjc28) +
    0.28 * Math.sqrt(sjc28) +
    0.36 * Math.log(crp + 1) +
    0.014 * patientGlobal +
    0.96
  );
  const finalCategory = score < 2.6 ? 'Remission'
    : score <= 3.2 ? 'Low'
    : score <= 5.1 ? 'Moderate'
    : 'High';
  return { score, category: finalCategory, error: null };
}

export function calculateRAPID3({ function0to10, pain0to10, globalVAS0to10 }) {
  if (hasMissing([function0to10, pain0to10, globalVAS0to10])) return MISSING;
  const score = round1(function0to10 + pain0to10 + globalVAS0to10);
  const category = categorize(score, [
    [3, 'Near-remission'],
    [6, 'Low'],
    [12, 'Moderate'],
    [Infinity, 'High'],
  ]);
  return { score, category, error: null };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All scoring tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/scoreCalculations.js tests/scoring.test.js
git commit -m "feat: add RA disease activity score calculations with tests

CDAI, DAS28-ESR, DAS28-CRP, RAPID3 — all pure functions with
input validation and boundary-tested thresholds."
```

---

### Task 4: Recommendation Engine + RA Rules (TDD)

**Files:**
- Create: `src/utils/recommendationEngine.js`, `src/components/conditions/RheumatoidArthritis/RARules.js`, `tests/raRules.test.js`

- [ ] **Step 1: Write failing tests for RA clinical scenarios**

Create `tests/raRules.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { raRules } from '../src/components/conditions/RheumatoidArthritis/RARules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return {
    condition: 'ra',
    answers: {},
    scores: {},
    medications: { current: [], doses: {} },
    ...overrides,
  };
}

describe('RA Rules: DMARD-naive', () => {
  it('recommends HCQ for low disease activity, DMARD-naive', () => {
    const state = makeState({
      scores: { cdai: { score: 8, category: 'Low' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const hcq = recs.find((r) => r.id === 'ra-naive-low-hcq');
    expect(hcq).toBeDefined();
    expect(hcq.strength).toBe('conditional');
  });

  it('recommends MTX for moderate disease activity, DMARD-naive', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const mtx = recs.find((r) => r.id === 'ra-naive-mod-high-mtx');
    expect(mtx).toBeDefined();
    expect(mtx.strength).toBe('strong');
  });

  it('recommends MTX for high disease activity, DMARD-naive', () => {
    const state = makeState({
      scores: { cdai: { score: 30, category: 'High' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const mtx = recs.find((r) => r.id === 'ra-naive-mod-high-mtx');
    expect(mtx).toBeDefined();
  });
});

describe('RA Rules: csDMARD failure', () => {
  it('recommends bDMARD/tsDMARD after csDMARD failure', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: { 'ra-dmard-history': 'failed-csDMARD' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const bio = recs.find((r) => r.id === 'ra-csdmard-fail-biologic');
    expect(bio).toBeDefined();
    expect(bio.strength).toBe('conditional');
  });
});

describe('RA Rules: bDMARD failure', () => {
  it('recommends switching mechanism after TNFi failure', () => {
    const state = makeState({
      scores: { cdai: { score: 25, category: 'High' } },
      answers: {
        'ra-dmard-history': 'failed-bDMARD',
        'ra-current-biologic-mechanism': 'TNFi',
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const switchRec = recs.find((r) => r.id === 'ra-tnfi-fail-switch');
    expect(switchRec).toBeDefined();
  });
});

describe('RA Rules: Glucocorticoids', () => {
  it('flags long-term prednisone use', () => {
    const state = makeState({
      answers: { 'ra-prednisone-duration': '>3 months' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const gc = recs.find((r) => r.id === 'ra-gc-long-term-flag');
    expect(gc).toBeDefined();
    expect(gc.strength).toBe('strong');
  });
});

describe('RA Rules: Special populations', () => {
  it('warns against TNFi in heart failure', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-heart-failure': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const hfWarn = recs.find((r) => r.id === 'ra-special-hf-avoid-tnfi');
    expect(hfWarn).toBeDefined();
  });

  it('notes rituximab preference for lymphoproliferative history', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-lymphoproliferative-history': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const lymph = recs.find((r) => r.id === 'ra-special-lymph-rituximab');
    expect(lymph).toBeDefined();
  });

  it('flags hepatitis B screening before bDMARD', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-hepatitis-b': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const hep = recs.find((r) => r.id === 'ra-special-hepb-screen');
    expect(hep).toBeDefined();
  });
});

describe('getRecommendations', () => {
  it('returns empty array when no condition matches', () => {
    const state = makeState({ answers: {} });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    expect(Array.isArray(recs)).toBe(true);
  });

  it('hydrates guideline references', () => {
    const state = makeState({
      scores: { cdai: { score: 8, category: 'Low' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const hcq = recs.find((r) => r.id === 'ra-naive-low-hcq');
    expect(hcq.guidelineRef.short).toBe('ACR 2021 RA Guideline');
  });

  it('sorts strong recommendations before conditional', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'naive',
        'ra-prednisone-duration': '>3 months',
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const strongIdx = recs.findIndex((r) => r.strength === 'strong');
    const condIdx = recs.findIndex((r) => r.strength === 'conditional');
    if (strongIdx !== -1 && condIdx !== -1) {
      expect(strongIdx).toBeLessThan(condIdx);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/raRules.test.js
```

Expected: FAIL (modules not found).

- [ ] **Step 3: Implement recommendation engine**

Create `src/utils/recommendationEngine.js`:

```js
export function getRecommendations(state, rules, guidelines) {
  return rules
    .filter((rule) => {
      try {
        return rule.condition(state);
      } catch {
        return false;
      }
    })
    .map((rule) => {
      const specialFlags = (rule.specialPopulations || [])
        .filter((sp) => {
          try {
            return sp.condition(state);
          } catch {
            return false;
          }
        })
        .map((sp) => sp.note);

      return {
        id: rule.id,
        recommendation: rule.recommendation,
        strength: rule.strength,
        guideline: rule.guideline,
        guidelineRef: guidelines[rule.guideline] || null,
        rationale: rule.rationale,
        specialFlags,
      };
    })
    .sort((a, b) => {
      const order = { strong: 0, conditional: 1 };
      return (order[a.strength] ?? 2) - (order[b.strength] ?? 2);
    });
}
```

- [ ] **Step 4: Implement RA rules**

Create `src/components/conditions/RheumatoidArthritis/RARules.js`:

```js
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
  // === DMARD-naive ===
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

  // === csDMARD failure ===
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

  // === bDMARD failure ===
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

  // === Glucocorticoids ===
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

  // === Special populations ===
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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- tests/raRules.test.js
```

Expected: All RA rule tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/utils/recommendationEngine.js src/components/conditions/RheumatoidArthritis/RARules.js tests/raRules.test.js
git commit -m "feat: add recommendation engine and RA clinical decision rules

Covers ACR 2021 algorithm: DMARD-naive, csDMARD failure, bDMARD
failure, TNFi failure, glucocorticoid flagging, and special
population warnings (HF, hep B/C, lymphoproliferative, NTB lung)."
```

---

### Task 5: Gout Rules (TDD)

**Files:**
- Create: `src/components/conditions/Gout/GoutRules.js`, `tests/goutRules.test.js`

- [ ] **Step 1: Write failing tests for Gout clinical scenarios**

Create `tests/goutRules.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { goutRules } from '../src/components/conditions/Gout/GoutRules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return {
    condition: 'gout',
    answers: {},
    scores: {},
    medications: { current: [], doses: {} },
    ...overrides,
  };
}

describe('Gout Rules: ULT indications', () => {
  it('strongly recommends ULT for tophi', () => {
    const state = makeState({
      answers: { 'gout-tophi': true, 'gout-on-ult': false },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const ult = recs.find((r) => r.id === 'gout-ult-indicated-strong');
    expect(ult).toBeDefined();
    expect(ult.strength).toBe('strong');
  });

  it('strongly recommends ULT for frequent flares (>=2/year)', () => {
    const state = makeState({
      answers: { 'gout-flare-frequency': 3, 'gout-on-ult': false },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const ult = recs.find((r) => r.id === 'gout-ult-indicated-strong');
    expect(ult).toBeDefined();
  });

  it('conditionally recommends ULT for first flare + CKD >=3', () => {
    const state = makeState({
      answers: {
        'gout-flare-frequency': 1,
        'gout-on-ult': false,
        'gout-ckd-stage': '3a',
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const ult = recs.find((r) => r.id === 'gout-ult-indicated-conditional-risk');
    expect(ult).toBeDefined();
    expect(ult.strength).toBe('conditional');
  });

  it('conditionally recommends ULT for first flare + SU > 9', () => {
    const state = makeState({
      answers: {
        'gout-flare-frequency': 1,
        'gout-on-ult': false,
        'gout-serum-urate': 9.5,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const ult = recs.find((r) => r.id === 'gout-ult-indicated-conditional-risk');
    expect(ult).toBeDefined();
  });
});

describe('Gout Rules: ULT management', () => {
  it('recommends allopurinol as first-line', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': false,
        'gout-tophi': true,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const allo = recs.find((r) => r.id === 'gout-ult-allopurinol-first');
    expect(allo).toBeDefined();
    expect(allo.strength).toBe('strong');
  });

  it('flags not at target when SU >= 6 on ULT', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.2,
        'gout-ult-medication': 'allopurinol',
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const titrate = recs.find((r) => r.id === 'gout-ult-titrate-up');
    expect(titrate).toBeDefined();
  });

  it('confirms at target when SU < 6 on ULT', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 4.8,
        'gout-ult-medication': 'allopurinol',
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const atTarget = recs.find((r) => r.id === 'gout-ult-at-target');
    expect(atTarget).toBeDefined();
  });
});

describe('Gout Rules: Acute flare', () => {
  it('provides acute flare management when current flare', () => {
    const state = makeState({
      answers: { 'gout-current-flare': true },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const flare = recs.find((r) => r.id === 'gout-acute-flare');
    expect(flare).toBeDefined();
  });
});

describe('Gout Rules: Flare prophylaxis', () => {
  it('recommends prophylaxis during ULT titration', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.2,
        'gout-ult-medication': 'allopurinol',
        'gout-flare-prophylaxis': false,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const prophy = recs.find((r) => r.id === 'gout-prophylaxis-needed');
    expect(prophy).toBeDefined();
  });
});

describe('Gout Rules: Lifestyle', () => {
  it('flags heavy alcohol use', () => {
    const state = makeState({
      answers: { 'gout-alcohol': 'heavy' },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const alcohol = recs.find((r) => r.id === 'gout-lifestyle-alcohol');
    expect(alcohol).toBeDefined();
  });
});

describe('Gout Rules: Concurrent medications', () => {
  it('recommends losartan for hypertension', () => {
    const state = makeState({
      answers: { 'gout-hypertension': true },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const losartan = recs.find((r) => r.id === 'gout-concurrent-losartan');
    expect(losartan).toBeDefined();
  });
});

describe('Gout Rules: Febuxostat CV warning', () => {
  it('flags CV risk with febuxostat + CVD', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': true,
        'gout-ult-medication': 'febuxostat',
        'gout-cvd': true,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const cv = recs.find((r) => r.id === 'gout-febuxostat-cv-warning');
    expect(cv).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/goutRules.test.js
```

Expected: FAIL (GoutRules module not found).

- [ ] **Step 3: Implement Gout rules**

Create `src/components/conditions/Gout/GoutRules.js`:

```js
const CKD_STAGE_3_PLUS = ['3a', '3b', '4', '5'];

function ultIndicated(state) {
  const a = state.answers;
  return (
    a['gout-tophi'] === true ||
    (a['gout-flare-frequency'] != null && a['gout-flare-frequency'] >= 2)
  );
}

function ultConditionalRisk(state) {
  const a = state.answers;
  const freq = a['gout-flare-frequency'];
  if (freq == null || freq < 1) return false;
  return (
    CKD_STAGE_3_PLUS.includes(a['gout-ckd-stage']) ||
    (a['gout-serum-urate'] != null && a['gout-serum-urate'] > 9) ||
    a['gout-nephrolithiasis'] === true
  );
}

export const goutRules = [
  // === ULT indications ===
  {
    id: 'gout-ult-indicated-strong',
    condition: (state) =>
      !state.answers['gout-on-ult'] && ultIndicated(state),
    recommendation:
      'Urate-lowering therapy (ULT) is strongly recommended (tophi, radiographic damage, or >=2 flares/year).',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'ACR 2020 strongly recommends ULT for patients with tophi, radiographic damage attributable to gout, or frequent flares (>=2/year).',
  },
  {
    id: 'gout-ult-indicated-conditional-risk',
    condition: (state) =>
      !state.answers['gout-on-ult'] &&
      !ultIndicated(state) &&
      ultConditionalRisk(state),
    recommendation:
      'ULT is conditionally recommended (first flare with CKD >=3, serum urate >9, or urolithiasis).',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'ACR 2020 conditionally recommends ULT for first flare with risk factors: CKD stage >=3, serum urate >9 mg/dL, or urolithiasis.',
  },

  // === ULT first-line ===
  {
    id: 'gout-ult-allopurinol-first',
    condition: (state) =>
      !state.answers['gout-on-ult'] &&
      (ultIndicated(state) || ultConditionalRisk(state)),
    recommendation:
      'Allopurinol is strongly recommended as first-line ULT. Start <=100 mg/day (<=50 mg/day if eGFR <30). Titrate by 100 mg every 2-5 weeks to target SU <6 mg/dL. Max 800 mg/day.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Allopurinol is strongly recommended over all other ULT agents as first-line, including in patients with CKD stage >=3.',
    specialPopulations: [
      {
        condition: (s) =>
          s.answers['gout-ckd-stage'] &&
          ['3b', '4', '5'].includes(s.answers['gout-ckd-stage']),
        note: 'CKD: Start at 50 mg/day. Titrate by 50 mg increments.',
      },
    ],
  },

  // === ULT titration ===
  {
    id: 'gout-ult-titrate-up',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] >= 6,
    recommendation:
      'Serum urate is not at target (<6 mg/dL). Titrate ULT dose upward per treat-to-target strategy.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Treat-to-target is strongly recommended. Titrate ULT to achieve and maintain serum urate <6 mg/dL.',
  },
  {
    id: 'gout-ult-at-target',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] < 6,
    recommendation:
      'Serum urate is at target (<6 mg/dL). Continue current ULT dose. Recheck in 6 months.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Maintaining serum urate <6 mg/dL prevents flares and resolves tophi over time.',
  },

  // === Acute flare ===
  {
    id: 'gout-acute-flare',
    condition: (state) => state.answers['gout-current-flare'] === true,
    recommendation:
      'Acute flare: First-line options include colchicine (1.2 mg then 0.6 mg in 1 hour, within 36h of onset), NSAIDs (full dose), or glucocorticoids (oral or intra-articular). Combination therapy for severe flares. Do NOT stop current ULT during a flare.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'ACR 2020 strongly recommends against stopping ULT during a flare. Early treatment with colchicine, NSAIDs, or glucocorticoids is recommended.',
  },

  // === Flare prophylaxis ===
  {
    id: 'gout-prophylaxis-needed',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] >= 6 &&
      state.answers['gout-flare-prophylaxis'] === false,
    recommendation:
      'Flare prophylaxis is strongly recommended during ULT initiation/titration. Options: colchicine 0.6 mg daily or BID, low-dose NSAID, or low-dose glucocorticoid. Continue for >=3-6 months.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'ACR 2020 strongly recommends prophylaxis during ULT initiation and titration, for a minimum of 3-6 months and continued if flares persist.',
  },

  // === Febuxostat CV warning ===
  {
    id: 'gout-febuxostat-cv-warning',
    condition: (state) =>
      state.answers['gout-ult-medication'] === 'febuxostat' &&
      state.answers['gout-cvd'] === true,
    recommendation:
      'Febuxostat FDA boxed warning: Increased risk of cardiovascular death in patients with established CVD. Discuss risks with patient. Consider switching to allopurinol if possible.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'CARES trial showed increased CV mortality with febuxostat vs allopurinol. FDA boxed warning applies.',
  },

  // === Concurrent medications ===
  {
    id: 'gout-concurrent-losartan',
    condition: (state) => state.answers['gout-hypertension'] === true,
    recommendation:
      'Losartan is conditionally recommended as preferred antihypertensive (mild uricosuric effect).',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Losartan has a mild uricosuric effect that may benefit gout patients with hypertension.',
  },

  // === Lifestyle ===
  {
    id: 'gout-lifestyle-alcohol',
    condition: (state) =>
      ['moderate', 'heavy'].includes(state.answers['gout-alcohol']),
    recommendation:
      'Limit alcohol intake, especially beer and spirits. Alcohol increases urate production and impairs excretion.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'ACR 2020 conditionally recommends limiting alcohol, particularly beer and spirits, for gout management.',
  },
  {
    id: 'gout-lifestyle-diet',
    condition: (state) =>
      state.answers['gout-purine-diet'] === 'non-adherent',
    recommendation:
      'Limit high-purine organ meats and high-fructose corn syrup beverages.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Dietary modification alone is insufficient to reach target urate but is part of comprehensive gout management.',
  },
  {
    id: 'gout-lifestyle-weight',
    condition: (state) =>
      state.answers['gout-weight-change'] === 'gain',
    recommendation:
      'Weight loss is recommended for overweight/obese patients with gout.',
    strength: 'conditional',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Weight loss can reduce serum urate levels and decrease gout flare frequency.',
  },

  // === ULT adherence ===
  {
    id: 'gout-ult-adherence-poor',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      ['partial', 'poor'].includes(state.answers['gout-ult-adherence']),
    recommendation:
      'ULT adherence is suboptimal. Provide education on importance of continuous ULT for flare prevention and tophus resolution. Address barriers to adherence.',
    strength: 'strong',
    guideline: 'ACR_GOUT_2020',
    rationale:
      'Discontinuous ULT use is associated with rebound flares and failure to achieve target urate.',
  },
];
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/goutRules.test.js
```

Expected: All Gout rule tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/conditions/Gout/GoutRules.js tests/goutRules.test.js
git commit -m "feat: add Gout clinical decision rules with tests

Covers ACR 2020: ULT indications (strong + conditional), allopurinol
first-line, treat-to-target, acute flare management, prophylaxis,
febuxostat CV warning, concurrent meds, and lifestyle guidance."
```

---

### Task 6: Escalation Criteria (TDD)

**Files:**
- Create: `src/data/escalationCriteria.js`, `tests/escalation.test.js`

- [ ] **Step 1: Write failing tests for escalation flags**

Create `tests/escalation.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { evaluateEscalation } from '../src/data/escalationCriteria.js';

function makeState(condition, overrides = {}) {
  return {
    condition,
    answers: {},
    scores: {},
    medications: { current: [], doses: {} },
    ...overrides,
  };
}

describe('RA Escalation: Red flags', () => {
  it('flags new extra-articular manifestation', () => {
    const state = makeState('ra', {
      answers: { 'ra-extraarticular': ['ILD'] },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('red');
    expect(result.flags.some((f) => f.id === 'ra-red-extraarticular')).toBe(true);
  });

  it('flags high DA despite biologic', () => {
    const state = makeState('ra', {
      scores: { cdai: { score: 25, category: 'High' } },
      answers: { 'ra-dmard-history': 'failed-bDMARD' },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('red');
  });
});

describe('RA Escalation: Yellow flags', () => {
  it('flags moderate DA on current regimen >=3 months', () => {
    const state = makeState('ra', {
      scores: { cdai: { score: 15, category: 'Moderate' } },
      answers: { 'ra-dmard-history': 'on-csDMARD' },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('yellow');
  });

  it('flags persistent glucocorticoid use', () => {
    const state = makeState('ra', {
      answers: { 'ra-prednisone-duration': '>3 months' },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('yellow');
  });
});

describe('RA Escalation: Green (no flags)', () => {
  it('returns green when no flags triggered', () => {
    const state = makeState('ra', {
      scores: { cdai: { score: 5, category: 'Low' } },
      answers: { 'ra-dmard-history': 'on-csDMARD' },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('green');
  });
});

describe('Gout Escalation: Red flags', () => {
  it('flags suspected allopurinol hypersensitivity', () => {
    const state = makeState('gout', {
      answers: { 'gout-allopurinol-hypersensitivity': true },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('red');
  });
});

describe('Gout Escalation: Yellow flags', () => {
  it('flags not at target despite adequate dose', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'allopurinol',
        'gout-ult-dose': '300',
      },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('yellow');
  });

  it('flags poor ULT adherence', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-ult-adherence': 'poor',
      },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('yellow');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/escalation.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement escalation criteria**

Create `src/data/escalationCriteria.js`:

```js
const raEscalation = [
  // RED FLAGS
  {
    id: 'ra-red-extraarticular',
    level: 'red',
    condition: (state) => {
      const ea = state.answers['ra-extraarticular'];
      return Array.isArray(ea) && ea.length > 0;
    },
    message:
      'New extra-articular manifestation (ILD, vasculitis, scleritis). Immediate rheumatologist contact recommended.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-red-high-da-on-biologic',
    level: 'red',
    condition: (state) => {
      const da =
        state.scores?.cdai?.category ||
        state.scores?.das28esr?.category ||
        state.scores?.das28crp?.category;
      return (
        da === 'High' &&
        ['on-bDMARD', 'failed-bDMARD'].includes(
          state.answers['ra-dmard-history']
        )
      );
    },
    message:
      'High disease activity despite bDMARD/tsDMARD therapy. Urgent rheumatologist contact recommended.',
    guideline: 'ACR_RA_2021',
  },

  // YELLOW FLAGS
  {
    id: 'ra-yellow-moderate-on-treatment',
    level: 'yellow',
    condition: (state) => {
      const da =
        state.scores?.cdai?.category ||
        state.scores?.das28esr?.category ||
        state.scores?.das28crp?.category;
      return (
        da === 'Moderate' &&
        ['on-csDMARD', 'on-bDMARD'].includes(
          state.answers['ra-dmard-history']
        )
      );
    },
    message:
      'Moderate disease activity not at target on current regimen. Schedule rheumatology follow-up within 2-4 weeks.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-yellow-gc-dependence',
    level: 'yellow',
    condition: (state) =>
      state.answers['ra-prednisone-duration'] === '>3 months',
    message:
      'Persistent glucocorticoid use (>3 months). Schedule rheumatology follow-up to discuss taper strategy.',
    guideline: 'ACR_RA_2021',
  },
  {
    id: 'ra-yellow-biologic-discussion',
    level: 'yellow',
    condition: (state) =>
      state.answers['ra-dmard-history'] === 'failed-csDMARD',
    message:
      'csDMARD failure — biologic initiation discussion needed. Schedule rheumatology follow-up.',
    guideline: 'ACR_RA_2021',
  },
];

const goutEscalation = [
  // RED FLAGS
  {
    id: 'gout-red-hypersensitivity',
    level: 'red',
    condition: (state) =>
      state.answers['gout-allopurinol-hypersensitivity'] === true,
    message:
      'Suspected allopurinol hypersensitivity syndrome. Immediate rheumatologist contact. Discontinue allopurinol.',
    guideline: 'ACR_GOUT_2020',
  },
  {
    id: 'gout-red-septic-joint',
    level: 'red',
    condition: (state) =>
      state.answers['gout-suspected-septic-joint'] === true,
    message:
      'Suspected septic joint — must differentiate from gout flare. Urgent evaluation required.',
    guideline: 'ACR_GOUT_2020',
  },

  // YELLOW FLAGS
  {
    id: 'gout-yellow-not-at-target',
    level: 'yellow',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      state.answers['gout-serum-urate'] != null &&
      state.answers['gout-serum-urate'] >= 6 &&
      state.answers['gout-ult-dose'] &&
      parseInt(state.answers['gout-ult-dose'], 10) >= 300,
    message:
      'Not at serum urate target despite allopurinol >=300 mg/day. Schedule rheumatology follow-up to discuss dose optimization or alternative ULT.',
    guideline: 'ACR_GOUT_2020',
  },
  {
    id: 'gout-yellow-adherence',
    level: 'yellow',
    condition: (state) =>
      state.answers['gout-on-ult'] === true &&
      ['partial', 'poor'].includes(state.answers['gout-ult-adherence']),
    message:
      'ULT non-adherence identified. May require motivational counseling or rheumatology follow-up.',
    guideline: 'ACR_GOUT_2020',
  },
  {
    id: 'gout-yellow-ckd-progression',
    level: 'yellow',
    condition: (state) =>
      ['4', '5'].includes(state.answers['gout-ckd-stage']),
    message:
      'Advanced CKD (stage 4-5). Rheumatology follow-up for ULT dose adjustment.',
    guideline: 'ACR_GOUT_2020',
  },
];

const escalationByCondition = {
  ra: raEscalation,
  gout: goutEscalation,
};

export function evaluateEscalation(state) {
  const criteria = escalationByCondition[state.condition] || [];
  const flags = criteria.filter((c) => {
    try {
      return c.condition(state);
    } catch {
      return false;
    }
  });

  let level = 'green';
  if (flags.some((f) => f.level === 'red')) level = 'red';
  else if (flags.some((f) => f.level === 'yellow')) level = 'yellow';

  return { level, flags };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/escalation.test.js
```

Expected: All escalation tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/escalationCriteria.js tests/escalation.test.js
git commit -m "feat: add escalation criteria engine for RA and Gout

Red flags: extra-articular manifestations, high DA on biologic,
allopurinol hypersensitivity, septic joint.
Yellow flags: moderate DA on treatment, GC dependence, ULT not at
target, poor adherence, CKD progression."
```

---

### Task 7: Export Formatter (TDD)

**Files:**
- Create: `src/utils/exportFormatter.js`, `tests/exportFormatter.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/exportFormatter.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { formatVisitSummary } from '../src/utils/exportFormatter.js';

describe('formatVisitSummary', () => {
  it('generates complete summary for RA visit', () => {
    const state = {
      condition: 'ra',
      scores: { cdai: { score: 14.2, category: 'Moderate' } },
      answers: {
        'ra-sjc28': 4,
        'ra-tjc28': 6,
        'ra-morning-stiffness': 45,
        'ra-functional-status': 'stable',
      },
      medications: {
        current: ['methotrexate', 'adalimumab'],
        doses: { methotrexate: '15mg weekly', adalimumab: '40mg biweekly' },
      },
      recommendations: [
        {
          recommendation: 'Continue current therapy',
          guidelineRef: { short: 'ACR 2021 RA Guideline' },
        },
      ],
      escalation: { level: 'yellow', flags: [{ message: 'Moderate DA on treatment' }] },
      monitoringStatus: [
        { item: 'CBC with differential', status: 'Due' },
      ],
    };

    const summary = formatVisitSummary(state);

    expect(summary).toContain('RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY');
    expect(summary).toContain('Condition: Rheumatoid Arthritis');
    expect(summary).toContain('CDAI: 14.2 (Moderate)');
    expect(summary).toContain('Methotrexate: 15mg weekly');
    expect(summary).toContain('Adalimumab: 40mg biweekly');
    expect(summary).toContain('Continue current therapy');
    expect(summary).toContain('ACR 2021 RA Guideline');
    expect(summary).toContain('YELLOW');
    expect(summary).toContain('CBC with differential: Due');
  });

  it('generates summary for Gout visit', () => {
    const state = {
      condition: 'gout',
      scores: {},
      answers: {
        'gout-serum-urate': 4.8,
        'gout-current-flare': false,
        'gout-tophi': false,
      },
      medications: {
        current: ['allopurinol'],
        doses: { allopurinol: '300mg daily' },
      },
      recommendations: [
        {
          recommendation: 'At target. Continue current dose.',
          guidelineRef: { short: 'ACR 2020 Gout Guideline' },
        },
      ],
      escalation: { level: 'green', flags: [] },
      monitoringStatus: [],
    };

    const summary = formatVisitSummary(state);

    expect(summary).toContain('Condition: Gout');
    expect(summary).toContain('Serum Urate: 4.8 mg/dL');
    expect(summary).toContain('GREEN');
  });

  it('handles missing optional fields gracefully', () => {
    const state = {
      condition: 'ra',
      scores: {},
      answers: {},
      medications: { current: [], doses: {} },
      recommendations: [],
      escalation: { level: 'green', flags: [] },
      monitoringStatus: [],
    };

    const summary = formatVisitSummary(state);
    expect(summary).toContain('RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY');
    expect(summary).toContain('No medications recorded');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/exportFormatter.test.js
```

Expected: FAIL.

- [ ] **Step 3: Implement export formatter**

Create `src/utils/exportFormatter.js`:

```js
const CONDITION_NAMES = {
  ra: 'Rheumatoid Arthritis',
  gout: 'Gout',
  psa: 'Psoriatic Arthritis',
  axspa: 'Axial Spondyloarthritis',
  uia: 'Undifferentiated Inflammatory Arthritis',
  fibro: 'Fibromyalgia',
};

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatScores(state) {
  const lines = [];
  const { scores, answers, condition } = state;

  if (condition === 'ra') {
    if (scores.cdai?.score != null)
      lines.push(`CDAI: ${scores.cdai.score} (${scores.cdai.category})`);
    if (scores.das28esr?.score != null)
      lines.push(`DAS28-ESR: ${scores.das28esr.score} (${scores.das28esr.category})`);
    if (scores.das28crp?.score != null)
      lines.push(`DAS28-CRP: ${scores.das28crp.score} (${scores.das28crp.category})`);
    if (scores.rapid3?.score != null)
      lines.push(`RAPID3: ${scores.rapid3.score} (${scores.rapid3.category})`);

    const symptoms = [];
    if (answers['ra-sjc28'] != null) symptoms.push(`SJC28: ${answers['ra-sjc28']}`);
    if (answers['ra-tjc28'] != null) symptoms.push(`TJC28: ${answers['ra-tjc28']}`);
    if (answers['ra-morning-stiffness'] != null)
      symptoms.push(`Morning stiffness: ${answers['ra-morning-stiffness']} min`);
    if (answers['ra-functional-status'])
      symptoms.push(`Functional status: ${answers['ra-functional-status']}`);
    if (symptoms.length) lines.push(symptoms.join(', '));
  }

  if (condition === 'gout') {
    if (answers['gout-serum-urate'] != null)
      lines.push(`Serum Urate: ${answers['gout-serum-urate']} mg/dL`);
    if (answers['gout-current-flare'] != null)
      lines.push(`Current flare: ${answers['gout-current-flare'] ? 'Yes' : 'No'}`);
    if (answers['gout-tophi'] != null)
      lines.push(`Tophi present: ${answers['gout-tophi'] ? 'Yes' : 'No'}`);
    if (answers['gout-flare-frequency'] != null)
      lines.push(`Flares since last visit: ${answers['gout-flare-frequency']}`);
  }

  return lines.length > 0 ? lines.join('\n') : 'No disease activity data recorded';
}

function formatMedications(state) {
  const { current, doses } = state.medications;
  if (!current || current.length === 0) return 'No medications recorded';
  return current
    .map((med) => {
      const name = med.charAt(0).toUpperCase() + med.slice(1);
      const dose = doses[med];
      return dose ? `- ${name}: ${dose}` : `- ${name}`;
    })
    .join('\n');
}

function formatMonitoring(state) {
  const items = state.monitoringStatus || [];
  if (items.length === 0) return 'No monitoring items assessed';
  return items.map((m) => `- ${m.item}: ${m.status}`).join('\n');
}

function formatRecommendations(state) {
  const recs = state.recommendations || [];
  if (recs.length === 0) return 'No specific recommendations generated';
  return recs
    .map((r) => {
      const source = r.guidelineRef?.short || '';
      return `- ${r.recommendation}${source ? ` (Source: ${source})` : ''}`;
    })
    .join('\n');
}

function formatEscalation(state) {
  const { level, flags } = state.escalation || { level: 'green', flags: [] };
  const levelUpper = level.toUpperCase();
  if (level === 'green') return `${levelUpper}: Continue current plan`;
  const reasons = flags.map((f) => f.message).join('; ');
  return `${levelUpper}: ${reasons}`;
}

function suggestFollowUp(state) {
  const level = state.escalation?.level || 'green';
  if (level === 'red') return '1-2 weeks (after rheumatologist contact)';
  if (level === 'yellow') return '4-6 weeks';
  return '3-6 months';
}

export function formatVisitSummary(state) {
  return `RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY
=====================================
Date: ${formatDate()}
Condition: ${CONDITION_NAMES[state.condition] || state.condition}
Visit Type: Video Follow-Up

DISEASE ACTIVITY:
${formatScores(state)}

CURRENT MEDICATIONS:
${formatMedications(state)}

MEDICATION MONITORING STATUS:
${formatMonitoring(state)}

CLINICAL RECOMMENDATIONS:
${formatRecommendations(state)}

ESCALATION STATUS:
${formatEscalation(state)}

PLAN:
${formatRecommendations(state)}

FOLLOW-UP:
- Next video visit: ${suggestFollowUp(state)}
- Labs to order: ${(state.monitoringStatus || []).filter((m) => m.status === 'Due' || m.status === 'Overdue').map((m) => m.item).join(', ') || 'None at this time'}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/exportFormatter.test.js
```

Expected: All export formatter tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/exportFormatter.js tests/exportFormatter.test.js
git commit -m "feat: add visit summary export formatter for EPIC copy-paste

Generates structured text with disease activity, medications,
monitoring status, recommendations with citations, escalation
status, and follow-up suggestions."
```

---

### Task 8: Visit State Hook + Question Data

**Files:**
- Create: `src/hooks/useVisitState.js`, `src/hooks/useScoring.js`, `src/components/conditions/RheumatoidArthritis/RAQuestions.js`, `src/components/conditions/Gout/GoutQuestions.js`

- [ ] **Step 1: Create useVisitState hook**

Create `src/hooks/useVisitState.js`:

```js
import { useReducer, useMemo } from 'react';
import { getRecommendations } from '../utils/recommendationEngine.js';
import { evaluateEscalation } from '../data/escalationCriteria.js';
import { raRules } from '../components/conditions/RheumatoidArthritis/RARules.js';
import { goutRules } from '../components/conditions/Gout/GoutRules.js';
import { GUIDELINES } from '../data/guidelines.js';

const SECTIONS = [
  'condition-select',
  'symptoms',
  'scoring',
  'medications',
  'monitoring',
  'recommendations',
  'escalation',
  'summary',
];

function createInitialState() {
  const sectionStatus = {};
  SECTIONS.forEach((s) => (sectionStatus[s] = 'pending'));
  sectionStatus['condition-select'] = 'in-progress';

  return {
    condition: null,
    currentSection: 'condition-select',
    sectionStatus,
    answers: {},
    scores: {},
    medications: { current: [], doses: {} },
    monitoringStatus: [],
    metadata: { startedAt: new Date().toISOString() },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONDITION': {
      const sectionStatus = { ...state.sectionStatus };
      sectionStatus['condition-select'] = 'complete';
      sectionStatus['symptoms'] = 'in-progress';
      return {
        ...state,
        condition: action.payload,
        currentSection: 'symptoms',
        sectionStatus,
        answers: {},
        scores: {},
        medications: { current: [], doses: {} },
        monitoringStatus: [],
        metadata: {
          ...state.metadata,
          conditionSelectedAt: new Date().toISOString(),
        },
      };
    }
    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.id]: action.payload.value },
      };
    case 'SET_SCORE':
      return {
        ...state,
        scores: { ...state.scores, [action.payload.id]: action.payload.value },
      };
    case 'SET_MEDICATIONS':
      return {
        ...state,
        medications: action.payload,
      };
    case 'SET_MONITORING_STATUS':
      return {
        ...state,
        monitoringStatus: action.payload,
      };
    case 'SET_SECTION': {
      const sectionStatus = { ...state.sectionStatus };
      // Mark previous section as complete if moving forward
      const prevIdx = SECTIONS.indexOf(state.currentSection);
      const nextIdx = SECTIONS.indexOf(action.payload);
      if (nextIdx > prevIdx && state.sectionStatus[state.currentSection] === 'in-progress') {
        sectionStatus[state.currentSection] = 'complete';
      }
      sectionStatus[action.payload] = 'in-progress';
      return {
        ...state,
        currentSection: action.payload,
        sectionStatus,
      };
    }
    case 'RESET_VISIT':
      return createInitialState();
    default:
      return state;
  }
}

const rulesByCondition = { ra: raRules, gout: goutRules };

export function useVisitState() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  const recommendations = useMemo(() => {
    const rules = rulesByCondition[state.condition] || [];
    return getRecommendations(state, rules, GUIDELINES);
  }, [state]);

  const escalation = useMemo(() => {
    return evaluateEscalation(state);
  }, [state]);

  const enrichedState = {
    ...state,
    recommendations,
    escalation,
  };

  return [enrichedState, dispatch];
}

export { SECTIONS };
```

- [ ] **Step 2: Create useScoring hook**

Create `src/hooks/useScoring.js`:

```js
import { useMemo } from 'react';
import {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
} from '../utils/scoreCalculations.js';

export function useScoring(answers) {
  return useMemo(() => {
    const cdai = calculateCDAI({
      sjc28: answers['ra-sjc28'] ?? null,
      tjc28: answers['ra-tjc28'] ?? null,
      patientGlobal: answers['ra-patient-global'] ?? null,
      providerGlobal: answers['ra-provider-global'] ?? null,
    });

    const das28esr = calculateDAS28ESR({
      sjc28: answers['ra-sjc28'] ?? null,
      tjc28: answers['ra-tjc28'] ?? null,
      esr: answers['ra-esr'] ?? null,
      patientGlobal: answers['ra-patient-global-mm'] ?? null,
    });

    const das28crp = calculateDAS28CRP({
      sjc28: answers['ra-sjc28'] ?? null,
      tjc28: answers['ra-tjc28'] ?? null,
      crp: answers['ra-crp'] ?? null,
      patientGlobal: answers['ra-patient-global-mm'] ?? null,
    });

    const rapid3 = calculateRAPID3({
      function0to10: answers['ra-rapid3-function'] ?? null,
      pain0to10: answers['ra-pain-vas'] ?? null,
      globalVAS0to10: answers['ra-patient-global'] ?? null,
    });

    return { cdai, das28esr, das28crp, rapid3 };
  }, [answers]);
}
```

- [ ] **Step 3: Create RA question definitions**

Create `src/components/conditions/RheumatoidArthritis/RAQuestions.js`:

```js
export const RA_QUESTION_GROUPS = [
  {
    id: 'ra-symptoms',
    title: 'Symptom Assessment',
    section: 'symptoms',
    questions: [
      {
        id: 'ra-morning-stiffness',
        label: 'Duration of morning stiffness (minutes)',
        type: 'numeric',
        min: 0,
        max: 480,
        tooltip: 'Morning stiffness >30 minutes is suggestive of inflammatory arthritis. Duration correlates with disease activity.',
      },
      {
        id: 'ra-sjc28',
        label: 'Swollen joint count (0-28)',
        type: 'numeric',
        min: 0,
        max: 28,
        tooltip: 'Count swollen joints in the standard 28-joint assessment. Includes shoulders, elbows, wrists, MCPs, PIPs, and knees bilaterally.',
      },
      {
        id: 'ra-tjc28',
        label: 'Tender joint count (0-28)',
        type: 'numeric',
        min: 0,
        max: 28,
        tooltip: 'Count tender joints in the standard 28-joint assessment. Note: may be harder to assess accurately on video.',
      },
      {
        id: 'ra-patient-global',
        label: 'Patient global assessment (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'Patient rates their overall arthritis activity. 0 = best, 10 = worst.',
      },
      {
        id: 'ra-provider-global',
        label: 'Provider global assessment (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'Provider rates overall disease activity. Note: limited by video assessment. Be conservative.',
      },
      {
        id: 'ra-pain-vas',
        label: 'Pain VAS (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
        tooltip: 'Patient rates their current pain level.',
      },
      {
        id: 'ra-functional-status',
        label: 'Functional status since last visit',
        type: 'radio',
        options: [
          { value: 'improved', label: 'Improved' },
          { value: 'stable', label: 'Stable' },
          { value: 'worsened', label: 'Worsened' },
        ],
      },
      {
        id: 'ra-new-joints',
        label: 'New joint involvement?',
        type: 'toggle',
        followUp: {
          id: 'ra-new-joints-location',
          label: 'Location',
          type: 'text',
        },
      },
      {
        id: 'ra-flares-since-last',
        label: 'Number of flares since last visit',
        type: 'numeric',
        min: 0,
        max: 50,
      },
      {
        id: 'ra-extraarticular',
        label: 'Extra-articular manifestations?',
        type: 'multiselect',
        options: [
          { value: 'nodules', label: 'Rheumatoid nodules' },
          { value: 'ILD', label: 'Interstitial lung disease' },
          { value: 'vasculitis', label: 'Vasculitis' },
          { value: 'eye', label: 'Eye involvement (scleritis/episcleritis)' },
        ],
        tooltip: 'New extra-articular manifestations are a RED FLAG requiring immediate rheumatologist contact.',
      },
      {
        id: 'ra-fatigue',
        label: 'Fatigue severity (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
      },
      {
        id: 'ra-exercise',
        label: 'Currently exercising or in physical therapy?',
        type: 'toggle',
      },
    ],
  },
  {
    id: 'ra-context',
    title: 'Treatment Context',
    section: 'symptoms',
    questions: [
      {
        id: 'ra-dmard-history',
        label: 'Current DMARD status',
        type: 'dropdown',
        options: [
          { value: 'naive', label: 'DMARD-naive (never treated)' },
          { value: 'on-csDMARD', label: 'Currently on csDMARD' },
          { value: 'failed-csDMARD', label: 'Failed/inadequate response to csDMARD' },
          { value: 'on-bDMARD', label: 'Currently on bDMARD/tsDMARD' },
          { value: 'failed-bDMARD', label: 'Failed/inadequate response to bDMARD/tsDMARD' },
        ],
        tooltip: 'This determines which treatment algorithm branch to follow per ACR 2021.',
      },
      {
        id: 'ra-current-biologic-mechanism',
        label: 'Current/most recent biologic mechanism',
        type: 'dropdown',
        options: [
          { value: 'none', label: 'None' },
          { value: 'TNFi', label: 'TNF inhibitor' },
          { value: 'IL-6i', label: 'IL-6 inhibitor' },
          { value: 'JAKi', label: 'JAK inhibitor' },
          { value: 'abatacept', label: 'Abatacept (T-cell co-stimulation)' },
          { value: 'rituximab', label: 'Rituximab (B-cell depletion)' },
        ],
        showWhen: (answers) =>
          ['on-bDMARD', 'failed-bDMARD'].includes(answers['ra-dmard-history']),
      },
      {
        id: 'ra-prednisone-duration',
        label: 'Current prednisone/glucocorticoid use',
        type: 'dropdown',
        options: [
          { value: 'not on prednisone', label: 'Not on prednisone' },
          { value: '<1 month', label: 'Less than 1 month' },
          { value: '1-3 months', label: '1-3 months' },
          { value: '>3 months', label: 'More than 3 months' },
        ],
        tooltip: 'Long-term glucocorticoid use (>3 months) is strongly recommended against by ACR 2021.',
      },
      {
        id: 'ra-heart-failure',
        label: 'Heart failure?',
        type: 'toggle',
        tooltip: 'TNF inhibitors are contraindicated in moderate-severe heart failure.',
      },
      {
        id: 'ra-prior-serious-infection',
        label: 'History of serious infection?',
        type: 'toggle',
        tooltip: 'Affects biologic selection — requires shared decision-making.',
      },
      {
        id: 'ra-hepatitis-b',
        label: 'Hepatitis B positive?',
        type: 'toggle',
        tooltip: 'Must screen before bDMARD/tsDMARD. HBV can reactivate with immunosuppression.',
      },
      {
        id: 'ra-hepatitis-c',
        label: 'Hepatitis C positive?',
        type: 'toggle',
      },
      {
        id: 'ra-lymphoproliferative-history',
        label: 'History of lymphoproliferative disorder?',
        type: 'toggle',
        tooltip: 'Avoid TNFi. Rituximab may be preferred.',
      },
      {
        id: 'ra-ntb-lung-disease',
        label: 'History of non-TB mycobacterial lung disease?',
        type: 'toggle',
      },
    ],
  },
];
```

- [ ] **Step 4: Create Gout question definitions**

Create `src/components/conditions/Gout/GoutQuestions.js`:

```js
export const GOUT_QUESTION_GROUPS = [
  {
    id: 'gout-status',
    title: 'Current Status',
    section: 'symptoms',
    questions: [
      {
        id: 'gout-current-flare',
        label: 'Currently experiencing a gout flare?',
        type: 'toggle',
        tooltip: 'If yes, acute flare management guidance will be provided.',
      },
      {
        id: 'gout-flare-frequency',
        label: 'Number of flares since last visit',
        type: 'numeric',
        min: 0,
        max: 50,
        tooltip: '>=2 flares/year is a strong indication for ULT initiation.',
      },
      {
        id: 'gout-flare-joints',
        label: 'Joints affected by flares',
        type: 'multiselect',
        options: [
          { value: 'first-mtp', label: '1st MTP (big toe)' },
          { value: 'ankle', label: 'Ankle' },
          { value: 'knee', label: 'Knee' },
          { value: 'wrist', label: 'Wrist' },
          { value: 'finger', label: 'Finger(s)' },
          { value: 'elbow', label: 'Elbow' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'gout-tophi',
        label: 'Tophi present?',
        type: 'toggle',
        tooltip: 'Tophi are a strong indication for ULT (ACR 2020).',
        followUp: {
          id: 'gout-tophi-change',
          label: 'Tophi size change',
          type: 'radio',
          options: [
            { value: 'growing', label: 'Growing' },
            { value: 'stable', label: 'Stable' },
            { value: 'shrinking', label: 'Shrinking' },
          ],
        },
      },
      {
        id: 'gout-pain',
        label: 'Current pain level (0-10)',
        type: 'slider',
        min: 0,
        max: 10,
      },
      {
        id: 'gout-functional-limitation',
        label: 'Functional limitation',
        type: 'radio',
        options: [
          { value: 'none', label: 'None' },
          { value: 'mild', label: 'Mild' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'severe', label: 'Severe' },
        ],
      },
    ],
  },
  {
    id: 'gout-lifestyle',
    title: 'Lifestyle Factors',
    section: 'symptoms',
    questions: [
      {
        id: 'gout-alcohol',
        label: 'Alcohol intake',
        type: 'dropdown',
        options: [
          { value: 'none', label: 'None' },
          { value: 'occasional', label: 'Occasional' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'heavy', label: 'Heavy' },
        ],
        tooltip: 'Beer and spirits have the strongest association with gout flares.',
      },
      {
        id: 'gout-purine-diet',
        label: 'Dietary purine adherence',
        type: 'radio',
        options: [
          { value: 'adherent', label: 'Adherent' },
          { value: 'partially', label: 'Partially adherent' },
          { value: 'non-adherent', label: 'Non-adherent' },
        ],
      },
      {
        id: 'gout-hfcs-intake',
        label: 'High-fructose corn syrup intake',
        type: 'radio',
        options: [
          { value: 'none', label: 'None' },
          { value: 'occasional', label: 'Occasional' },
          { value: 'frequent', label: 'Frequent' },
        ],
      },
      {
        id: 'gout-hydration',
        label: 'Hydration status',
        type: 'radio',
        options: [
          { value: 'adequate', label: 'Adequate' },
          { value: 'inadequate', label: 'Inadequate' },
        ],
      },
      {
        id: 'gout-weight-change',
        label: 'Weight change since last visit',
        type: 'radio',
        options: [
          { value: 'loss', label: 'Weight loss' },
          { value: 'stable', label: 'Stable' },
          { value: 'gain', label: 'Weight gain' },
        ],
      },
    ],
  },
  {
    id: 'gout-comorbidities',
    title: 'Comorbidities',
    section: 'symptoms',
    questions: [
      {
        id: 'gout-ckd-stage',
        label: 'CKD Stage',
        type: 'dropdown',
        options: [
          { value: 'none', label: 'No CKD' },
          { value: '1', label: 'Stage 1' },
          { value: '2', label: 'Stage 2' },
          { value: '3a', label: 'Stage 3a' },
          { value: '3b', label: 'Stage 3b' },
          { value: '4', label: 'Stage 4' },
          { value: '5', label: 'Stage 5' },
        ],
        tooltip: 'CKD stage >=3 affects ULT dosing (start allopurinol at 50mg if eGFR <30) and is a ULT indication with first flare.',
      },
      {
        id: 'gout-hypertension',
        label: 'Hypertension?',
        type: 'toggle',
        tooltip: 'Losartan is preferred antihypertensive for gout patients (mild uricosuric effect).',
      },
      {
        id: 'gout-cvd',
        label: 'Cardiovascular disease?',
        type: 'toggle',
        tooltip: 'Relevant for febuxostat risk assessment (FDA boxed warning).',
      },
      {
        id: 'gout-diabetes',
        label: 'Diabetes?',
        type: 'toggle',
      },
      {
        id: 'gout-nephrolithiasis',
        label: 'History of nephrolithiasis (kidney stones)?',
        type: 'toggle',
        tooltip: 'ULT indication with first flare. Probenecid contraindicated.',
      },
    ],
  },
  {
    id: 'gout-labs',
    title: 'Labs',
    section: 'scoring',
    questions: [
      {
        id: 'gout-serum-urate',
        label: 'Serum urate (mg/dL)',
        type: 'numeric',
        min: 0,
        max: 20,
        step: 0.1,
        tooltip: 'Target: <6 mg/dL. This is the primary treat-to-target measure.',
      },
      {
        id: 'gout-egfr',
        label: 'eGFR (mL/min/1.73m²)',
        type: 'numeric',
        min: 0,
        max: 200,
      },
      {
        id: 'gout-creatinine',
        label: 'Creatinine (mg/dL)',
        type: 'numeric',
        min: 0,
        max: 20,
        step: 0.1,
      },
    ],
  },
  {
    id: 'gout-ult',
    title: 'ULT Status',
    section: 'medications',
    questions: [
      {
        id: 'gout-on-ult',
        label: 'Currently on urate-lowering therapy?',
        type: 'toggle',
      },
      {
        id: 'gout-ult-medication',
        label: 'ULT medication',
        type: 'dropdown',
        options: [
          { value: 'allopurinol', label: 'Allopurinol' },
          { value: 'febuxostat', label: 'Febuxostat' },
          { value: 'probenecid', label: 'Probenecid' },
        ],
        showWhen: (answers) => answers['gout-on-ult'] === true,
      },
      {
        id: 'gout-ult-dose',
        label: 'Current ULT dose (mg)',
        type: 'text',
        showWhen: (answers) => answers['gout-on-ult'] === true,
      },
      {
        id: 'gout-ult-adherence',
        label: 'ULT adherence',
        type: 'radio',
        options: [
          { value: 'good', label: 'Good' },
          { value: 'partial', label: 'Partial' },
          { value: 'poor', label: 'Poor' },
        ],
        showWhen: (answers) => answers['gout-on-ult'] === true,
      },
      {
        id: 'gout-hla-b5801-tested',
        label: 'HLA-B*5801 tested?',
        type: 'toggle',
        showWhen: (answers) => answers['gout-on-ult'] === false,
        tooltip: 'Recommended before starting allopurinol in Southeast Asian and African American patients.',
      },
      {
        id: 'gout-flare-prophylaxis',
        label: 'Currently on flare prophylaxis?',
        type: 'toggle',
        showWhen: (answers) => answers['gout-on-ult'] === true,
        tooltip: 'Prophylaxis (colchicine, NSAID, or low-dose GC) is strongly recommended during ULT initiation/titration for >=3-6 months.',
      },
      {
        id: 'gout-allopurinol-hypersensitivity',
        label: 'Signs of allopurinol hypersensitivity? (rash, fever, hepatitis)',
        type: 'toggle',
        showWhen: (answers) => answers['gout-ult-medication'] === 'allopurinol',
        tooltip: 'RED FLAG — suspected allopurinol hypersensitivity syndrome requires immediate discontinuation and rheumatologist contact.',
      },
      {
        id: 'gout-suspected-septic-joint',
        label: 'Concern for septic joint?',
        type: 'toggle',
        tooltip: 'RED FLAG — must differentiate from gout flare. Urgent evaluation required.',
      },
    ],
  },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useVisitState.js src/hooks/useScoring.js src/components/conditions/RheumatoidArthritis/RAQuestions.js src/components/conditions/Gout/GoutQuestions.js
git commit -m "feat: add visit state management, scoring hook, and question definitions

useVisitState: single useReducer tree with derived recommendations
and escalation. Question data externalized for RA and Gout modules."
```

---

### Task 9: Shared UI Components

**Files:**
- Create: `src/components/shared/QuestionCard.jsx`, `src/components/shared/AlertBanner.jsx`, `src/components/shared/RecommendationCard.jsx`, `src/components/shared/GuidelineCitation.jsx`, `src/components/shared/ScoreCalculator.jsx`, `src/components/shared/MedMonitorChecklist.jsx`, `src/components/shared/ExportSummary.jsx`

- [ ] **Step 1: Create QuestionCard**

Create `src/components/shared/QuestionCard.jsx`:

```jsx
import { useState } from 'react';

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm text-[var(--color-info)] hover:underline"
      >
        {open ? 'Hide explanation' : 'Why this matters'}
      </button>
      {open && (
        <p className="mt-1 text-sm text-gray-600 bg-blue-50 border-l-4 border-[var(--color-info)] p-2 rounded">
          {text}
        </p>
      )}
    </div>
  );
}

function QuestionInput({ question, value, onChange, answers }) {
  const { id, type, min, max, step, options, followUp, showWhen } = question;

  if (showWhen && !showWhen(answers)) return null;

  switch (type) {
    case 'numeric':
      return (
        <input
          type="number"
          id={id}
          min={min}
          max={max}
          step={step || 1}
          value={value ?? ''}
          onChange={(e) => onChange(id, e.target.value === '' ? null : Number(e.target.value))}
          className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      );

    case 'slider':
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            step={step || 1}
            value={value ?? min}
            onChange={(e) => onChange(id, Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium w-8 text-center">{value ?? min}</span>
        </div>
      );

    case 'toggle': {
      const checked = value === true;
      return (
        <>
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(id, !checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              checked ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          {checked && followUp && (
            <div className="mt-2 ml-4">
              <label className="block text-sm text-gray-600 mb-1">{followUp.label}</label>
              <QuestionInput
                question={followUp}
                value={answers[followUp.id] ?? null}
                onChange={onChange}
                answers={answers}
              />
            </div>
          )}
        </>
      );
    }

    case 'radio':
      return (
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name={id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(id, opt.value)}
                className="text-[var(--color-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(id, e.target.value || null)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const current = Array.isArray(value) ? value : [];
                  const next = selected
                    ? current.filter((v) => v !== opt.value)
                    : [...current, opt.value];
                  onChange(id, next.length > 0 ? next : []);
                }}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selected
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );

    case 'text':
      return (
        <input
          type="text"
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(id, e.target.value || null)}
          className="w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      );

    default:
      return null;
  }
}

export default function QuestionCard({ group, answers, onAnswer }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-4">{group.title}</h3>
      <div className="space-y-5">
        {group.questions.map((q) => {
          if (q.showWhen && !q.showWhen(answers)) return null;
          return (
            <div key={q.id}>
              <label htmlFor={q.id} className="block text-sm font-medium text-gray-700 mb-1">
                {q.label}
              </label>
              <QuestionInput
                question={q}
                value={answers[q.id] ?? null}
                onChange={onAnswer}
                answers={answers}
              />
              <Tooltip text={q.tooltip} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create AlertBanner**

Create `src/components/shared/AlertBanner.jsx`:

```jsx
const LEVEL_STYLES = {
  red: {
    bg: 'bg-red-50 border-red-400',
    icon: '!',
    iconBg: 'bg-[var(--color-red)] text-white',
    title: 'Immediate Escalation Required',
    titleColor: 'text-[var(--color-red)]',
  },
  yellow: {
    bg: 'bg-yellow-50 border-yellow-400',
    icon: '!',
    iconBg: 'bg-[var(--color-yellow)] text-white',
    title: 'Schedule Rheumatology Follow-Up',
    titleColor: 'text-yellow-700',
  },
  green: {
    bg: 'bg-green-50 border-green-400',
    icon: '\u2713',
    iconBg: 'bg-[var(--color-green)] text-white',
    title: 'Continue Current Plan',
    titleColor: 'text-[var(--color-green)]',
  },
};

export default function AlertBanner({ level, flags }) {
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.green;

  return (
    <div className={`rounded-lg border-l-4 p-4 ${style.bg}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${style.iconBg}`}
        >
          {style.icon}
        </span>
        <div>
          <h4 className={`font-semibold ${style.titleColor}`}>{style.title}</h4>
          {flags && flags.length > 0 && (
            <ul className="mt-2 space-y-1">
              {flags.map((f, i) => (
                <li key={f.id || i} className="text-sm text-gray-700">
                  {f.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create GuidelineCitation**

Create `src/components/shared/GuidelineCitation.jsx`:

```jsx
import { useState } from 'react';

export default function GuidelineCitation({ guidelineRef }) {
  const [expanded, setExpanded] = useState(false);

  if (!guidelineRef) return null;

  return (
    <span className="inline">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-500 italic hover:text-[var(--color-info)] hover:underline"
      >
        [{guidelineRef.short}]
      </button>
      {expanded && (
        <span className="block mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
          {guidelineRef.full}{' '}
          <a
            href={guidelineRef.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-info)] hover:underline"
          >
            DOI
          </a>
        </span>
      )}
    </span>
  );
}
```

- [ ] **Step 4: Create RecommendationCard**

Create `src/components/shared/RecommendationCard.jsx`:

```jsx
import { useState } from 'react';
import GuidelineCitation from './GuidelineCitation';

export default function RecommendationCard({ rec }) {
  const [showRationale, setShowRationale] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span
            className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${
              rec.strength === 'strong'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {rec.strength === 'strong' ? 'Strong' : 'Conditional'}
          </span>
          <span className="text-sm font-medium text-gray-900">{rec.recommendation}</span>
          <div className="mt-1">
            <GuidelineCitation guidelineRef={rec.guidelineRef} />
          </div>
        </div>
      </div>

      {rec.rationale && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowRationale(!showRationale)}
            className="text-xs text-[var(--color-info)] hover:underline"
          >
            {showRationale ? 'Hide rationale' : 'Show rationale'}
          </button>
          {showRationale && (
            <p className="mt-1 text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {rec.rationale}
            </p>
          )}
        </div>
      )}

      {rec.specialFlags && rec.specialFlags.length > 0 && (
        <div className="mt-2 space-y-1">
          {rec.specialFlags.map((flag, i) => (
            <p key={i} className="text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              {flag}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create ScoreCalculator**

Create `src/components/shared/ScoreCalculator.jsx`:

```jsx
import { useState } from 'react';

const CATEGORY_COLORS = {
  Remission: 'bg-[var(--color-green)] text-white',
  'Near-remission': 'bg-[var(--color-green)] text-white',
  Low: 'bg-green-100 text-green-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

export default function ScoreCalculator({ name, calculated, onManualEntry, scoreKey, dispatch }) {
  const [mode, setMode] = useState('calculated');
  const [manualScore, setManualScore] = useState('');
  const [manualCategory, setManualCategory] = useState('');

  const result = mode === 'calculated' ? calculated : null;
  const displayScore = mode === 'manual' ? manualScore : result?.score;
  const displayCategory = mode === 'manual' ? manualCategory : result?.category;

  function handleManualSubmit() {
    if (manualScore && manualCategory) {
      dispatch({
        type: 'SET_SCORE',
        payload: {
          id: scoreKey,
          value: { score: Number(manualScore), category: manualCategory, source: 'manual' },
        },
      });
    }
  }

  function handleCalculatedUse() {
    if (result && !result.error) {
      dispatch({
        type: 'SET_SCORE',
        payload: {
          id: scoreKey,
          value: { ...result, source: 'calculated' },
        },
      });
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">{name}</h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('calculated')}
            className={`text-xs px-3 py-1 rounded ${
              mode === 'calculated' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Auto-calculate
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`text-xs px-3 py-1 rounded ${
              mode === 'manual' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Enter score
          </button>
        </div>
      </div>

      {mode === 'calculated' && (
        <div>
          {result?.error ? (
            <p className="text-sm text-gray-500">{result.error}</p>
          ) : result?.score != null ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">{result.score}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[result.category] || ''}`}>
                {result.category}
              </span>
              <button
                type="button"
                onClick={handleCalculatedUse}
                className="ml-auto text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded hover:opacity-90"
              >
                Use this score
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Enter required values above to calculate.</p>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="Score"
            value={manualScore}
            onChange={(e) => setManualScore(e.target.value)}
            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
          />
          <select
            value={manualCategory}
            onChange={(e) => setManualCategory(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">Category...</option>
            <option value="Remission">Remission</option>
            <option value="Near-remission">Near-remission</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
          <button
            type="button"
            onClick={handleManualSubmit}
            className="text-xs bg-[var(--color-primary)] text-white px-3 py-1 rounded hover:opacity-90"
          >
            Use this score
          </button>
        </div>
      )}

      {displayScore != null && displayCategory && (
        <div className="mt-2 text-xs text-gray-500">
          Active: {displayScore} ({displayCategory})
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Create MedMonitorChecklist**

Create `src/components/shared/MedMonitorChecklist.jsx`:

```jsx
import { MEDICATIONS } from '../../data/medications';

export default function MedMonitorChecklist({ selectedMeds, condition, monitoringStatus, onStatusChange }) {
  const medList = MEDICATIONS[condition] || [];
  const activeMeds = medList.filter((m) => selectedMeds.includes(m.id));

  if (activeMeds.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Select current medications to see monitoring requirements.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeMeds.map((med) => (
        <div key={med.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-[var(--color-primary)] mb-3">{med.name}</h4>
          <div className="space-y-2">
            {med.monitoring.map((item, idx) => {
              const key = `${med.id}-${idx}`;
              const status = monitoringStatus.find((m) => m.key === key);
              return (
                <div key={key} className="flex items-start gap-3">
                  <select
                    value={status?.status || ''}
                    onChange={(e) => onStatusChange(key, item.item, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 w-28 flex-shrink-0"
                  >
                    <option value="">Status...</option>
                    <option value="Current">Current</option>
                    <option value="Due">Due</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Needs ordering">Needs ordering</option>
                    <option value="N/A">N/A</option>
                  </select>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.item}</p>
                    <p className="text-xs text-gray-500">{item.frequency}</p>
                    {item.notes && <p className="text-xs text-amber-600 mt-0.5">{item.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Create ExportSummary**

Create `src/components/shared/ExportSummary.jsx`:

```jsx
import { useState } from 'react';
import { formatVisitSummary } from '../../utils/exportFormatter';

export default function ExportSummary({ state }) {
  const [copied, setCopied] = useState(false);
  const summary = formatVisitSummary(state);

  function handleCopy() {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-primary)]">Visit Summary</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm hover:opacity-90 transition-opacity"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded border border-gray-200 font-mono leading-relaxed max-h-[600px] overflow-y-auto">
        {summary}
      </pre>
    </div>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add shared UI components

QuestionCard (6 input types + tooltips), AlertBanner (red/yellow/green),
RecommendationCard (strength badge + citation + rationale), GuidelineCitation
(hover expand), ScoreCalculator (dual-mode), MedMonitorChecklist,
ExportSummary (copy-to-clipboard)."
```

---

### Task 10: Layout Components

**Files:**
- Create: `src/components/layout/Header.jsx`, `src/components/layout/Sidebar.jsx`, `src/components/layout/ProgressBar.jsx`

- [ ] **Step 1: Create Header**

Create `src/components/layout/Header.jsx`:

```jsx
const CONDITION_LABELS = {
  ra: 'Rheumatoid Arthritis',
  gout: 'Gout',
};

export default function Header({ condition }) {
  return (
    <header className="bg-[var(--color-primary)] text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-xl font-bold tracking-tight">RheumatologyCDS</h1>
      {condition && (
        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
          {CONDITION_LABELS[condition] || condition}
        </span>
      )}
      <span className="text-sm opacity-70">Clinical Decision Support</span>
    </header>
  );
}
```

- [ ] **Step 2: Create Sidebar**

Create `src/components/layout/Sidebar.jsx`:

```jsx
const SECTION_LABELS = {
  'condition-select': 'Condition',
  symptoms: 'Symptoms',
  scoring: 'Disease Activity',
  medications: 'Medications',
  monitoring: 'Monitoring',
  recommendations: 'Recommendations',
  escalation: 'Escalation Check',
  summary: 'Visit Summary',
};

function StatusIcon({ status }) {
  if (status === 'complete')
    return (
      <span className="w-5 h-5 rounded-full bg-[var(--color-green)] flex items-center justify-center text-white text-xs">
        &#10003;
      </span>
    );
  if (status === 'in-progress')
    return <span className="w-5 h-5 rounded-full border-2 border-[var(--color-primary)] bg-blue-100" />;
  return <span className="w-5 h-5 rounded-full border-2 border-gray-300" />;
}

export default function Sidebar({ sectionStatus, currentSection, onNavigate, condition }) {
  const sections = Object.entries(SECTION_LABELS);

  return (
    <nav className="w-56 bg-white border-r border-gray-200 py-4 flex-shrink-0">
      <ul className="space-y-1">
        {sections.map(([key, label]) => {
          const status = sectionStatus[key] || 'pending';
          const isCurrent = currentSection === key;
          const disabled = key !== 'condition-select' && !condition;

          return (
            <li key={key}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onNavigate(key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                  isCurrent
                    ? 'bg-blue-50 text-[var(--color-primary)] font-medium'
                    : disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <StatusIcon status={status} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 3: Create ProgressBar**

Create `src/components/layout/ProgressBar.jsx`:

```jsx
export default function ProgressBar({ sectionStatus }) {
  const statuses = Object.values(sectionStatus);
  const total = statuses.length;
  const complete = statuses.filter((s) => s === 'complete').length;
  const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

  return (
    <div className="bg-gray-100 px-6 py-2 flex items-center gap-3">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 font-medium">{pct}%</span>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout components — Header, Sidebar, ProgressBar"
```

---

### Task 11: Condition Selector + Module Shells

**Files:**
- Create: `src/components/conditions/ConditionSelector.jsx`, `src/components/conditions/RheumatoidArthritis/RAModule.jsx`, `src/components/conditions/Gout/GoutModule.jsx`, `src/components/conditions/RheumatoidArthritis/RAScoring.js`

- [ ] **Step 1: Create ConditionSelector**

Create `src/components/conditions/ConditionSelector.jsx`:

```jsx
const CONDITIONS = [
  { id: 'ra', label: 'Rheumatoid Arthritis', enabled: true },
  { id: 'gout', label: 'Gout', enabled: true },
  { id: 'psa', label: 'Psoriatic Arthritis', enabled: false },
  { id: 'axspa', label: 'Axial Spondyloarthritis', enabled: false },
  { id: 'uia', label: 'Undifferentiated Inflammatory Arthritis', enabled: false },
  { id: 'fibro', label: 'Fibromyalgia', enabled: false },
  { id: 'sle', label: 'Systemic Lupus Erythematosus', enabled: false, comingSoon: true },
];

export default function ConditionSelector({ onSelect }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-2">Select Condition</h2>
      <p className="text-sm text-gray-500 mb-6">Choose the primary condition for this follow-up visit.</p>
      <div className="grid grid-cols-2 gap-3">
        {CONDITIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={!c.enabled}
            onClick={() => c.enabled && onSelect(c.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              c.enabled
                ? 'border-gray-200 hover:border-[var(--color-primary)] hover:shadow-md cursor-pointer'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
          >
            <span className={`font-medium ${c.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
              {c.label}
            </span>
            {c.comingSoon && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                Coming Soon
              </span>
            )}
            {!c.enabled && !c.comingSoon && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                Phase 2
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RAScoring re-export**

Create `src/components/conditions/RheumatoidArthritis/RAScoring.js`:

```js
export {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
} from '../../../utils/scoreCalculations.js';
```

- [ ] **Step 3: Create RAModule**

Create `src/components/conditions/RheumatoidArthritis/RAModule.jsx`:

```jsx
import QuestionCard from '../../shared/QuestionCard';
import ScoreCalculator from '../../shared/ScoreCalculator';
import MedMonitorChecklist from '../../shared/MedMonitorChecklist';
import { RA_QUESTION_GROUPS } from './RAQuestions';
import { useScoring } from '../../../hooks/useScoring';
import { MEDICATIONS } from '../../../data/medications';

export default function RAModule({ state, dispatch, currentSection }) {
  const scores = useScoring(state.answers);

  function handleAnswer(id, value) {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  }

  function handleMedToggle(medId) {
    const current = state.medications.current;
    const next = current.includes(medId)
      ? current.filter((m) => m !== medId)
      : [...current, medId];
    dispatch({
      type: 'SET_MEDICATIONS',
      payload: { ...state.medications, current: next },
    });
  }

  function handleDoseChange(medId, dose) {
    dispatch({
      type: 'SET_MEDICATIONS',
      payload: {
        ...state.medications,
        doses: { ...state.medications.doses, [medId]: dose },
      },
    });
  }

  function handleMonitoringStatus(key, item, status) {
    const existing = state.monitoringStatus.filter((m) => m.key !== key);
    dispatch({
      type: 'SET_MONITORING_STATUS',
      payload: [...existing, { key, item, status }],
    });
  }

  if (currentSection === 'symptoms') {
    const groups = RA_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
    return (
      <div>
        {groups.map((group) => (
          <QuestionCard key={group.id} group={group} answers={state.answers} onAnswer={handleAnswer} />
        ))}
      </div>
    );
  }

  if (currentSection === 'scoring') {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Disease Activity Scores</h2>
        <p className="text-sm text-gray-500 mb-4">
          Scores auto-calculate from symptom data, or enter a pre-calculated score.
        </p>
        <ScoreCalculator name="CDAI" calculated={scores.cdai} scoreKey="cdai" dispatch={dispatch} />
        <ScoreCalculator name="DAS28-ESR" calculated={scores.das28esr} scoreKey="das28esr" dispatch={dispatch} />
        <ScoreCalculator name="DAS28-CRP" calculated={scores.das28crp} scoreKey="das28crp" dispatch={dispatch} />
        <ScoreCalculator name="RAPID3" calculated={scores.rapid3} scoreKey="rapid3" dispatch={dispatch} />
      </div>
    );
  }

  if (currentSection === 'medications') {
    const meds = MEDICATIONS.ra;
    return (
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Current Medications</h2>
        <p className="text-sm text-gray-500 mb-4">Select all medications the patient is currently taking.</p>
        <div className="grid grid-cols-2 gap-2">
          {meds.map((med) => {
            const selected = state.medications.current.includes(med.id);
            return (
              <div key={med.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMedToggle(med.id)}
                  className={`flex-1 p-3 rounded-lg border text-left text-sm transition-colors ${
                    selected
                      ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {med.name}
                  <span className="text-xs text-gray-400 ml-1">({med.class})</span>
                </button>
                {selected && (
                  <input
                    type="text"
                    placeholder="Dose"
                    value={state.medications.doses[med.id] || ''}
                    onChange={(e) => handleDoseChange(med.id, e.target.value)}
                    className="w-32 text-xs border border-gray-300 rounded px-2 py-1.5"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (currentSection === 'monitoring') {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Medication Monitoring</h2>
        <MedMonitorChecklist
          selectedMeds={state.medications.current}
          condition="ra"
          monitoringStatus={state.monitoringStatus}
          onStatusChange={handleMonitoringStatus}
        />
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 4: Create GoutModule**

Create `src/components/conditions/Gout/GoutModule.jsx`:

```jsx
import QuestionCard from '../../shared/QuestionCard';
import MedMonitorChecklist from '../../shared/MedMonitorChecklist';
import { GOUT_QUESTION_GROUPS } from './GoutQuestions';
import { MEDICATIONS } from '../../../data/medications';

export default function GoutModule({ state, dispatch, currentSection }) {
  function handleAnswer(id, value) {
    dispatch({ type: 'SET_ANSWER', payload: { id, value } });
  }

  function handleMedToggle(medId) {
    const current = state.medications.current;
    const next = current.includes(medId)
      ? current.filter((m) => m !== medId)
      : [...current, medId];
    dispatch({
      type: 'SET_MEDICATIONS',
      payload: { ...state.medications, current: next },
    });
  }

  function handleDoseChange(medId, dose) {
    dispatch({
      type: 'SET_MEDICATIONS',
      payload: {
        ...state.medications,
        doses: { ...state.medications.doses, [medId]: dose },
      },
    });
  }

  function handleMonitoringStatus(key, item, status) {
    const existing = state.monitoringStatus.filter((m) => m.key !== key);
    dispatch({
      type: 'SET_MONITORING_STATUS',
      payload: [...existing, { key, item, status }],
    });
  }

  if (currentSection === 'symptoms') {
    const groups = GOUT_QUESTION_GROUPS.filter((g) => g.section === 'symptoms');
    return (
      <div>
        {groups.map((group) => (
          <QuestionCard key={group.id} group={group} answers={state.answers} onAnswer={handleAnswer} />
        ))}
      </div>
    );
  }

  if (currentSection === 'scoring') {
    const groups = GOUT_QUESTION_GROUPS.filter((g) => g.section === 'scoring');
    return (
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Labs & Disease Markers</h2>
        {groups.map((group) => (
          <QuestionCard key={group.id} group={group} answers={state.answers} onAnswer={handleAnswer} />
        ))}
      </div>
    );
  }

  if (currentSection === 'medications') {
    const groups = GOUT_QUESTION_GROUPS.filter((g) => g.section === 'medications');
    const meds = MEDICATIONS.gout;
    return (
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Current Medications & ULT</h2>
        {groups.map((group) => (
          <QuestionCard key={group.id} group={group} answers={state.answers} onAnswer={handleAnswer} />
        ))}
        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Other Gout Medications</h3>
        <div className="grid grid-cols-2 gap-2">
          {meds.map((med) => {
            const selected = state.medications.current.includes(med.id);
            return (
              <div key={med.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMedToggle(med.id)}
                  className={`flex-1 p-3 rounded-lg border text-left text-sm transition-colors ${
                    selected
                      ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)] font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {med.name}
                  <span className="text-xs text-gray-400 ml-1">({med.class})</span>
                </button>
                {selected && (
                  <input
                    type="text"
                    placeholder="Dose"
                    value={state.medications.doses[med.id] || ''}
                    onChange={(e) => handleDoseChange(med.id, e.target.value)}
                    className="w-32 text-xs border border-gray-300 rounded px-2 py-1.5"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (currentSection === 'monitoring') {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Medication Monitoring</h2>
        <MedMonitorChecklist
          selectedMeds={state.medications.current}
          condition="gout"
          monitoringStatus={state.monitoringStatus}
          onStatusChange={handleMonitoringStatus}
        />
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/conditions/
git commit -m "feat: add ConditionSelector, RAModule, and GoutModule

ConditionSelector shows RA/Gout active, Phase 2 conditions greyed
out, SLE as Coming Soon. Modules render section-specific content:
symptoms, scoring, medications, monitoring."
```

---

### Task 12: VisitSummaryGenerator + App Assembly

**Files:**
- Create: `src/components/export/VisitSummaryGenerator.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create VisitSummaryGenerator**

Create `src/components/export/VisitSummaryGenerator.jsx`:

```jsx
import ExportSummary from '../shared/ExportSummary';

export default function VisitSummaryGenerator({ state }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Visit Summary</h2>
      <p className="text-sm text-gray-500 mb-4">
        Copy this summary to paste into your EPIC note.
      </p>
      <ExportSummary state={state} />
    </div>
  );
}
```

- [ ] **Step 2: Assemble App.jsx**

Replace `src/App.jsx`:

```jsx
import { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ProgressBar from './components/layout/ProgressBar';
import ConditionSelector from './components/conditions/ConditionSelector';
import RAModule from './components/conditions/RheumatoidArthritis/RAModule';
import GoutModule from './components/conditions/Gout/GoutModule';
import RecommendationCard from './components/shared/RecommendationCard';
import AlertBanner from './components/shared/AlertBanner';
import VisitSummaryGenerator from './components/export/VisitSummaryGenerator';
import { useVisitState } from './hooks/useVisitState';

export default function App() {
  const [state, dispatch] = useVisitState();
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  function handleConditionSelect(condition) {
    dispatch({ type: 'SET_CONDITION', payload: condition });
  }

  function handleNavigate(section) {
    dispatch({ type: 'SET_SECTION', payload: section });
  }

  function handleNextSection() {
    const sections = Object.keys(state.sectionStatus);
    const currentIdx = sections.indexOf(state.currentSection);
    if (currentIdx < sections.length - 1) {
      handleNavigate(sections[currentIdx + 1]);
    }
  }

  function renderMainContent() {
    if (state.currentSection === 'condition-select') {
      return <ConditionSelector onSelect={handleConditionSelect} />;
    }

    if (state.currentSection === 'recommendations') {
      return (
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
            Clinical Recommendations
          </h2>
          {state.recommendations.length === 0 ? (
            <p className="text-sm text-gray-500">
              Complete symptom assessment and disease activity scoring to generate recommendations.
            </p>
          ) : (
            state.recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))
          )}
        </div>
      );
    }

    if (state.currentSection === 'escalation') {
      return (
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">
            Escalation Check
          </h2>
          <AlertBanner level={state.escalation.level} flags={state.escalation.flags} />
        </div>
      );
    }

    if (state.currentSection === 'summary') {
      return <VisitSummaryGenerator state={state} />;
    }

    if (state.condition === 'ra') {
      return <RAModule state={state} dispatch={dispatch} currentSection={state.currentSection} />;
    }

    if (state.condition === 'gout') {
      return <GoutModule state={state} dispatch={dispatch} currentSection={state.currentSection} />;
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Header condition={state.condition} />
      <ProgressBar sectionStatus={state.sectionStatus} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sectionStatus={state.sectionStatus}
          currentSection={state.currentSection}
          onNavigate={handleNavigate}
          condition={state.condition}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {renderMainContent()}

          {state.currentSection !== 'condition-select' && state.currentSection !== 'summary' && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNextSection}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Next Section
              </button>
            </div>
          )}
        </main>

        {state.condition && state.currentSection !== 'condition-select' && (
          <aside
            className={`border-l border-gray-200 bg-white transition-all overflow-y-auto ${
              rightPanelOpen ? 'w-80 p-4' : 'w-10'
            }`}
          >
            <button
              type="button"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="text-xs text-gray-400 hover:text-gray-600 mb-3"
            >
              {rightPanelOpen ? '\u25B6 Hide' : '\u25C0'}
            </button>
            {rightPanelOpen && (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Escalation Status</h3>
                  <AlertBanner level={state.escalation.level} flags={state.escalation.flags} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Recommendations ({state.recommendations.length})
                  </h3>
                  {state.recommendations.length === 0 ? (
                    <p className="text-xs text-gray-400">Enter data to generate recommendations.</p>
                  ) : (
                    state.recommendations.slice(0, 5).map((rec) => (
                      <RecommendationCard key={rec.id} rec={rec} />
                    ))
                  )}
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {state.condition && (
        <footer className="bg-white border-t border-gray-200 px-6 py-3 flex justify-end sticky bottom-0">
          <button
            type="button"
            onClick={() => handleNavigate('summary')}
            className="px-6 py-2 bg-[var(--color-green)] text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Generate Visit Summary
          </button>
        </footer>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify dev server renders**

```bash
npm run dev
```

Expected: App renders with header, sidebar, condition selector. Clicking RA or Gout loads the respective module flow.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/export/VisitSummaryGenerator.jsx
git commit -m "feat: assemble full application layout and visit flow

Three-panel layout: sidebar nav, main content, live recommendations.
ConditionSelector → module sections → summary export. Sticky
footer with Generate Visit Summary button."
```

---

### Task 13: Run All Tests + Verify Build

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass (scoring, raRules, goutRules, escalation, exportFormatter, smoke).

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Delete smoke test**

Remove the scaffolding smoke test:

```bash
rm tests/smoke.test.js
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: clean up smoke test, verify all tests pass and build succeeds"
```

---

## Self-Review

**Spec coverage check:**
- [x] RA module: questions, CDAI/DAS28-ESR/DAS28-CRP/RAPID3 scoring, rules (ACR 2021), medication monitoring, escalation — Tasks 3, 4, 6, 8, 9, 11
- [x] Gout module: questions, rules (ACR 2020), medication monitoring, escalation — Tasks 5, 6, 8, 9, 11
- [x] Guideline citation library — Task 2
- [x] Medication data with monitoring — Task 2
- [x] Recommendation engine — Task 4
- [x] Escalation engine — Task 6
- [x] Export formatter — Task 7
- [x] Visit state hook — Task 8
- [x] Shared UI components (QuestionCard, ScoreCalculator, AlertBanner, RecommendationCard, MedMonitorChecklist, GuidelineCitation, ExportSummary) — Task 9
- [x] Layout (Header, Sidebar, ProgressBar) — Task 10
- [x] Condition selector with greyed-out Phase 2 + SLE Coming Soon — Task 11
- [x] App assembly with three-panel layout — Task 12
- [x] Copy-to-clipboard export — Task 9 (ExportSummary)
- [x] Education tooltips — Task 9 (QuestionCard)
- [x] Section completion indicators — Task 10 (Sidebar)
- [x] Right panel with live recommendations + escalation — Task 12
- [x] Tests: scoring, RA rules, Gout rules, escalation, export — Tasks 3-7

**Placeholder scan:** No TBD/TODO found. All code blocks complete.

**Type consistency check:**
- `getRecommendations(state, rules, GUIDELINES)` — consistent across Tasks 4, 5
- `evaluateEscalation(state)` — consistent across Tasks 6, 8
- `formatVisitSummary(state)` — consistent across Tasks 7, 9
- State shape: `condition`, `answers`, `scores`, `medications`, `monitoringStatus`, `recommendations`, `escalation` — consistent across all tasks
- Question IDs match between question files (Task 8) and rule conditions (Tasks 4, 5, 6)
