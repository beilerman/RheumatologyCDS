import React, { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { QuestionCard } from '../src/components/shared/QuestionCard.jsx';

globalThis.React = React;

describe('QuestionCard follow-up answers', () => {
  it('renders saved text answers for toggle follow-up questions', () => {
    const group = {
      id: 'follow-up-text',
      title: 'Follow-up text',
      questions: [
        {
          id: 'has-follow-up',
          label: 'Needs details?',
          type: 'toggle',
          followUp: {
            id: 'follow-up-details',
            label: 'Details',
            type: 'text',
          },
        },
      ],
    };

    const html = renderToStaticMarkup(
      createElement(QuestionCard, {
        group,
        answers: {
          'has-follow-up': true,
          'follow-up-details': 'Left wrist and right ankle',
        },
        onAnswer: () => {},
      })
    );

    expect(html).toContain('value="Left wrist and right ankle"');
  });

  it('renders saved radio answers for toggle follow-up questions', () => {
    const group = {
      id: 'follow-up-radio',
      title: 'Follow-up radio',
      questions: [
        {
          id: 'has-tophi',
          label: 'Tophi present?',
          type: 'toggle',
          followUp: {
            id: 'tophi-trend',
            label: 'Trend',
            type: 'radio',
            options: [
              { value: 'growing', label: 'Growing' },
              { value: 'stable', label: 'Stable' },
              { value: 'shrinking', label: 'Shrinking' },
            ],
          },
        },
      ],
    };

    const html = renderToStaticMarkup(
      createElement(QuestionCard, {
        group,
        answers: {
          'has-tophi': true,
          'tophi-trend': 'stable',
        },
        onAnswer: () => {},
      })
    );

    expect(html).toContain(
      'bg-[var(--color-primary)] text-white border-[var(--color-primary)]">Stable</button>'
    );
  });
});
