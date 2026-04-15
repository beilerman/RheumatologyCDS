import { describe, it, expect } from 'vitest';
import { getRecommendations } from '../src/utils/recommendationEngine.js';
import { fibroRules } from '../src/components/conditions/Fibromyalgia/FibroRules.js';
import { GUIDELINES } from '../src/data/guidelines.js';

function makeState(overrides = {}) {
  return { condition: 'fibro', answers: {}, scores: {}, medications: { current: [], doses: {} }, ...overrides };
}

describe('Fibro Rules: Non-pharmacologic (always on)', () => {
  it('always recommends aerobic exercise', () => {
    const state = makeState();
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const ex = recs.find((r) => r.id === 'fibro-exercise-always');
    expect(ex).toBeDefined();
    expect(ex.strength).toBe('strong');
    expect(ex.guideline).toBe('EULAR_FIBRO_2016');
  });

  it('always recommends CBT', () => {
    const state = makeState();
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const cbt = recs.find((r) => r.id === 'fibro-cbt');
    expect(cbt).toBeDefined();
    expect(cbt.strength).toBe('strong');
  });

  it('always recommends mind-body practices', () => {
    const state = makeState();
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const mb = recs.find((r) => r.id === 'fibro-mind-body');
    expect(mb).toBeDefined();
    expect(mb.strength).toBe('conditional');
  });

  it('always sets realistic expectations', () => {
    const state = makeState();
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const exp = recs.find((r) => r.id === 'fibro-expectations');
    expect(exp).toBeDefined();
    expect(exp.strength).toBe('strong');
  });
});

