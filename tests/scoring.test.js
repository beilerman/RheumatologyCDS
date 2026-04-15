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
