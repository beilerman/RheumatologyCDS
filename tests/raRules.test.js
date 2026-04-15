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

describe('RA Rules: JAKi boxed warning', () => {
  it('warns about JAKi CV risk for patients >=50 with CV risk factors after csDMARD failure', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-age-50-plus': true,
        'ra-cv-risk-factors': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const warning = recs.find((r) => r.id === 'ra-jaki-cv-warning');
    expect(warning).toBeDefined();
    expect(warning.strength).toBe('strong');
  });

  it('warns about JAKi CV risk for patients >=50 with CV risk factors after bDMARD failure', () => {
    const state = makeState({
      scores: { cdai: { score: 25, category: 'High' } },
      answers: {
        'ra-dmard-history': 'failed-bDMARD',
        'ra-current-biologic-mechanism': 'TNFi',
        'ra-age-50-plus': true,
        'ra-cv-risk-factors': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const warning = recs.find((r) => r.id === 'ra-jaki-cv-warning');
    expect(warning).toBeDefined();
  });

  it('does NOT warn about JAKi for patients without CV risk factors', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-age-50-plus': true,
        'ra-cv-risk-factors': false,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const warning = recs.find((r) => r.id === 'ra-jaki-cv-warning');
    expect(warning).toBeUndefined();
  });

  it('does NOT warn about JAKi for patients under 50', () => {
    const state = makeState({
      scores: { cdai: { score: 18, category: 'Moderate' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-age-50-plus': false,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const warning = recs.find((r) => r.id === 'ra-jaki-cv-warning');
    expect(warning).toBeUndefined();
  });
});

describe('RA Rules: TB screening', () => {
  it('reminds TB screening when not done before biologic initiation', () => {
    const state = makeState({
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-tb-screening-done': false,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'ra-tb-screening-reminder');
    expect(tb).toBeDefined();
    expect(tb.strength).toBe('strong');
  });

  it('does NOT remind TB screening when already completed', () => {
    const state = makeState({
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-tb-screening-done': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'ra-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });

  it('does NOT remind TB screening for DMARD-naive patients', () => {
    const state = makeState({
      answers: {
        'ra-dmard-history': 'naive',
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'ra-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });

  it('TB screening fires when ra-tb-screening-done is undefined (unanswered)', () => {
    const state = makeState({
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        // ra-tb-screening-done not set at all
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'ra-tb-screening-reminder');
    expect(tb).toBeDefined();
  });

  it('TB screening does NOT fire for on-bDMARD (already on therapy)', () => {
    const state = makeState({
      answers: {
        'ra-dmard-history': 'on-bDMARD',
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'ra-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });
});

describe('RA Rules: edge cases', () => {
  it('JAKi warning does NOT fire when disease activity is Low', () => {
    const state = makeState({
      scores: { cdai: { score: 8, category: 'Low' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-age-50-plus': true,
        'ra-cv-risk-factors': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const warning = recs.find((r) => r.id === 'ra-jaki-cv-warning');
    expect(warning).toBeUndefined();
  });

  it('JAKi warning does NOT fire when disease activity is null (no scores)', () => {
    const state = makeState({
      scores: {},
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-age-50-plus': true,
        'ra-cv-risk-factors': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const warning = recs.find((r) => r.id === 'ra-jaki-cv-warning');
    expect(warning).toBeUndefined();
  });

  it('getDiseaseActivity falls back to DAS28-ESR when CDAI is missing', () => {
    const state = makeState({
      scores: { das28esr: { score: 4.0, category: 'Moderate' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const mtx = recs.find((r) => r.id === 'ra-naive-mod-high-mtx');
    expect(mtx).toBeDefined();
  });

  it('getDiseaseActivity falls back to DAS28-CRP when CDAI and DAS28-ESR missing', () => {
    const state = makeState({
      scores: { das28crp: { score: 4.0, category: 'Moderate' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const mtx = recs.find((r) => r.id === 'ra-naive-mod-high-mtx');
    expect(mtx).toBeDefined();
  });

  it('getDiseaseActivity falls back to RAPID3 when all DAS28 missing', () => {
    const state = makeState({
      scores: { rapid3: { score: 15, category: 'High' } },
      answers: { 'ra-dmard-history': 'naive' },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    const mtx = recs.find((r) => r.id === 'ra-naive-mod-high-mtx');
    expect(mtx).toBeDefined();
  });

  it('empty answers object does not crash any RA rule', () => {
    const state = makeState({ answers: {} });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    expect(Array.isArray(recs)).toBe(true);
  });

  it('HF + JAKi warning both fire simultaneously for eligible patient', () => {
    const state = makeState({
      scores: { cdai: { score: 25, category: 'High' } },
      answers: {
        'ra-dmard-history': 'failed-csDMARD',
        'ra-heart-failure': true,
        'ra-age-50-plus': true,
        'ra-cv-risk-factors': true,
      },
    });
    const recs = getRecommendations(state, raRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'ra-special-hf-avoid-tnfi')).toBeDefined();
    expect(recs.find((r) => r.id === 'ra-jaki-cv-warning')).toBeDefined();
  });
});
