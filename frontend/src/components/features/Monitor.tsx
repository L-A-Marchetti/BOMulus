// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import Spinner from '../shared/Spinner';
import { MonitorStore } from '../../store/MonitorStore';
import Error from '../shared/Error';

export function Monitor(): React.JSX.Element {
  const Monitor = MonitorStore();

  return (
    <>
      {Monitor.isLoading ? (
        <Spinner text={`${Monitor.moduleName} module is loading...`} />
      ) : (
        <></>
      )}
      {Monitor.error ? (
        <Error
          title="Error"
          text={Monitor.error}
          onCancel={() => {
            Monitor.resetMonitor();
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
