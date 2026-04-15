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
