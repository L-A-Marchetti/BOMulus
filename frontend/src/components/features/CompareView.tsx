// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { CompareViewStore } from '../../store/CompareViewStore';
import Table from '../shared/Table';
import { useShallow } from 'zustand/react/shallow';

export function CompareView(): React.JSX.Element {
  const { isVisible } = CompareViewStore(
    useShallow((state) => ({ isVisible: state.isVisible })),
  );

  useEffect(() => {
    console.log('CompareView');
  }, []);

  return (
    <div className={isVisible ? '' : 'hidden'}>
      <Table />
    </div>
  );
}
