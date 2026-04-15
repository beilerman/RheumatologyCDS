import { useState } from 'react';
import { formatVisitSummary } from '../../utils/exportFormatter.js';

export function ExportSummary({ state }) {
  const [copied, setCopied] = useState(false);

  const text = formatVisitSummary(state);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded text-sm hover:opacity-90 transition-opacity"
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
      </div>
      <pre className="bg-gray-50 border border-gray-200 rounded p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
        {text}
      </pre>
    </div>
  );
}
