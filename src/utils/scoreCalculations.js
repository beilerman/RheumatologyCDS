function categorize(score, thresholds) {
  for (const [max, label] of thresholds) {
    if (score <= max) return label;
  }
  return thresholds[thresholds.length - 1][1];
}

function hasMissing(values) {
  return values.some((v) => v === null || v === undefined);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

const MISSING = { score: null, category: null, error: 'Missing required inputs' };

export function calculateCDAI({ sjc28, tjc28, patientGlobal, providerGlobal }) {
  if (hasMissing([sjc28, tjc28, patientGlobal, providerGlobal])) return MISSING;
  const score = round1(sjc28 + tjc28 + patientGlobal + providerGlobal);
  const category = categorize(score, [
    [2.8, 'Remission'],
    [10, 'Low'],
    [22, 'Moderate'],
    [Infinity, 'High'],
  ]);
  return { score, category, error: null };
}

export function calculateDAS28ESR({ sjc28, tjc28, esr, patientGlobal }) {
  if (hasMissing([sjc28, tjc28, esr, patientGlobal])) return MISSING;
  const score = round1(
    0.56 * Math.sqrt(tjc28) +
    0.28 * Math.sqrt(sjc28) +
    0.70 * Math.log(esr) +
    0.014 * patientGlobal
  );
  const finalCategory = score < 2.6 ? 'Remission'
    : score <= 3.2 ? 'Low'
    : score <= 5.1 ? 'Moderate'
    : 'High';
  return { score, category: finalCategory, error: null };
}

export function calculateDAS28CRP({ sjc28, tjc28, crp, patientGlobal }) {
  if (hasMissing([sjc28, tjc28, crp, patientGlobal])) return MISSING;
  const score = round1(
    0.56 * Math.sqrt(tjc28) +
    0.28 * Math.sqrt(sjc28) +
    0.36 * Math.log(crp + 1) +
    0.014 * patientGlobal +
    0.96
  );
  const finalCategory = score < 2.6 ? 'Remission'
    : score <= 3.2 ? 'Low'
    : score <= 5.1 ? 'Moderate'
    : 'High';
  return { score, category: finalCategory, error: null };
}

export function calculateRAPID3({ function0to10, pain0to10, globalVAS0to10 }) {
  if (hasMissing([function0to10, pain0to10, globalVAS0to10])) return MISSING;
  const score = round1(function0to10 + pain0to10 + globalVAS0to10);
  const category = categorize(score, [
    [3, 'Near-remission'],
    [6, 'Low'],
    [12, 'Moderate'],
    [Infinity, 'High'],
  ]);
  return { score, category, error: null };
}

export function calculateDAPSA({ sjc66, tjc68, painVAS, patientGlobalVAS, crp }) {
  if (hasMissing([sjc66, tjc68, painVAS, patientGlobalVAS, crp])) return MISSING;
  const score = round1(sjc66 + tjc68 + painVAS + patientGlobalVAS + crp);
  const category = categorize(score, [
    [4, 'Remission'], [14, 'Low'], [28, 'Moderate'], [Infinity, 'High'],
  ]);
  return { score, category, error: null };
}

export function calculateBASDAI({ q1Fatigue, q2SpinalPain, q3JointPain, q4Enthesitis, q5MorningStiffnessSeverity, q6MorningStiffnessDuration }) {
  if (hasMissing([q1Fatigue, q2SpinalPain, q3JointPain, q4Enthesitis, q5MorningStiffnessSeverity, q6MorningStiffnessDuration])) return MISSING;
  const meanQ1to4 = (q1Fatigue + q2SpinalPain + q3JointPain + q4Enthesitis) / 4;
  const meanQ5to6 = (q5MorningStiffnessSeverity + q6MorningStiffnessDuration) / 2;
  const score = round1((meanQ1to4 + meanQ5to6) / 2);
  const category = score >= 4 ? 'Active' : 'Inactive';
  return { score, category, error: null };
}

export function calculateASDASCRP({ backPain, morningStiffness, patientGlobal, peripheralPain, crp }) {
  if (hasMissing([backPain, morningStiffness, patientGlobal, peripheralPain, crp])) return MISSING;
  const score = round1(
    0.121 * backPain + 0.110 * morningStiffness + 0.073 * patientGlobal + 0.058 * peripheralPain + 0.579 * Math.log(crp + 1)
  );
  const category = score < 1.3 ? 'Inactive' : score < 2.1 ? 'Low' : score <= 3.5 ? 'High' : 'Very High';
  return { score, category, error: null };
}

export function calculateASDASSER({ backPain, morningStiffness, patientGlobal, peripheralPain, esr }) {
  if (hasMissing([backPain, morningStiffness, patientGlobal, peripheralPain, esr])) return MISSING;
  const score = round1(
    0.079 * backPain + 0.069 * morningStiffness + 0.113 * patientGlobal + 0.086 * peripheralPain + 0.293 * Math.sqrt(esr)
  );
  const category = score < 1.3 ? 'Inactive' : score < 2.1 ? 'Low' : score <= 3.5 ? 'High' : 'Very High';
  return { score, category, error: null };
}

export function calculateFSQ({ wpiScore, sssScore }) {
  if (hasMissing([wpiScore, sssScore])) return MISSING;
  const score = wpiScore + sssScore;
  const category = score < 12 ? 'Mild' : score <= 20 ? 'Moderate' : 'Severe';
  const diagnosticCriteriaMet = (wpiScore >= 7 && sssScore >= 5) || (wpiScore >= 4 && wpiScore <= 6 && sssScore >= 9);
  return { score, category, diagnosticCriteriaMet, error: null };
}
