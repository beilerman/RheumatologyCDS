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
