// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import { AnalysisStore } from '../../store/AnalysisStore';
import Table from '../shared/Table';
import Spinner from '../shared/Spinner';

export function CompareView(): React.JSX.Element {
  const CompareView = CompareViewStore();
  const Analysis = AnalysisStore();

  return CompareView.isVisible ? (
    <>
      {CompareView.monitor.isLoading && !Analysis.analysisStatus ? (
        <Spinner text="Compare View is loading..." />
      ) : CompareView.monitor.error && !Analysis.analysisStatus ? (
        <p>{CompareView.monitor.error}</p>
      ) : (
        <Table />
      )}
    </>
  ) : (
    <></>
  );
}
