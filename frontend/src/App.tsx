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
import { WSCreatorStore } from './store/WSCreatorStore';
import { Calculator } from './components/features/Calculator';
import { FunctionManager } from './components/features/FunctionManager';
import { FileManagerStore } from './store/FileManagerStore';
import { Monitor } from './components/features/Monitor';
import { useShallow } from 'zustand/react/shallow';

function App(): React.JSX.Element {
  console.log('App');
  const WSManagerIsVisible = WSChooserStore(
    useShallow((state) => state.WSManagerIsVisible),
  );
  //const FileManagerPadding = FileManagerStore(useShallow((state) => state.filesToValidate));

  return (
    <div className="app">
      {WSManagerIsVisible ? (
        <div className="workspace_manager">
          <WSCreator />
          <WSChooser />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8">
          <WSCurrent />
          <div className={`w-full flex gap-8 items-center justify-center`}>
            <FileManager />
            {/* <FunctionManager />
            <Analysis />
            <Settings /> */}
          </div>
          {/* <Calculator />
          <Filters />
          <CompareView /> */}
        </div>
      )}
      <Monitor />
    </div>
  );
}

export default App;
