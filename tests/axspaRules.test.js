import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { axspaRules } from '../src/components/conditions/AxialSpondyloarthritis/AxSpARules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return { condition: 'axspa', answers: {}, scores: {}, medications: { current: [], doses: {} }, ...overrides };
}

describe('AxSpA Rules: NSAIDs first-line', () => {
  it('recommends NSAIDs for treatment-naive patients', () => {
    const state = makeState({ answers: { 'axspa-treatment-status': 'naive' } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-nsaid-first');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('recommends NSAIDs for patients currently on NSAIDs', () => {
    const state = makeState({ answers: { 'axspa-treatment-status': 'on-nsaid' } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-nsaid-first');
    expect(rec).toBeDefined();
  });
});

describe('AxSpA Rules: Exercise for ALL patients', () => {
  it('recommends exercise for any patient state', () => {
    const state = makeState();
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-exercise-all');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('recommends exercise even for patients on biologics', () => {
    const state = makeState({ answers: { 'axspa-treatment-status': 'on-TNFi' } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-exercise-all');
    expect(rec).toBeDefined();
  });
});

describe('AxSpA Rules: NSAID failure → TNFi', () => {
  it('recommends TNFi strongly after NSAID failure with active disease (BASDAI Active)', () => {
    const state = makeState({
      answers: { 'axspa-treatment-status': 'failed-nsaid' },
      scores: { basdai: { category: 'Active' } },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-nsaid-fail-tnfi');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('recommends TNFi after NSAID failure with ASDAS High', () => {
    const state = makeState({
      answers: { 'axspa-treatment-status': 'failed-nsaid' },
      scores: { asdasCrp: { category: 'High' } },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-nsaid-fail-tnfi');
    expect(rec).toBeDefined();
  });

  it('recommends TNFi after NSAID failure with ASDAS Very High', () => {
    const state = makeState({
      answers: { 'axspa-treatment-status': 'failed-nsaid' },
      scores: { asdasCrp: { category: 'Very High' } },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-nsaid-fail-tnfi');
    expect(rec).toBeDefined();
  });

  it('does NOT recommend TNFi after NSAID failure if disease inactive', () => {
    const state = makeState({
      answers: { 'axspa-treatment-status': 'failed-nsaid' },
      scores: { basdai: { category: 'Inactive' } },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-nsaid-fail-tnfi');
    expect(rec).toBeUndefined();
  });
});

describe('AxSpA Rules: TNFi failure → IL-17i', () => {
  it('recommends IL-17i after TNFi failure', () => {
    const state = makeState({ answers: { 'axspa-treatment-status': 'failed-TNFi' } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-tnfi-fail-il17');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
  });
});

describe('AxSpA Rules: IL-17i failure → JAKi', () => {
  it('recommends JAKi after IL-17i failure', () => {
    const state = makeState({ answers: { 'axspa-treatment-status': 'failed-IL17i' } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-il17-fail-jaki');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
  });
});

describe('AxSpA Rules: csDMARDs NOT effective for axial', () => {
  it('always shows csDMARD-not-effective reminder regardless of state', () => {
    const state = makeState();
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-csdmard-not-effective');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('shows csDMARD-not-effective even when treatment-naive', () => {
    const state = makeState({ answers: { 'axspa-treatment-status': 'naive' } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-csdmard-not-effective');
    expect(rec).toBeDefined();
  });
});

describe('AxSpA Rules: Sulfasalazine peripheral only', () => {
  it('recommends sulfasalazine when peripheral joints present', () => {
    const state = makeState({ answers: { 'axspa-peripheral-joints': true } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-ssz-peripheral');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
  });

  it('does NOT recommend sulfasalazine when no peripheral joints', () => {
    const state = makeState({ answers: { 'axspa-peripheral-joints': false } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-ssz-peripheral');
    expect(rec).toBeUndefined();
  });
});

describe('AxSpA Rules: Systemic GC not recommended', () => {
  it('warns against systemic GC when patient is on them', () => {
    const state = makeState({ answers: { 'axspa-on-systemic-gc': true } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-gc-not-recommended');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('does NOT show GC warning when not on systemic GC', () => {
    const state = makeState({ answers: { 'axspa-on-systemic-gc': false } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-gc-not-recommended');
    expect(rec).toBeUndefined();
  });
});

describe('AxSpA Rules: Uveitis', () => {
  it('triggers urgent ophthalmology referral for current uveitis', () => {
    const state = makeState({ answers: { 'axspa-uveitis-current': true } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-uveitis');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });
});

describe('AxSpA Rules: IBD symptoms', () => {
  it('recommends GI referral and IL-17i caution for IBD symptoms', () => {
    const state = makeState({ answers: { 'axspa-ibd-symptoms': true } });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-ibd-symptoms' );
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });
});

describe('AxSpA Rules: guideline hydration', () => {
  it('hydrates ACR_axSpA_2019 guideline reference', () => {
    const state = makeState();
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'axspa-exercise-all');
    expect(rec.guidelineRef).toBeDefined();
    expect(rec.guidelineRef.short).toBe('ACR/SAA/SPARTAN 2019 axSpA Guideline');
  });
});

describe('AxSpA Rules: TB screening', () => {
  it('reminds TB screening when not done after NSAID failure', () => {
    const state = makeState({
      answers: {
        'axspa-treatment-status': 'failed-nsaid',
        'axspa-tb-screening-done': false,
      },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'axspa-tb-screening-reminder');
    expect(tb).toBeDefined();
    expect(tb.strength).toBe('strong');
  });

  it('reminds TB screening when not done after TNFi failure', () => {
    const state = makeState({
      answers: {
        'axspa-treatment-status': 'failed-TNFi',
        'axspa-tb-screening-done': false,
      },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'axspa-tb-screening-reminder');
    expect(tb).toBeDefined();
  });

  it('does NOT remind TB screening when already completed', () => {
    const state = makeState({
      answers: {
        'axspa-treatment-status': 'failed-nsaid',
        'axspa-tb-screening-done': true,
      },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'axspa-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });

  it('does NOT remind TB screening for treatment-naive patients', () => {
    const state = makeState({
      answers: {
        'axspa-treatment-status': 'naive',
      },
    });
    const recs = getRecommendations(state, axspaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'axspa-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });
});