describe('Fibro Rules: Duloxetine for depression/anxiety', () => {
  it('recommends duloxetine when depression screen positive', () => {
    const state = makeState({ answers: { 'fibro-depression-screen': 'positive' } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const dul = recs.find((r) => r.id === 'fibro-duloxetine-depression');
    expect(dul).toBeDefined();
    expect(dul.strength).toBe('conditional');
  });

  it('recommends duloxetine when anxiety screen positive', () => {
    const state = makeState({ answers: { 'fibro-anxiety-screen': 'positive' } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const dul = recs.find((r) => r.id === 'fibro-duloxetine-depression');
    expect(dul).toBeDefined();
  });

  it('does NOT recommend duloxetine when screens negative', () => {
    const state = makeState({
      answers: { 'fibro-depression-screen': 'negative', 'fibro-anxiety-screen': 'negative' },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const dul = recs.find((r) => r.id === 'fibro-duloxetine-depression');
    expect(dul).toBeUndefined();
  });
});

describe('Fibro Rules: Pregabalin for sleep disturbance', () => {
  it('recommends pregabalin when sleep quality <= 4', () => {
    const state = makeState({ answers: { 'fibro-sleep-quality': 3 } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const preg = recs.find((r) => r.id === 'fibro-pregabalin-sleep');
    expect(preg).toBeDefined();
    expect(preg.strength).toBe('conditional');
  });

  it('recommends pregabalin at exactly 4 (threshold)', () => {
    const state = makeState({ answers: { 'fibro-sleep-quality': 4 } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const preg = recs.find((r) => r.id === 'fibro-pregabalin-sleep');
    expect(preg).toBeDefined();
  });

  it('does NOT recommend pregabalin when sleep quality > 4', () => {
    const state = makeState({ answers: { 'fibro-sleep-quality': 7 } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const preg = recs.find((r) => r.id === 'fibro-pregabalin-sleep');
    expect(preg).toBeUndefined();
  });

  it('does NOT recommend pregabalin when no sleep quality entered', () => {
    const state = makeState();
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const preg = recs.find((r) => r.id === 'fibro-pregabalin-sleep');
    expect(preg).toBeUndefined();
  });
});

describe('Fibro Rules: Amitriptyline for sleep disturbance', () => {
  it('recommends amitriptyline when sleep quality <= 4', () => {
    const state = makeState({ answers: { 'fibro-sleep-quality': 2 } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const ami = recs.find((r) => r.id === 'fibro-amitriptyline-sleep');
    expect(ami).toBeDefined();
    expect(ami.strength).toBe('conditional');
  });

  it('does NOT recommend amitriptyline when sleep quality > 4', () => {
    const state = makeState({ answers: { 'fibro-sleep-quality': 8 } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const ami = recs.find((r) => r.id === 'fibro-amitriptyline-sleep');
    expect(ami).toBeUndefined();
  });
});

describe('Fibro Rules: Against opioids', () => {
  it('flags against opioids when patient is requesting them', () => {
    const state = makeState({ answers: { 'fibro-requesting-opioids': true } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const opioid = recs.find((r) => r.id === 'fibro-against-opioids');
    expect(opioid).toBeDefined();
    expect(opioid.strength).toBe('strong');
  });

  it('does NOT flag opioids when not requested', () => {
    const state = makeState({ answers: { 'fibro-requesting-opioids': false } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const opioid = recs.find((r) => r.id === 'fibro-against-opioids');
    expect(opioid).toBeUndefined();
  });
});

describe('Fibro Rules: Against NSAIDs as primary treatment', () => {
  it('flags against NSAIDs when naproxen is on current medications', () => {
    const state = makeState({ medications: { current: ['naproxen'], doses: {} } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const nsaid = recs.find((r) => r.id === 'fibro-against-nsaids');
    expect(nsaid).toBeDefined();
    expect(nsaid.strength).toBe('strong');
  });

  it('flags against NSAIDs when ibuprofen is on current medications', () => {
    const state = makeState({ medications: { current: ['ibuprofen'], doses: {} } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const nsaid = recs.find((r) => r.id === 'fibro-against-nsaids');
    expect(nsaid).toBeDefined();
  });

  it('flags against NSAIDs when celecoxib is on current medications', () => {
    const state = makeState({ medications: { current: ['celecoxib'], doses: {} } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const nsaid = recs.find((r) => r.id === 'fibro-against-nsaids');
    expect(nsaid).toBeDefined();
  });

  it('does NOT flag NSAIDs when none present', () => {
    const state = makeState({ medications: { current: ['duloxetine'], doses: {} } });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const nsaid = recs.find((r) => r.id === 'fibro-against-nsaids');
    expect(nsaid).toBeUndefined();
  });
});

describe('Fibro Rules: Polypharmacy flag', () => {
  it('flags polypharmacy when >2 fibro medications', () => {
    const state = makeState({
      medications: { current: ['duloxetine', 'pregabalin', 'amitriptyline'], doses: {} },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const poly = recs.find((r) => r.id === 'fibro-polypharmacy');
    expect(poly).toBeDefined();
    expect(poly.strength).toBe('strong');
  });

  it('does NOT flag polypharmacy with exactly 2 fibro medications', () => {
    const state = makeState({
      medications: { current: ['duloxetine', 'pregabalin'], doses: {} },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const poly = recs.find((r) => r.id === 'fibro-polypharmacy');
    expect(poly).toBeUndefined();
  });

  it('does NOT flag polypharmacy with 1 fibro medication', () => {
    const state = makeState({
      medications: { current: ['duloxetine'], doses: {} },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const poly = recs.find((r) => r.id === 'fibro-polypharmacy');
    expect(poly).toBeUndefined();
  });

  it('counts only fibro-specific medications, not non-fibro meds', () => {
    const state = makeState({
      medications: { current: ['duloxetine', 'naproxen', 'ibuprofen'], doses: {} },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const poly = recs.find((r) => r.id === 'fibro-polypharmacy');
    // only duloxetine counts as fibro med → count=1, no flag
    expect(poly).toBeUndefined();
  });
});

describe('Fibro Rules: Medication trial evaluation', () => {
  it('recommends taper evaluation after >8 weeks trial when on medications', () => {
    const state = makeState({
      medications: { current: ['duloxetine'], doses: {} },
      answers: { 'fibro-med-trial-duration': '>8 weeks' },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const trial = recs.find((r) => r.id === 'fibro-med-trial-eval');
    expect(trial).toBeDefined();
    expect(trial.strength).toBe('conditional');
  });

  it('does NOT trigger taper evaluation when trial duration is <4 weeks', () => {
    const state = makeState({
      medications: { current: ['duloxetine'], doses: {} },
      answers: { 'fibro-med-trial-duration': '<4 weeks' },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const trial = recs.find((r) => r.id === 'fibro-med-trial-eval');
    expect(trial).toBeUndefined();
  });

  it('does NOT trigger taper evaluation when no medications', () => {
    const state = makeState({
      medications: { current: [], doses: {} },
      answers: { 'fibro-med-trial-duration': '>8 weeks' },
    });
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const trial = recs.find((r) => r.id === 'fibro-med-trial-eval');
    expect(trial).toBeUndefined();
  });
});

describe('Fibro Rules: Guideline references', () => {
  it('exercise recommendation has valid guideline reference', () => {
    const state = makeState();
    const recs = getRecommendations(state, fibroRules, GUIDELINES);
    const ex = recs.find((r) => r.id === 'fibro-exercise-always');
    expect(ex.guidelineRef).toBeDefined();
    expect(ex.guidelineRef.short).toContain('EULAR');
  });
});
