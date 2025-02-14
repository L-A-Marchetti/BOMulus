// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import ComponentRow from '../shared/ComponentRow';

export function CompareView(): React.JSX.Element {
  const CompareView = CompareViewStore();
  const Insert = CompareView.components?.filter((component) => component.Operator === 'INSERT');
  const Update = CompareView.components?.filter((component) => component.Operator === 'UPDATE');
  const Delete = CompareView.components?.filter((component) => component.Operator === 'DELETE');
  const Equal = CompareView.components?.filter((component) => component.Operator === 'EQUAL');

  return CompareView.isVisible ? (
    <div>
      <table>
        <p>INSERT{Insert?.length}</p>
        <ComponentRow components={Insert} isUpdate={false} color='LightGreen'/>
        <p>UPDATE{Update?.length}</p>
        <ComponentRow components={Update} isUpdate={true} color='MediumPurple'/>
        <p>DELETE{Delete?.length}</p>
        <ComponentRow components={Delete} isUpdate={false} color='LightCoral'/>
        <p>EQUAL{Equal?.length}</p>
        <ComponentRow components={Equal} isUpdate={false} color='LightGray'/>
      </table>
    </div>
  ) : (
    <></>
  );
}
