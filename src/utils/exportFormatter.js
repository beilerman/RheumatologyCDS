const CONDITION_NAMES = {
  ra: 'Rheumatoid Arthritis',
  gout: 'Gout',
  psa: 'Psoriatic Arthritis',
  axspa: 'Axial Spondyloarthritis',
  uia: 'Undifferentiated Inflammatory Arthritis',
  fibro: 'Fibromyalgia',
};

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatScores(state) {
  const lines = [];
  const { scores, answers, condition } = state;

  if (condition === 'ra') {
    if (scores.cdai?.score != null)
      lines.push(`CDAI: ${scores.cdai.score} (${scores.cdai.category})`);
    if (scores.das28esr?.score != null)
      lines.push(`DAS28-ESR: ${scores.das28esr.score} (${scores.das28esr.category})`);
    if (scores.das28crp?.score != null)
      lines.push(`DAS28-CRP: ${scores.das28crp.score} (${scores.das28crp.category})`);
    if (scores.rapid3?.score != null)
      lines.push(`RAPID3: ${scores.rapid3.score} (${scores.rapid3.category})`);

    const symptoms = [];
    if (answers['ra-sjc28'] != null) symptoms.push(`SJC28: ${answers['ra-sjc28']}`);
    if (answers['ra-tjc28'] != null) symptoms.push(`TJC28: ${answers['ra-tjc28']}`);
    if (answers['ra-morning-stiffness'] != null)
      symptoms.push(`Morning stiffness: ${answers['ra-morning-stiffness']} min`);
    if (answers['ra-functional-status'])
      symptoms.push(`Functional status: ${answers['ra-functional-status']}`);
    if (symptoms.length) lines.push(symptoms.join(', '));
  }

  if (condition === 'gout') {
    if (answers['gout-serum-urate'] != null)
      lines.push(`Serum Urate: ${answers['gout-serum-urate']} mg/dL`);
    if (answers['gout-current-flare'] != null)
      lines.push(`Current flare: ${answers['gout-current-flare'] ? 'Yes' : 'No'}`);
    if (answers['gout-tophi'] != null)
      lines.push(`Tophi present: ${answers['gout-tophi'] ? 'Yes' : 'No'}`);
    if (answers['gout-flare-frequency'] != null)
      lines.push(`Flares since last visit: ${answers['gout-flare-frequency']}`);
  }

  return lines.length > 0 ? lines.join('\n') : 'No disease activity data recorded';
}

function formatMedications(state) {
  const { current, doses } = state.medications;
  if (!current || current.length === 0) return 'No medications recorded';
  return current
    .map((med) => {
      const name = med.charAt(0).toUpperCase() + med.slice(1);
      const dose = doses[med];
      return dose ? `- ${name}: ${dose}` : `- ${name}`;
    })
    .join('\n');
}

function formatMonitoring(state) {
  const items = state.monitoringStatus || [];
  if (items.length === 0) return 'No monitoring items assessed';
  return items.map((m) => `- ${m.item}: ${m.status}`).join('\n');
}

function formatRecommendations(state) {
  const recs = state.recommendations || [];
  if (recs.length === 0) return 'No specific recommendations generated';
  return recs
    .map((r) => {
      const source = r.guidelineRef?.short || '';
      return `- ${r.recommendation}${source ? ` (Source: ${source})` : ''}`;
    })
    .join('\n');
}

function formatEscalation(state) {
  const { level, flags } = state.escalation || { level: 'green', flags: [] };
  const levelUpper = level.toUpperCase();
  if (level === 'green') return `${levelUpper}: Continue current plan`;
  const reasons = flags.map((f) => f.message).join('; ');
  return `${levelUpper}: ${reasons}`;
}

function suggestFollowUp(state) {
  const level = state.escalation?.level || 'green';
  if (level === 'red') return '1-2 weeks (after rheumatologist contact)';
  if (level === 'yellow') return '4-6 weeks';
  return '3-6 months';
}

export function formatVisitSummary(state) {
  return `RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY
=====================================
Date: ${formatDate()}
Condition: ${CONDITION_NAMES[state.condition] || state.condition}
Visit Type: Video Follow-Up

DISEASE ACTIVITY:
${formatScores(state)}

CURRENT MEDICATIONS:
${formatMedications(state)}

MEDICATION MONITORING STATUS:
${formatMonitoring(state)}

CLINICAL RECOMMENDATIONS:
${formatRecommendations(state)}

ESCALATION STATUS:
${formatEscalation(state)}

PLAN:
${formatRecommendations(state)}

FOLLOW-UP:
- Next video visit: ${suggestFollowUp(state)}
- Labs to order: ${(state.monitoringStatus || []).filter((m) => m.status === 'Due' || m.status === 'Overdue').map((m) => m.item).join(', ') || 'None at this time'}`;
}
