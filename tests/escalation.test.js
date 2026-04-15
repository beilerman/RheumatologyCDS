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
  it('flags moderate DA on current regimen', () => {
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

  it('does not apply the allopurinol dose escalation flag to other ULT agents', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'probenecid',
        'gout-ult-dose': '500 mg twice daily',
      },
    });
    const result = evaluateEscalation(state);
    expect(result.flags.some((f) => f.id === 'gout-yellow-not-at-target')).toBe(false);
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
