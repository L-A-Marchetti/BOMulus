// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { WSCreatorStore } from '../../store/WSCreatorStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import { FileManagerStore } from '../../store/FileManagerStore';
import { CompareViewStore } from '../../store/CompareViewStore';
import Banner from '../shared/Banner';
import { SettingsStore } from '../../store/SettingsStore';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';
import { CalculatorStore } from '../../store/CalculatorStore';
import { AnalysisStore } from '../../store/AnalysisStore';
import { useShallow } from 'zustand/react/shallow';

export function WSCurrent(): React.JSX.Element {
  const { activeWorkspace, WSManagerIsVisible, loadWorkspaces } =
    WSChooserStore(
      useShallow((state) => ({
        activeWorkspace: state.activeWorkspace,
        WSManagerIsVisible: state.WSManagerIsVisible,
        loadWorkspaces: state.loadWorkspaces,
      })),
    );

  const {
    isVisible: isFileManagerVisible,
    reset: resetFileManager,
    toggleVisibility: toggleFileManagerVisibility,
  } = FileManagerStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      reset: state.reset,
      toggleVisibility: state.toggleVisibility,
    })),
  );

  const {
    isVisible: isCompareViewVisible,
    reset: resetCompareView,
    toggleVisibility: toggleCompareViewVisibility,
  } = CompareViewStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      reset: state.reset,
      toggleVisibility: state.toggleVisibility,
    })),
  );

  const { isVisible: isSettingsVisible } = SettingsStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  const { isVisible: isFunctionManagerVisible, reset: resetFunctionManager } =
    FunctionManagerStore(
      useShallow((state) => ({
        isVisible: state.isVisible,
        reset: state.reset,
      })),
    );

  const { reset: resetCalculator } = CalculatorStore(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );

  const { reset: resetAnalysis } = AnalysisStore(
    useShallow((state) => ({
      reset: state.reset,
    })),
  );

  useEffect(() => {
    console.log('WSCurrent');
  }, []);

  return (
    <div
      className={
        !WSManagerIsVisible &&
        !isFileManagerVisible &&
        !isSettingsVisible &&
        !isFunctionManagerVisible
          ? ''
          : 'hidden'
      }
    >
      <Banner
        workspaceName={activeWorkspace?.workspace_infos.name || ''}
        onClick={() => {
          loadWorkspaces();
          {
            isFileManagerVisible ? toggleFileManagerVisibility() : {};
            isCompareViewVisible ? toggleCompareViewVisibility() : {};
          }
          resetFunctionManager();
          resetFileManager();
          resetCompareView();
          resetCalculator();
          resetAnalysis();
        }}
      />
    </div>
  );
}
