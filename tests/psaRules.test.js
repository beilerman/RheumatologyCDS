import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { psaRules } from '../src/components/conditions/PsoriaticArthritis/PsARules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return {
    condition: 'psa',
    answers: {},
    scores: {},
    medications: { current: [], doses: {} },
    ...overrides,
  };
}

describe('PsA Rules: Treatment-naive peripheral', () => {
  it('recommends csDMARD for treatment-naive mild peripheral PsA (conditional)', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'naive',
        'psa-dominant-domain': 'peripheral',
        'psa-severity': 'mild',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-naive-mild-csdmard');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
  });

  it('recommends csDMARD or TNFi for treatment-naive moderate peripheral PsA', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'naive',
        'psa-dominant-domain': 'peripheral',
        'psa-severity': 'moderate',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-naive-moderate-csdmard-or-tnfi');
    expect(rec).toBeDefined();
  });

  it('recommends TNFi for treatment-naive severe peripheral PsA (conditional)', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'naive',
        'psa-dominant-domain': 'peripheral',
        'psa-severity': 'severe',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-naive-severe-tnfi');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
  });
});

describe('PsA Rules: Axial disease', () => {
  it('recommends biologic for axial PsA after NSAID failure', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-nsaid',
        'psa-dominant-domain': 'axial',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-axial-biologic');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('states csDMARDs are NOT effective for axial-dominant PsA', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-nsaid',
        'psa-dominant-domain': 'axial',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-axial-csdmard-not-effective');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });
});

describe('PsA Rules: Enthesitis', () => {
  it('recommends biologic for enthesitis after NSAID failure', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-nsaid',
        'psa-dominant-domain': 'enthesitis',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-enthesitis-biologic');
    expect(rec).toBeDefined();
  });
});

describe('PsA Rules: Skin severity', () => {
  it('recommends TNFi or IL-17i when significant skin involvement and csDMARD failed', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-csDMARD',
        'psa-skin-severity': 'severe>10%',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-skin-preferred-biologic');
    expect(rec).toBeDefined();
  });

  it('recommends skin-preferred biologic for moderate skin + csDMARD failure', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-csDMARD',
        'psa-skin-severity': 'moderate3-10%',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-skin-preferred-biologic');
    expect(rec).toBeDefined();
  });
});

describe('PsA Rules: IBD history', () => {
  it('cautions against IL-17i with IBD history', () => {
    const state = makeState({
      answers: {
        'psa-ibd-history': true,
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-il17-ibd-caution');
    expect(rec).toBeDefined();
  });
});

describe('PsA Rules: csDMARD failure', () => {
  it('recommends biologic after csDMARD failure', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-csDMARD',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-csdmard-fail-biologic');
    expect(rec).toBeDefined();
  });
});

describe('PsA Rules: Eye symptoms', () => {
  it('triggers urgent ophthalmology referral for eye symptoms', () => {
    const state = makeState({
      answers: {
        'psa-eye-symptoms': true,
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-uveitis-screen');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });
});

describe('PsA Rules: Dactylitis', () => {
  it('recommends biologic for dactylitis after NSAID/csDMARD failure', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-csDMARD',
        'psa-dominant-domain': 'dactylitis',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-dactylitis-biologic');
    expect(rec).toBeDefined();
  });
});

describe('PsA Rules: guideline hydration', () => {
  it('hydrates ACR_PsA_2018 guideline reference', () => {
    const state = makeState({
      answers: {
        'psa-eye-symptoms': true,
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-uveitis-screen');
    expect(rec.guidelineRef).toBeDefined();
    expect(rec.guidelineRef.short).toBe('ACR/NPF 2018 PsA Guideline');
  });

  it('hydrates GRAPPA_2021 guideline reference for axial rule', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-nsaid',
        'psa-dominant-domain': 'axial',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'psa-axial-biologic');
    expect(rec.guidelineRef).toBeDefined();
    expect(rec.guidelineRef.short).toBe('GRAPPA 2021 PsA Recommendations');
  });
});

describe('PsA Rules: TB screening', () => {
  it('reminds TB screening when not done before biologic initiation', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-csDMARD',
        'psa-tb-screening-done': false,
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'psa-tb-screening-reminder');
    expect(tb).toBeDefined();
    expect(tb.strength).toBe('strong');
  });

  it('does NOT remind TB screening when already completed', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-csDMARD',
        'psa-tb-screening-done': true,
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'psa-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });

  it('does NOT remind TB screening for treatment-naive patients', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'naive',
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'psa-tb-screening-reminder');
    expect(tb).toBeUndefined();
  });

  it('reminds TB screening after NSAID failure (biologic candidate)', () => {
    const state = makeState({
      answers: {
        'psa-treatment-status': 'failed-nsaid',
        'psa-tb-screening-done': false,
      },
    });
    const recs = getRecommendations(state, psaRules, GUIDELINES);
    const tb = recs.find((r) => r.id === 'psa-tb-screening-reminder');
    expect(tb).toBeDefined();
  });
});
