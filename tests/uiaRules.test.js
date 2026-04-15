import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { uiaRules } from '../src/components/conditions/UndifferentiatedIA/UIARules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return { condition: 'uia', answers: {}, scores: {}, medications: { current: [], doses: {} }, ...overrides };
}

describe('UIA Rules: Classification evolution — toward RA', () => {
  it('suggests reclassify as RA when RF+, anti-CCP+, and symmetric small joints', () => {
    const state = makeState({
      answers: {
        'uia-rf-positive': true,
        'uia-anti-ccp-positive': true,
        'uia-joint-pattern': 'symmetric-small',
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-ra');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
    expect(rec.guideline).toBe('EULAR_EARLY_ARTHRITIS_2016');
  });

  it('does NOT suggest RA reclassification when seronegative', () => {
    const state = makeState({
      answers: {
        'uia-rf-positive': false,
        'uia-anti-ccp-positive': false,
        'uia-joint-pattern': 'symmetric-small',
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-ra');
    expect(rec).toBeUndefined();
  });
});

describe('UIA Rules: Classification evolution — toward PsA', () => {
  it('suggests PsA when psoriasis + asymmetric joint pattern', () => {
    const state = makeState({
      answers: {
        'uia-psoriasis': true,
        'uia-joint-pattern': 'asymmetric',
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-psa');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('suggests PsA when psoriasis + dactylitis even without asymmetric pattern', () => {
    const state = makeState({
      answers: {
        'uia-psoriasis': true,
        'uia-dactylitis': true,
        'uia-joint-pattern': 'symmetric-small',
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-psa');
    expect(rec).toBeDefined();
  });

  it('suggests PsA when psoriasis + enthesitis', () => {
    const state = makeState({
      answers: {
        'uia-psoriasis': true,
        'uia-enthesitis': true,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-psa');
    expect(rec).toBeDefined();
  });

  it('does NOT suggest PsA without psoriasis', () => {
    const state = makeState({
      answers: {
        'uia-joint-pattern': 'asymmetric',
        'uia-dactylitis': true,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-psa');
    expect(rec).toBeUndefined();
  });
});

describe('UIA Rules: Classification evolution — toward axSpA', () => {
  it('suggests axSpA when inflammatory back pain + HLA-B27 positive', () => {
    const state = makeState({
      answers: {
        'uia-inflammatory-back-pain': true,
        'uia-hla-b27': true,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-axspa');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
  });

  it('does NOT suggest axSpA when HLA-B27 negative', () => {
    const state = makeState({
      answers: {
        'uia-inflammatory-back-pain': true,
        'uia-hla-b27': false,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-evolve-axspa');
    expect(rec).toBeUndefined();
  });
});

describe('UIA Rules: Treatment — confirmed inflammatory arthritis', () => {
  it('recommends csDMARD (MTX preferred) when inflammatory arthritis confirmed and untreated', () => {
    const state = makeState({
      answers: {
        'uia-inflammatory-arthritis-confirmed': true,
        'uia-treatment-status': 'untreated',
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-confirmed-ia-csdmard');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
    expect(rec.recommendation).toMatch(/methotrexate/i);
  });

  it('does NOT recommend csDMARD initiation when already on csDMARD', () => {
    const state = makeState({
      answers: {
        'uia-inflammatory-arthritis-confirmed': true,
        'uia-treatment-status': 'on-csDMARD',
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-confirmed-ia-csdmard');
    expect(rec).toBeUndefined();
  });
});

describe('UIA Rules: Treatment — uncertain diagnosis', () => {
  it('recommends NSAIDs + close follow-up when diagnosis uncertain', () => {
    const state = makeState({
      answers: {
        'uia-inflammatory-arthritis-confirmed': false,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-uncertain-conservative');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
    expect(rec.recommendation).toMatch(/NSAID/i);
  });

  it('shows conservative management when inflammatory-arthritis-confirmed is absent', () => {
    const state = makeState({ answers: {} });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-uncertain-conservative');
    expect(rec).toBeDefined();
  });
});

describe('UIA Rules: No biologics guard', () => {
  it('always recommends against biologics without rheumatologist', () => {
    const state = makeState({ answers: {} });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-no-biologics-without-rheum');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
    expect(rec.recommendation).toMatch(/biologic/i);
  });
});

describe('UIA Rules: Autoantibody recheck', () => {
  it('reminds to recheck autoantibodies when all initially negative', () => {
    const state = makeState({
      answers: {
        'uia-rf-positive': false,
        'uia-anti-ccp-positive': false,
        'uia-ana-positive': false,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-autoantibody-recheck');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('conditional');
    expect(rec.recommendation).toMatch(/RF/i);
  });

  it('does NOT remind recheck when RF is positive', () => {
    const state = makeState({
      answers: {
        'uia-rf-positive': true,
        'uia-anti-ccp-positive': false,
        'uia-ana-positive': false,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-autoantibody-recheck');
    expect(rec).toBeUndefined();
  });

  it('does NOT remind recheck when ANA is positive', () => {
    const state = makeState({
      answers: {
        'uia-rf-positive': false,
        'uia-anti-ccp-positive': false,
        'uia-ana-positive': true,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-autoantibody-recheck');
    expect(rec).toBeUndefined();
  });
});

describe('UIA Rules: Erosive disease', () => {
  it('flags erosive changes as urgent', () => {
    const state = makeState({
      answers: {
        'uia-erosive-changes': true,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-erosive-urgent');
    expect(rec).toBeDefined();
    expect(rec.strength).toBe('strong');
    expect(rec.recommendation).toMatch(/erosive/i);
  });

  it('does NOT flag erosive urgency without erosive changes', () => {
    const state = makeState({
      answers: {
        'uia-erosive-changes': false,
      },
    });
    const recs = getRecommendations(state, uiaRules, GUIDELINES);
    const rec = recs.find((r) => r.id === 'uia-erosive-urgent');
    expect(rec).toBeUndefined();
  });
});
