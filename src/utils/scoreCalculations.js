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
