import { useState } from 'react';

const CATEGORY_COLORS = {
  Remission: 'bg-green-100 text-green-800',
  'Near-remission': 'bg-green-100 text-green-800',
  Low: 'bg-green-100 text-green-800',
  Moderate: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

const CATEGORIES = ['Remission', 'Near-remission', 'Low', 'Moderate', 'High'];

function ScoreDisplay({ result }) {
  if (!result || result.score == null) return null;
  const colorClass = CATEGORY_COLORS[result.category] || 'bg-gray-100 text-gray-700';
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="font-bold text-lg">{result.score}</span>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {result.category}
      </span>
    </div>
  );
}

export function ScoreCalculator({ label, scoreId, calculated, dispatch }) {
  const [mode, setMode] = useState('auto');
  const [manualScore, setManualScore] = useState('');
  const [manualCategory, setManualCategory] = useState('');

  const handleUse = () => {
    if (mode === 'auto' && calculated && calculated.score != null) {
      dispatch({ type: 'SET_SCORE', payload: { id: scoreId, value: calculated } });
    } else if (mode === 'manual' && manualScore !== '') {
      dispatch({
        type: 'SET_SCORE',
        payload: {
          id: scoreId,
          value: { score: Number(manualScore), category: manualCategory || null, error: null },
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
      <h4 className="font-semibold text-[var(--color-primary)] text-sm mb-3">{label}</h4>

      <div className="flex gap-3 mb-3">
        <button
          type="button"
          onClick={() => setMode('auto')}
          className={`px-3 py-1 rounded border text-sm ${
            mode === 'auto'
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          Auto-calculate
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`px-3 py-1 rounded border text-sm ${
            mode === 'manual'
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          Enter score
        </button>
      </div>

      {mode === 'auto' && (
        <div>
          {calculated && calculated.error ? (
            <p className="text-xs text-gray-500 italic">{calculated.error}</p>
          ) : (
            <ScoreDisplay result={calculated} />
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            placeholder="Score"
            value={manualScore}
            onChange={(e) => setManualScore(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <select
            value={manualCategory}
            onChange={(e) => setManualCategory(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Category...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={handleUse}
        className="mt-3 px-4 py-1 bg-[var(--color-primary)] text-white rounded text-sm hover:opacity-90 transition-opacity"
      >
        Use this score
      </button>
    </div>
  );
}
