// src/App.tsx
import React from 'react';
import { WSChooserStore } from './store/WSChooserStore';
import { WSChooser } from './components/features/WSChooser';
import { WSCreator } from './components/features/WSCreator';

function App(): React.JSX.Element {
  return (
    <div>
      <WSChooser />
      <WSCreator />
    </div>
  );
}

export default App;
