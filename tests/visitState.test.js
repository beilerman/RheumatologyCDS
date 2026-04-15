import { describe, expect, it } from 'vitest';
import * as visitState from '../src/hooks/useVisitState.js';

describe('visit state navigation', () => {
  it('keeps exactly one section in progress when navigating backward', () => {
    expect(typeof visitState.createInitialState).toBe('function');
    expect(typeof visitState.reducer).toBe('function');

    let state = visitState.createInitialState();
    state = visitState.reducer(state, { type: 'SET_CONDITION', payload: 'ra' });
    state = visitState.reducer(state, { type: 'SET_SECTION', payload: 'scoring' });
    state = visitState.reducer(state, { type: 'SET_SECTION', payload: 'symptoms' });

    const inProgress = Object.entries(state.sectionStatus).filter(([, status]) => status === 'in-progress');

    expect(inProgress).toEqual([['symptoms', 'in-progress']]);
    expect(state.sectionStatus.scoring).toBe('pending');
  });

  it('marks all sections complete after finishing the full flow', () => {
    expect(typeof visitState.createInitialState).toBe('function');
    expect(typeof visitState.reducer).toBe('function');

    let state = visitState.createInitialState();
    state = visitState.reducer(state, { type: 'SET_CONDITION', payload: 'ra' });

    for (const section of visitState.SECTIONS.slice(2)) {
      state = visitState.reducer(state, { type: 'SET_SECTION', payload: section });
    }

    expect(Object.values(state.sectionStatus).every((status) => status === 'complete')).toBe(true);
  });
});
