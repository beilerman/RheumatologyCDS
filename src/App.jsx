import { useState } from 'react';
import { useVisitState, SECTIONS } from './hooks/useVisitState.js';

import { Header } from './components/layout/Header.jsx';
import { ProgressBar } from './components/layout/ProgressBar.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';

import { ConditionSelector } from './components/conditions/ConditionSelector.jsx';
import { RAModule } from './components/conditions/RheumatoidArthritis/RAModule.jsx';
import { GoutModule } from './components/conditions/Gout/GoutModule.jsx';

import { RecommendationCard } from './components/shared/RecommendationCard.jsx';
import { AlertBanner } from './components/shared/AlertBanner.jsx';
import { VisitSummaryGenerator } from './components/export/VisitSummaryGenerator.jsx';

const SECTION_LABELS = {
  'condition-select': 'Condition',
  symptoms: 'Symptoms',
  scoring: 'Scoring',
  medications: 'Medications',
  monitoring: 'Monitoring',
  recommendations: 'Recommendations',
  escalation: 'Escalation',
  summary: 'Summary',
};

function MainContent({ state, dispatch }) {
  const { condition, currentSection, answers, scores, medications, monitoringStatus, recommendations, escalation } = state;

  if (currentSection === 'condition-select') {
    return <ConditionSelector dispatch={dispatch} />;
  }

  if (currentSection === 'recommendations') {
    return (
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
          Recommendations
        </h2>
        {recommendations.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No recommendations generated yet. Complete the symptoms and scoring sections first.
          </p>
        ) : (
          recommendations.map((rec) => <RecommendationCard key={rec.id} rec={rec} />)
        )}
      </div>
    );
  }

  if (currentSection === 'escalation') {
    return (
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-4">
          Escalation Assessment
        </h2>
        <AlertBanner level={escalation.level} flags={escalation.flags} />
      </div>
    );
  }

  if (currentSection === 'summary') {
    return <VisitSummaryGenerator state={state} />;
  }

  if (condition === 'ra') {
    return (
      <RAModule
        currentSection={currentSection}
        answers={answers}
        scores={scores}
        medications={medications}
        monitoringStatus={monitoringStatus}
        dispatch={dispatch}
      />
    );
  }

  if (condition === 'gout') {
    return (
      <GoutModule
        currentSection={currentSection}
        answers={answers}
        medications={medications}
        monitoringStatus={monitoringStatus}
        dispatch={dispatch}
      />
    );
  }

  return (
    <div className="text-sm text-gray-500 italic">
      Select a condition to begin.
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useVisitState();
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const { currentSection, sectionStatus, condition, recommendations, escalation } = state;

  const currentIdx = SECTIONS.indexOf(currentSection);
  const canAdvance = currentIdx < SECTIONS.length - 1;
  const canGoBack = currentIdx > 0;

  const goNext = () => {
    if (canAdvance) {
      dispatch({ type: 'SET_SECTION', payload: SECTIONS[currentIdx + 1] });
    }
  };

  const goBack = () => {
    if (canGoBack) {
      dispatch({ type: 'SET_SECTION', payload: SECTIONS[currentIdx - 1] });
    }
  };

  const goToSummary = () => {
    dispatch({ type: 'SET_SECTION', payload: 'summary' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Header condition={condition} />
      <ProgressBar sectionStatus={sectionStatus} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentSection={currentSection}
          sectionStatus={sectionStatus}
          condition={condition}
          dispatch={dispatch}
        />

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-6 pb-20">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-4">
              {SECTION_LABELS[currentSection] || currentSection}
            </h2>
            <MainContent state={state} dispatch={dispatch} />

            {/* Navigation buttons */}
            {condition && (
              <div className="flex gap-3 mt-6">
                {canGoBack && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                {canAdvance && currentSection !== 'summary' && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded text-sm hover:opacity-90 transition-opacity"
                  >
                    Next Section
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Right panel */}
        <aside
          className={`flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto transition-all duration-200 ${
            rightPanelOpen ? 'w-72' : 'w-10'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            {rightPanelOpen && (
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Live Preview
              </span>
            )}
            <button
              type="button"
              onClick={() => setRightPanelOpen((v) => !v)}
              className="text-gray-400 hover:text-gray-600 ml-auto"
              aria-label={rightPanelOpen ? 'Collapse panel' : 'Expand panel'}
            >
              {rightPanelOpen ? '›' : '‹'}
            </button>
          </div>

          {rightPanelOpen && (
            <div className="p-3 space-y-4">
              {condition && (
                <>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Escalation
                    </p>
                    <AlertBanner level={escalation.level} flags={escalation.flags} />
                  </div>

                  {recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Top Recommendations
                      </p>
                      {recommendations.slice(0, 5).map((rec) => (
                        <RecommendationCard key={rec.id} rec={rec} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Sticky footer */}
      {condition && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-end shadow-md z-10">
          <button
            type="button"
            onClick={goToSummary}
            className="px-5 py-2 bg-[var(--color-primary)] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Generate Visit Summary
          </button>
        </footer>
      )}
    </div>
  );
}
