import { useState } from 'react';

export function GuidelineCitation({ guideline }) {
  const [open, setOpen] = useState(false);

  if (!guideline) return null;

  return (
    <span className="inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-[var(--color-info)] font-medium hover:underline"
      >
        [{guideline.short}]
      </button>
      {open && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700 max-w-prose">
          <p className="mb-1">{guideline.full}</p>
          {guideline.url && (
            <a
              href={guideline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-info)] underline"
            >
              {guideline.url}
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="block mt-2 text-gray-500 hover:text-gray-800 underline"
          >
            Close
          </button>
        </div>
      )}
    </span>
  );
}
