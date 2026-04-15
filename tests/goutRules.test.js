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

describe('Gout Rules: Radiographic damage ULT indication', () => {
  it('strongly recommends ULT for radiographic damage', () => {
    const state = makeState({
      answers: { 'gout-radiographic-damage': true, 'gout-on-ult': false },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const ult = recs.find((r) => r.id === 'gout-ult-indicated-strong');
    expect(ult).toBeDefined();
    expect(ult.strength).toBe('strong');
  });

  it('recommends allopurinol first-line when radiographic damage present', () => {
    const state = makeState({
      answers: { 'gout-radiographic-damage': true, 'gout-on-ult': false },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const allo = recs.find((r) => r.id === 'gout-ult-allopurinol-first');
    expect(allo).toBeDefined();
  });
});

describe('Gout Rules: HLA-B*5801 screening', () => {
  it('recommends HLA-B*5801 testing for high-risk ethnicity before allopurinol', () => {
    const state = makeState({
      answers: {
        'gout-tophi': true,
        'gout-on-ult': false,
        'gout-high-risk-ethnicity': true,
        'gout-hla-b5801-tested': false,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const hla = recs.find((r) => r.id === 'gout-hla-b5801-screening');
    expect(hla).toBeDefined();
    expect(hla.strength).toBe('conditional');
  });

  it('does NOT recommend HLA-B*5801 testing when already tested', () => {
    const state = makeState({
      answers: {
        'gout-tophi': true,
        'gout-on-ult': false,
        'gout-high-risk-ethnicity': true,
        'gout-hla-b5801-tested': true,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const hla = recs.find((r) => r.id === 'gout-hla-b5801-screening');
    expect(hla).toBeUndefined();
  });

  it('does NOT recommend HLA-B*5801 testing for non-high-risk ethnicity', () => {
    const state = makeState({
      answers: {
        'gout-tophi': true,
        'gout-on-ult': false,
        'gout-high-risk-ethnicity': false,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const hla = recs.find((r) => r.id === 'gout-hla-b5801-screening');
    expect(hla).toBeUndefined();
  });

  it('contraindicates allopurinol when HLA-B*5801 positive', () => {
    const state = makeState({
      answers: {
        'gout-hla-b5801-positive': true,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const avoid = recs.find((r) => r.id === 'gout-hla-b5801-positive-avoid');
    expect(avoid).toBeDefined();
    expect(avoid.strength).toBe('strong');
  });

  it('HLA-B*5801 positive warning fires even when already on ULT', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': true,
        'gout-ult-medication': 'allopurinol',
        'gout-hla-b5801-positive': true,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    const avoid = recs.find((r) => r.id === 'gout-hla-b5801-positive-avoid');
    expect(avoid).toBeDefined();
  });

  it('HLA-B*5801 positive + CVD shows both avoid-allopurinol AND febuxostat-CV warning', () => {
    const state = makeState({
      answers: {
        'gout-on-ult': true,
        'gout-ult-medication': 'febuxostat',
        'gout-cvd': true,
        'gout-hla-b5801-positive': true,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'gout-hla-b5801-positive-avoid')).toBeDefined();
    expect(recs.find((r) => r.id === 'gout-febuxostat-cv-warning')).toBeDefined();
  });
});

describe('Gout Rules: edge cases', () => {
  it('radiographic damage alone (no tophi, zero flares) triggers strong ULT', () => {
    const state = makeState({
      answers: {
        'gout-radiographic-damage': true,
        'gout-tophi': false,
        'gout-flare-frequency': 0,
        'gout-on-ult': false,
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'gout-ult-indicated-strong')).toBeDefined();
    expect(recs.find((r) => r.id === 'gout-ult-indicated-conditional-risk')).toBeUndefined();
  });

  it('radiographic damage does NOT trigger conditional ULT (goes straight to strong)', () => {
    const state = makeState({
      answers: {
        'gout-radiographic-damage': true,
        'gout-on-ult': false,
        'gout-flare-frequency': 1,
        'gout-ckd-stage': '3a',
      },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'gout-ult-indicated-strong')).toBeDefined();
    // Conditional should NOT fire because ultIndicated() is true (radiographic damage)
    expect(recs.find((r) => r.id === 'gout-ult-indicated-conditional-risk')).toBeUndefined();
  });

  it('empty answers object does not crash any rule', () => {
    const state = makeState({ answers: {} });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(Array.isArray(recs)).toBe(true);
  });

  it('null flare-frequency does not trigger ULT indications', () => {
    const state = makeState({
      answers: { 'gout-on-ult': false, 'gout-flare-frequency': null },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'gout-ult-indicated-strong')).toBeUndefined();
  });

  it('serum urate exactly 6.0 triggers titrate-up (>= 6)', () => {
    const state = makeState({
      answers: { 'gout-on-ult': true, 'gout-serum-urate': 6.0 },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'gout-ult-titrate-up')).toBeDefined();
    expect(recs.find((r) => r.id === 'gout-ult-at-target')).toBeUndefined();
  });

  it('serum urate 5.9 triggers at-target (< 6)', () => {
    const state = makeState({
      answers: { 'gout-on-ult': true, 'gout-serum-urate': 5.9 },
    });
    const recs = getRecommendations(state, goutRules, GUIDELINES);
    expect(recs.find((r) => r.id === 'gout-ult-at-target')).toBeDefined();
    expect(recs.find((r) => r.id === 'gout-ult-titrate-up')).toBeUndefined();
  });
});
