// src/App.tsx
import React from 'react';
import { WSChooserStore } from './store/WSChooserStore';
import { WSChooser } from './components/WSChooser/WSChooser';
import { WSCreator } from './components/WSChooser/WSCreator';

function ToggleButton(): React.JSX.Element {
  const toggleVisibility = WSChooserStore((state) => state.toggleVisibility);
  return (
    <button onClick={toggleVisibility}>Toggle WSChooser Visibility</button>
  );
}

function App(): React.JSX.Element {
  return (
    <div>
      <ToggleButton />
      <WSChooser />
      <WSCreator />
    </div>
  );
}

export default App;
