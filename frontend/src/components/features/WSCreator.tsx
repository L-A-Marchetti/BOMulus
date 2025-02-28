// src/components/WSChooser/WSChooser.tsx
import React from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import DarkCard from '../shared/DarkCard';
import { useShallow } from 'zustand/react/shallow';
import { WSForm } from './WSForm';

export function WSCreator(): React.JSX.Element {
  console.log('WSCreator');
  const { isVisible, toggleVisibility } = WSCreatorStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      toggleVisibility: state.toggleVisibility,
    })),
  );

  const { isVisible: isWSChooserVisible } = WSChooserStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  return isVisible ? (
    <WSForm />
  ) : isWSChooserVisible ? (
    <DarkCard addWs={toggleVisibility} importWs={() => {}} />
  ) : (
    <></>
  );
}
