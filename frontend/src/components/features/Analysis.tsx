// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { AnalysisStore } from '../../store/AnalysisStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Button from '../shared/Button';

export function Analysis(): React.JSX.Element {
  const Analysis = AnalysisStore();
  const CompareView = CompareViewStore();

  return CompareView.components && CompareView.isVisible ? (
    <div className="w-full">
      <Button
        onClick={Analysis.runAnalysis}
        text={
          Analysis.monitor.isLoading && Analysis.analysisStatus?.Progress
            ? Math.round(Analysis.analysisStatus?.Progress) + ' %'
            : 'Analyze'
        }
        bg="bg-neutral-700"
        bgHover="hover:bg-neutral-900"
        txtColor="text-neutral-400"
        h="h-20"
        img={null}
      />
      {Analysis.monitor.isLoading ? (
        <p>
          Analysis is loading...
          {Analysis.analysisStatus?.Progress
            ? Math.round(Analysis.analysisStatus?.Progress) + ' %'
            : ''}
        </p>
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
