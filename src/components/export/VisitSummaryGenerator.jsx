import { ExportSummary } from '../shared/ExportSummary.jsx';

export function VisitSummaryGenerator({ state }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-1">
        Visit Summary
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Review and copy the generated visit note. All fields can be edited before pasting into your EHR.
      </p>
      <ExportSummary state={state} />
    </div>
  );
}
