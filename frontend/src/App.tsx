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

function App(): React.JSX.Element {
  const WSChoose = WSChooserStore();
  const WSCreate = WSCreatorStore();
  return (
    <div className="flex items-center justify-center min-h-screen gap-8 scale-95 origin-top">
      {WSChoose.isVisible || WSCreate.isVisible ? (
        <div className="flex w-full max-w-235">
          <WSCreator />
          <WSChooser />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8">
          <WSCurrent />
          <div className="w-full flex gap-8 items-center justify-center">
            <FileManager />
            <Analysis />
            <Settings />
          </div>
          {/*<Filters />*/}
          <CompareView />
        </div>
      )}
    </div>
  );
}

export default App;
