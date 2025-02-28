// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import { AnalysisStore } from '../../store/AnalysisStore';
import Table from '../shared/Table';
import Spinner from '../shared/Spinner';
import { CalculatorStore } from '../../store/CalculatorStore';

export function CompareView(): React.JSX.Element {
  const CompareView = CompareViewStore();
  const Analysis = AnalysisStore();
  const Calculator = CalculatorStore();
  console.log(CompareView);

  return CompareView.isVisible ? (
    <>
      {CompareView.monitor.error &&
      !Analysis.analysisStatus &&
      !Calculator.monitor.isLoading ? (
        <p>{CompareView.monitor.error}</p>
      ) : (
        <>
          {CompareView.monitor.isLoading &&
          !Analysis.analysisStatus &&
          !Calculator.monitor.isLoading ? (
            <Spinner text="Compare View is loading..." />
          ) : (
            <></>
          )}
          <Table />
        </>
      )}
    </>
  ) : (
    <></>
  );
}
