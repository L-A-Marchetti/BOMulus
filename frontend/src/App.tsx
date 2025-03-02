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
import { WSChooserStore } from './store/WSChooserStore';
import { Calculator } from './components/features/Calculator';
import { FunctionManager } from './components/features/FunctionManager';
import { Monitor } from './components/features/Monitor';
import { useShallow } from 'zustand/react/shallow';

function App(): React.JSX.Element {
  console.log('App');
  const WSManagerIsVisible = WSChooserStore(
    useShallow((state) => state.WSManagerIsVisible),
  );

  return (
    <div className="app">
      {WSManagerIsVisible ? (
        <div className="workspace_manager">
          <WSCreator />
          <WSChooser />
        </div>
      ) : (
        <div className="compare_view">
          <WSCurrent />
          <div className="menu">
            <FileManager />
            <FunctionManager />
            <Analysis />
            <Settings />
          </div>
          <Calculator />
          <Filters />
          <CompareView />
        </div>
      )}
      <Monitor />
    </div>
  );
}

export default App;
