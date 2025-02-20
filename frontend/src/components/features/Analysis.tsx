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
      {Analysis.monitor.isLoading && Analysis.analysisStatus?.Progress ? (
        <div className="w-full h-20 bg-neutral-200 rounded-lg dark:bg-neutral-700">
          <div
            className="flex items-center justify-center h-20 bg-neutral-600 text-xs font-medium text-neutral-100 text-center p-0.5 leading-none rounded-lg"
            style={{
              width: Math.round(Analysis.analysisStatus?.Progress / 2) + '%',
            }}
          >
            <div>
              {Math.round(Analysis.analysisStatus?.Progress / 2) + ' %'}
            </div>
          </div>
        </div>
      ) : Analysis.monitor.error ? (
        <p>{Analysis.monitor.error}</p>
      ) : (
        <Button
          onClick={Analysis.runAnalysis}
          text="Analyze"
          bg="bg-neutral-700"
          bgHover="hover:bg-neutral-900"
          txtColor="text-neutral-400"
          h="h-20"
          img={null}
        />
      )}
    </div>
  ) : (
    <></>
  );
}
