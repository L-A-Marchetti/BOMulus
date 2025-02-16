// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentRow from '../shared/ComponentRow';
import { AnalysisStore } from '../../store/AnalysisStore';
import { Filters } from './Filters';

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
        <div>
          <table>
            {CompareView.insertIsVisible && CompareView.insert ? (
              <ComponentRow
                components={CompareView.insert}
                isUpdate={false}
                color="LightGreen"
              />
            ) : (
              <></>
            )}
            {CompareView.updateIsVisible && CompareView.update ? (
              <ComponentRow
                components={CompareView.update}
                isUpdate={true}
                color="MediumPurple"
              />
            ) : (
              <></>
            )}
            {CompareView.deleteIsVisible && CompareView.delete ? (
              <ComponentRow
                components={CompareView.delete}
                isUpdate={false}
                color="LightCoral"
              />
            ) : (
              <></>
            )}
            {CompareView.equalIsVisible && CompareView.equal ? (
              <ComponentRow
                components={CompareView.equal}
                isUpdate={false}
                color="LightGray"
              />
            ) : (
              <></>
            )}
          </table>
        </div>
      )}
    </>
  ) : (
    <></>
  );
}
