import { describe, it, expect } from 'vitest';
import {
  calculateCDAI,
  calculateDAS28ESR,
  calculateDAS28CRP,
  calculateRAPID3,
  calculateDAPSA, calculateBASDAI, calculateASDASCRP, calculateASDASSER, calculateFSQ
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

describe('calculateDAPSA', () => {
  it('returns Remission for score <= 4', () => {
    const result = calculateDAPSA({ sjc66: 0, tjc68: 1, painVAS: 1, patientGlobalVAS: 1, crp: 0.5 });
    expect(result.score).toBe(3.5);
    expect(result.category).toBe('Remission');
    expect(result.error).toBeNull();
  });

  it('returns Low for score > 4 and <= 14', () => {
    const result = calculateDAPSA({ sjc66: 2, tjc68: 3, painVAS: 3, patientGlobalVAS: 2, crp: 1.5 });
    expect(result.score).toBe(11.5);
    expect(result.category).toBe('Low');
  });

  it('returns Moderate for score > 14 and <= 28', () => {
    const result = calculateDAPSA({ sjc66: 5, tjc68: 6, painVAS: 5, patientGlobalVAS: 4, crp: 2 });
    expect(result.score).toBe(22);
    expect(result.category).toBe('Moderate');
  });

  it('returns High for score > 28', () => {
    const result = calculateDAPSA({ sjc66: 10, tjc68: 10, painVAS: 7, patientGlobalVAS: 6, crp: 3 });
    expect(result.score).toBe(36);
    expect(result.category).toBe('High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateDAPSA({ sjc66: 2, tjc68: null, painVAS: 3, patientGlobalVAS: 2, crp: 1 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateBASDAI', () => {
  it('calculates correctly (mean of Q1-4 + mean of Q5-6, divided by 2)', () => {
    const result = calculateBASDAI({ q1Fatigue: 6, q2SpinalPain: 5, q3JointPain: 4, q4Enthesitis: 3, q5MorningStiffnessSeverity: 7, q6MorningStiffnessDuration: 5 });
    expect(result.score).toBe(5.3);
    expect(result.category).toBe('Active');
  });

  it('returns Inactive for score < 4', () => {
    const result = calculateBASDAI({ q1Fatigue: 2, q2SpinalPain: 1, q3JointPain: 1, q4Enthesitis: 1, q5MorningStiffnessSeverity: 2, q6MorningStiffnessDuration: 1 });
    expect(result.score).toBeLessThan(4);
    expect(result.category).toBe('Inactive');
  });

  it('returns error for missing inputs', () => {
    const result = calculateBASDAI({ q1Fatigue: 6, q2SpinalPain: null, q3JointPain: 4, q4Enthesitis: 3, q5MorningStiffnessSeverity: 7, q6MorningStiffnessDuration: 5 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateASDASCRP', () => {
  it('calculates correctly for known inputs', () => {
    const result = calculateASDASCRP({ backPain: 5, morningStiffness: 4, patientGlobal: 6, peripheralPain: 3, crp: 1.5 });
    expect(result.score).toBeCloseTo(2.2, 1);
    expect(result.category).toBe('High');
  });

  it('returns Inactive for score < 1.3', () => {
    const result = calculateASDASCRP({ backPain: 1, morningStiffness: 0, patientGlobal: 1, peripheralPain: 0, crp: 0.2 });
    expect(result.score).toBeLessThan(1.3);
    expect(result.category).toBe('Inactive');
  });

  it('returns Very High for score > 3.5', () => {
    const result = calculateASDASCRP({ backPain: 8, morningStiffness: 7, patientGlobal: 8, peripheralPain: 6, crp: 5 });
    expect(result.category).toBe('Very High');
  });

  it('returns error for missing inputs', () => {
    const result = calculateASDASCRP({ backPain: 5, morningStiffness: null, patientGlobal: 6, peripheralPain: 3, crp: 1.5 });
    expect(result.error).toBe('Missing required inputs');
  });
});

describe('calculateASDASSER', () => {
  it('uses ESR instead of CRP', () => {
    const result = calculateASDASSER({ backPain: 5, morningStiffness: 4, patientGlobal: 6, peripheralPain: 3, esr: 25 });
    expect(result.score).not.toBeNull();
    expect(result.error).toBeNull();
  });
});

describe('calculateFSQ', () => {
  it('returns correct WPI + SSS total', () => {
    const result = calculateFSQ({ wpiScore: 10, sssScore: 8 });
    expect(result.score).toBe(18);
    expect(result.error).toBeNull();
  });

  it('classifies severity correctly', () => {
    expect(calculateFSQ({ wpiScore: 3, sssScore: 3 }).category).toBe('Mild');
    expect(calculateFSQ({ wpiScore: 7, sssScore: 5 }).category).toBe('Moderate');
    expect(calculateFSQ({ wpiScore: 12, sssScore: 9 }).category).toBe('Severe');
  });

  it('returns error for missing inputs', () => {
    const result = calculateFSQ({ wpiScore: null, sssScore: 8 });
    expect(result.error).toBe('Missing required inputs');
  });

  it('validates diagnostic criteria met', () => {
    expect(calculateFSQ({ wpiScore: 7, sssScore: 5 }).diagnosticCriteriaMet).toBe(true);
    expect(calculateFSQ({ wpiScore: 5, sssScore: 9 }).diagnosticCriteriaMet).toBe(true);
    expect(calculateFSQ({ wpiScore: 3, sssScore: 4 }).diagnosticCriteriaMet).toBe(false);
  });
});
