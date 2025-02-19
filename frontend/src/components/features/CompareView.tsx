// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentRow from '../shared/ComponentRow';
import { AnalysisStore } from '../../store/AnalysisStore';
import Table from '../shared/Table';

export function CompareView(): React.JSX.Element {
  const CompareView = CompareViewStore();
  const Analysis = AnalysisStore();

  return CompareView.isVisible ? (
    <>
      {CompareView.monitor.isLoading && !Analysis.analysisStatus ? (
        <p>Compare View is loading...</p>
      ) : CompareView.monitor.error && !Analysis.analysisStatus ? (
        <p>{CompareView.monitor.error}</p>
      ) : (
        <div className="flex flex-col gap-8">
          {CompareView.insertIsVisible && CompareView.insert ? (
            <Table
              components={CompareView.filterComponents(CompareView.insert)}
              isUpdate={false}
              color="bg-emerald-900"
            />
          ) : (
            <></>
          )}
          {CompareView.updateIsVisible && CompareView.update ? (
            <Table
              components={CompareView.filterComponents(CompareView.update)}
              isUpdate={true}
              color="bg-purple-900"
            />
          ) : (
            <></>
          )}
          {CompareView.deleteIsVisible && CompareView.delete ? (
            <Table
              components={CompareView.filterComponents(CompareView.delete)}
              isUpdate={false}
              color="bg-rose-900"
            />
          ) : (
            <></>
          )}
          {CompareView.equalIsVisible && CompareView.equal ? (
            <Table
              components={CompareView.filterComponents(CompareView.equal)}
              isUpdate={false}
              color="bg-neutral-700"
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  ) : (
    <></>
  );
}
