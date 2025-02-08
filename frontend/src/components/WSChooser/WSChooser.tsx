import React from 'react';
import { WSChooserStore } from '../../store/GlobalStore';

export function DisplayWSChooser(): React.JSX.Element {
  const isVisible = WSChooserStore((state) => state.isVisible);
  return isVisible ? <WSChooser /> : <></>;
}

export function WSChooser(): React.JSX.Element {
  return (
    <div>
      <h1>Choose a workspace</h1>
    </div>
  );
}
