import { useState } from 'react';
import { GuidelineCitation } from './GuidelineCitation.jsx';

const STRENGTH_STYLES = {
  strong: 'bg-[var(--color-primary)] text-white',
  conditional: 'bg-gray-200 text-gray-700',
};

export function RecommendationCard({ rec }) {
  const [showRationale, setShowRationale] = useState(false);

  if (!rec) return null;

  const strengthStyle = STRENGTH_STYLES[rec.strength] || STRENGTH_STYLES.conditional;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-3">
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold uppercase ${strengthStyle}`}
        >
          {rec.strength || 'Conditional'}
        </span>
        <div className="flex-1">
          <p className="text-sm text-gray-800">
            {rec.recommendation}
            {rec.guidelineRef && <GuidelineCitation guideline={rec.guidelineRef} />}
          </p>

          {rec.rationale && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowRationale((v) => !v)}
                className="text-xs text-[var(--color-info)] hover:underline"
              >
                {showRationale ? 'Hide rationale' : 'Show rationale'}
              </button>
              {showRationale && (
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  {rec.rationale}
                </p>
              )}
            </div>
          )}

          {rec.specialFlags && rec.specialFlags.length > 0 && (
            <div className="mt-2 space-y-1">
              {rec.specialFlags.map((flag, i) => (
                <div
                  key={i}
                  className="text-xs bg-amber-50 border border-amber-200 rounded px-2 py-1 text-amber-800"
                >
                  {flag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
