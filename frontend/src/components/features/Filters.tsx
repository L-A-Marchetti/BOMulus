// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';

export function Filters(): React.JSX.Element {
  const CompareView = CompareViewStore();

  return CompareView.isVisible ? (
    <>
      <div>
        <span
          style={{ backgroundColor: 'LightGreen' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('INSERT');
          }}
        >
          {CompareView.insert?.length}
        </span>{' '}
        <span
          style={{ backgroundColor: 'MediumPurple' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('UPDATE');
          }}
        >
          {CompareView.update?.length}
        </span>{' '}
        <span
          style={{ backgroundColor: 'LightCoral' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('DELETE');
          }}
        >
          {CompareView.delete?.length}
        </span>{' '}
        <span
          style={{ backgroundColor: 'LightGray' }}
          onClick={() => {
            CompareView.toggleOperatorVisibility('EQUAL');
          }}
        >
          {CompareView.equal?.length}
        </span>{' '}
      </div>
    </>
  ) : (
    <></>
  );
}
