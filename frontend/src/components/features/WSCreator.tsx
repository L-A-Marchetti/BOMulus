// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import DarkCard from '../shared/DarkCard';
import { useShallow } from 'zustand/react/shallow';
import { WSForm } from './WSForm';

export function WSCreator(): React.JSX.Element {
  const { toggleVisibility } = WSCreatorStore(
    useShallow((state) => ({
      toggleVisibility: state.toggleVisibility,
    })),
  );

  useEffect(() => {
    console.log('WSCreator');
  }, []);

  return (
    <>
      <WSForm />
      <DarkCard addWs={toggleVisibility} importWs={() => {}} />
    </>
  );
}
