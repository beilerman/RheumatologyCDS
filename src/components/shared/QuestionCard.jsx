import { useState } from 'react';

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-[var(--color-info)] underline hover:no-underline"
        aria-label="Why this matters"
      >
        Why this matters
      </button>
      {open && (
        <div className="absolute z-10 left-0 top-6 w-64 bg-white border border-gray-200 rounded shadow-md p-3 text-xs text-gray-700">
          {text}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block mt-2 text-[var(--color-info)] underline"
          >
            Close
          </button>
        </div>
      )}
    </span>
  );
}

function QuestionInput({ question, value, onAnswer }) {
  const { id, type, min, max, step, options, followUp } = question;

  const handleChange = (val) => onAnswer(id, val);

  if (type === 'numeric') {
    return (
      <input
        type="number"
        min={min}
        max={max}
        step={step ?? 1}
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value === '' ? null : Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 w-32 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
    );
  }

  if (type === 'slider') {
    const num = value ?? min ?? 0;
    return (
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min ?? 0}
          max={max ?? 10}
          step={step ?? 1}
          value={num}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-48"
        />
        <span className="text-sm font-semibold w-6 text-center">{num}</span>
      </div>
    );
  }

  if (type === 'toggle') {
    const checked = value === true;
    return (
      <div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => handleChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            checked ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        {checked && followUp && (
          <div className="mt-2 ml-1">
            <label className="block text-xs text-gray-600 mb-1">{followUp.label}</label>
            <QuestionInput
              question={followUp}
              value={undefined}
              onAnswer={onAnswer}
            />
          </div>
        )}
      </div>
    );
  }

  if (type === 'radio') {
    return (
      <div className="flex flex-wrap gap-2">
        {(options || []).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleChange(opt.value)}
            className={`px-3 py-1 rounded border text-sm transition-colors ${
              value === opt.value
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[var(--color-primary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (type === 'dropdown') {
    return (
      <select
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value || null)}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      >
        <option value="">Select...</option>
        {(options || []).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === 'multiselect') {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (v) => {
      const next = selected.includes(v)
        ? selected.filter((x) => x !== v)
        : [...selected, v];
      handleChange(next.length ? next : []);
    };
    return (
      <div className="flex flex-wrap gap-2">
        {(options || []).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
              selected.includes(opt.value)
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-white text-gray-600 border-gray-300 hover:border-[var(--color-primary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value || null)}
        className="border border-gray-300 rounded px-2 py-1 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
    );
  }

  return null;
}

export function QuestionCard({ group, answers, onAnswer }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-4">
      <h3 className="font-semibold text-[var(--color-primary)] text-base mb-4">
        {group.title}
      </h3>
      <div className="space-y-4">
        {group.questions.map((q) => {
          if (q.showWhen && !q.showWhen(answers)) return null;
          return (
            <div key={q.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {q.label}
                {q.tooltip && <Tooltip text={q.tooltip} />}
              </label>
              <QuestionInput
                question={q}
                value={answers[q.id]}
                onAnswer={onAnswer}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
