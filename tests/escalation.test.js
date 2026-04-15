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

describe('Escalation edge cases', () => {
  it('unknown condition returns green with no flags', () => {
    const state = makeState('unknown-condition', { answers: {} });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('green');
    expect(result.flags).toHaveLength(0);
  });

  it('empty state does not crash evaluateEscalation', () => {
    const state = { condition: 'ra', answers: {}, scores: {}, medications: { current: [] } };
    const result = evaluateEscalation(state);
    expect(result.level).toBe('green');
  });

  it('red overrides yellow when both present', () => {
    const state = makeState('ra', {
      scores: { cdai: { score: 25, category: 'High' } },
      answers: {
        'ra-dmard-history': 'failed-bDMARD',
        'ra-prednisone-duration': '>3 months',
        'ra-extraarticular': ['ILD'],
      },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('red');
    // Should have both red and yellow flags in the list
    expect(result.flags.some((f) => f.level === 'red')).toBe(true);
    expect(result.flags.some((f) => f.level === 'yellow')).toBe(true);
  });

  it('gout dose parsing handles "300mg" (no space)', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'allopurinol',
        'gout-ult-dose': '300mg',
      },
    });
    const result = evaluateEscalation(state);
    expect(result.flags.some((f) => f.id === 'gout-yellow-not-at-target')).toBe(true);
  });

  it('gout dose parsing handles "300 mg/day" format', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'allopurinol',
        'gout-ult-dose': '300 mg/day',
      },
    });
    const result = evaluateEscalation(state);
    expect(result.flags.some((f) => f.id === 'gout-yellow-not-at-target')).toBe(true);
  });

  it('gout dose parsing handles non-numeric string gracefully', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'allopurinol',
        'gout-ult-dose': 'unknown',
      },
    });
    const result = evaluateEscalation(state);
    // Should NOT flag because dose can't be parsed as >= 300
    expect(result.flags.some((f) => f.id === 'gout-yellow-not-at-target')).toBe(false);
  });

  it('gout dose parsing handles numeric value directly', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'allopurinol',
        'gout-ult-dose': 300,
      },
    });
    const result = evaluateEscalation(state);
    expect(result.flags.some((f) => f.id === 'gout-yellow-not-at-target')).toBe(true);
  });

  it('gout dose=200 does NOT trigger the not-at-target escalation (below 300 threshold)', () => {
    const state = makeState('gout', {
      answers: {
        'gout-on-ult': true,
        'gout-serum-urate': 7.5,
        'gout-ult-medication': 'allopurinol',
        'gout-ult-dose': '200',
      },
    });
    const result = evaluateEscalation(state);
    expect(result.flags.some((f) => f.id === 'gout-yellow-not-at-target')).toBe(false);
  });

  it('PsA multi-domain RED requires being on biologic', () => {
    const state = makeState('psa', {
      answers: {
        'psa-treatment-status': 'on-csDMARD',
        'psa-dominant-domain': 'peripheral',
        'psa-axial-symptoms': true,
        'psa-dactylitis': true,
        'psa-skin-severity': 'severe>10%',
        'psa-enthesitis-sites': ['achilles', 'plantar'],
      },
    });
    const result = evaluateEscalation(state);
    // Should NOT be red because not on biologic
    expect(result.flags.some((f) => f.id === 'psa-red-multidomain')).toBe(false);
  });

  it('fibro polypharmacy works with empty medications array', () => {
    const state = makeState('fibro', {
      medications: { current: [] },
      answers: {},
    });
    const result = evaluateEscalation(state);
    expect(result.flags.some((f) => f.id === 'fibro-yellow-polypharmacy')).toBe(false);
  });

  it('fibro polypharmacy works with undefined medications', () => {
    const state = { condition: 'fibro', answers: {}, scores: {} };
    const result = evaluateEscalation(state);
    // Should not crash even without medications property
    expect(result.level).toBe('green');
  });

  it('AxSpA red neuro fires independently of disease activity scores', () => {
    const state = makeState('axspa', {
      scores: {},
      answers: { 'axspa-neurological-symptoms': true },
    });
    const result = evaluateEscalation(state);
    expect(result.level).toBe('red');
    expect(result.flags.some((f) => f.id === 'axspa-red-neuro')).toBe(true);
  });
});
