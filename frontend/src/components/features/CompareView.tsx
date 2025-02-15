// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentRow from '../shared/ComponentRow';

export function CompareView(): React.JSX.Element {
  const CompareView = CompareViewStore();
  const Insert = CompareView.components?.filter(
    (component) => component.Operator === 'INSERT',
  );
  const Update = CompareView.components?.filter(
    (component) => component.Operator === 'UPDATE',
  );
  const Delete = CompareView.components?.filter(
    (component) => component.Operator === 'DELETE',
  );
  const Equal = CompareView.components?.filter(
    (component) => component.Operator === 'EQUAL',
  );

  return CompareView.isVisible ? (
    <>
      {CompareView.monitor.isLoading ? (
        <p>Compare View is loading...</p>
      ) : CompareView.monitor.error ? (
        <p>{CompareView.monitor.error}</p>
      ) : (
        <div>
          <table>
            <tr
              onClick={() => {
                CompareView.toggleOperatorVisibility('INSERT');
              }}
            >
              INSERT{Insert?.length}
            </tr>
            {CompareView.insertIsVisible ? (
              <ComponentRow
                components={Insert}
                isUpdate={false}
                color="LightGreen"
              />
            ) : (
              <></>
            )}
            <tr
              onClick={() => {
                CompareView.toggleOperatorVisibility('UPDATE');
              }}
            >
              UPDATE{Update?.length}
            </tr>
            {CompareView.updateIsVisible ? (
              <ComponentRow
                components={Update}
                isUpdate={true}
                color="MediumPurple"
              />
            ) : (
              <></>
            )}
            <tr
              onClick={() => {
                CompareView.toggleOperatorVisibility('DELETE');
              }}
            >
              DELETE{Delete?.length}
            </tr>
            {CompareView.deleteIsVisible ? (
              <ComponentRow
                components={Delete}
                isUpdate={false}
                color="LightCoral"
              />
            ) : (
              <></>
            )}
            <tr
              onClick={() => {
                CompareView.toggleOperatorVisibility('EQUAL');
              }}
            >
              EQUAL{Equal?.length}
            </tr>
            {CompareView.equalIsVisible ? (
              <ComponentRow
                components={Equal}
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
