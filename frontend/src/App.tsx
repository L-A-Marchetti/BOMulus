// src/App.tsx
import React from 'react';
import { WSChooser } from './components/features/WSChooser';
import { WSCreator } from './components/features/WSCreator';
import { WSCurrent } from './components/features/WSCurrent';
import { FileManager } from './components/features/FileManager';
import { CompareView } from './components/features/CompareView';
import { Analysis } from './components/features/Analysis';
import { Settings } from './components/features/Settings';
import { Filters } from './components/features/Filters';

function App(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center h-screen gap-8">
      <div className="flex w-full max-w-235">
        <WSCreator />
        <div className="w-8"></div>
        <WSChooser />
      </div>
      <WSCurrent />
      {/*<Settings />*/}
      <FileManager />
      <Analysis />
      <Filters />
      <CompareView />
    </div>
  );
}

export default App;
