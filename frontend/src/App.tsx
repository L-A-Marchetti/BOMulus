// src/App.tsx
import React from 'react';
import { WSChooser } from './components/features/WSChooser';
import { WSCreator } from './components/features/WSCreator';
import { WSCurrent } from './components/features/WSCurrent';
import { FileManager } from './components/features/FileManager';
import { CompareView } from './components/features/CompareView';
import { Analysis } from './components/features/Analysis';
import { Settings } from './components/features/Settings';

function App(): React.JSX.Element {
  return (
    <div>
      <WSChooser />
      <WSCreator />
      <WSCurrent />
      <Settings />
      <FileManager />
      <Analysis />
      <CompareView />
    </div>
  );
}

export default App;
