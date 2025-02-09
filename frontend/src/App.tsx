// src/App.tsx
import React from 'react';
import { WSChooserStore } from './store/GlobalStore';
import { WSChooser } from './components/WSChooser/WSChooser';

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
    </div>
  );
}

export default App;
