import { describe, it, expect } from 'vitest';
import { formatVisitSummary } from '../src/utils/exportFormatter.js';

describe('formatVisitSummary', () => {
  it('generates complete summary for RA visit', () => {
    const state = {
      condition: 'ra',
      scores: { cdai: { score: 14.2, category: 'Moderate' } },
      answers: {
        'ra-sjc28': 4,
        'ra-tjc28': 6,
        'ra-morning-stiffness': 45,
        'ra-functional-status': 'stable',
      },
      medications: {
        current: ['methotrexate', 'adalimumab'],
        doses: { methotrexate: '15mg weekly', adalimumab: '40mg biweekly' },
      },
      recommendations: [
        {
          recommendation: 'Continue current therapy',
          guidelineRef: { short: 'ACR 2021 RA Guideline' },
        },
      ],
      escalation: { level: 'yellow', flags: [{ message: 'Moderate DA on treatment' }] },
      monitoringStatus: [
        { item: 'CBC with differential', status: 'Due' },
      ],
    };

    const summary = formatVisitSummary(state);

    expect(summary).toContain('RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY');
    expect(summary).toContain('Condition: Rheumatoid Arthritis');
    expect(summary).toContain('CDAI: 14.2 (Moderate)');
    expect(summary).toContain('Methotrexate: 15mg weekly');
    expect(summary).toContain('Adalimumab: 40mg biweekly');
    expect(summary).toContain('Continue current therapy');
    expect(summary).toContain('ACR 2021 RA Guideline');
    expect(summary).toContain('YELLOW');
    expect(summary).toContain('CBC with differential: Due');
  });

  it('generates summary for Gout visit', () => {
    const state = {
      condition: 'gout',
      scores: {},
      answers: {
        'gout-serum-urate': 4.8,
        'gout-current-flare': false,
        'gout-tophi': false,
      },
      medications: {
        current: ['allopurinol'],
        doses: { allopurinol: '300mg daily' },
      },
      recommendations: [
        {
          recommendation: 'At target. Continue current dose.',
          guidelineRef: { short: 'ACR 2020 Gout Guideline' },
        },
      ],
      escalation: { level: 'green', flags: [] },
      monitoringStatus: [],
    };

    const summary = formatVisitSummary(state);

    expect(summary).toContain('Condition: Gout');
    expect(summary).toContain('Serum Urate: 4.8 mg/dL');
    expect(summary).toContain('GREEN');
  });

  it('handles missing optional fields gracefully', () => {
    const state = {
      condition: 'ra',
      scores: {},
      answers: {},
      medications: { current: [], doses: {} },
      recommendations: [],
      escalation: { level: 'green', flags: [] },
      monitoringStatus: [],
    };

    const summary = formatVisitSummary(state);
    expect(summary).toContain('RHEUMATOLOGY FOLLOW-UP VISIT SUMMARY');
    expect(summary).toContain('No medications recorded');
  });
});
