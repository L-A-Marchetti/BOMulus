// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { AnalysisStore } from '../../store/AnalysisStore';
import { CompareViewStore } from '../../store/CompareViewStore';

export function Analysis(): React.JSX.Element {
  const Analysis = AnalysisStore();
  const CompareView = CompareViewStore();

  return CompareView.components ? (
    <div>
      <p
        onClick={() => {
          Analysis.runAnalysis();
        }}
      >
        Analyze
      </p>
      {Analysis.monitor.isLoading ? (
        <p>Analysis is loading...</p>
      ) : Analysis.monitor.error ? (
        <p>{Analysis.monitor.error}</p>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}
