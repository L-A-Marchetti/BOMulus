// src/App.tsx
import React from 'react';
import { WSChooserStore } from './store/GlobalStore';
import { DisplayWSChooser } from './components/WSChooser/WSChooser';

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
      <DisplayWSChooser />
    </div>
  );
}

export default App;
