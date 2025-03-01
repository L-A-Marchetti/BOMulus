// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { FunctionManagerStore } from '../../store/FunctionManagerStore';
import Button from '../shared/Button';
import { CompareViewStore } from '../../store/CompareViewStore';
import { FileManagerStore } from '../../store/FileManagerStore';
import { SettingsStore } from '../../store/SettingsStore';
import { useShallow } from 'zustand/react/shallow';
import { UnassignedDesignators } from './UnassignedDesignators';
import { FunctionCreator } from './FunctionCreator';
import { AssignedDesignators } from './AssignedDesignators';

export function FunctionManager(): React.JSX.Element {
  const {
    isVisible: functionManagerIsVisible,
    toggleVisibility: toggleFunctionManagerVisibility,
    saveDesignators,
  } = FunctionManagerStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      toggleVisibility: state.toggleVisibility,
      saveDesignators: state.saveDesignators,
    })),
  );

  const {
    isVisible: compareViewIsVisible,
    toggleVisibility: toggleCompareViewVisibility,
    components,
  } = CompareViewStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
      toggleVisibility: state.toggleVisibility,
      components: state.components,
    })),
  );

  const { isVisible: fileManagerIsVisible } = FileManagerStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  const { isVisible: settingsIsVisible } = SettingsStore(
    useShallow((state) => ({
      isVisible: state.isVisible,
    })),
  );

  useEffect(() => {
    console.log('FunctionManager');
  }, []);

  return (
    <div
      className={
        !fileManagerIsVisible && !settingsIsVisible ? 'w-full' : 'hidden'
      }
    >
      <div
        className={`function_manager ${functionManagerIsVisible ? 'mt-8 px-8' : ''}`}
      >
        <div className="function_manager_buttons">
          <Button
            onClick={() => {
              toggleFunctionManagerVisibility();
              if (
                functionManagerIsVisible &&
                components &&
                !compareViewIsVisible
              )
                toggleCompareViewVisibility();
              else if (!functionManagerIsVisible && compareViewIsVisible)
                toggleCompareViewVisibility();
            }}
            text={functionManagerIsVisible ? 'Back' : 'Function Manager'}
            bg="bg-neutral-700"
            bgHover="hover:bg-neutral-900"
            txtColor="text-neutral-400"
            h="h-15"
            img={null}
          />
          <Button
            onClick={() => {
              saveDesignators();
            }}
            text={'Save'}
            bg="bg-emerald-700"
            bgHover="hover:bg-emerald-900"
            txtColor="text-white"
            h={`h-15 ${functionManagerIsVisible ? '' : 'hidden'}`}
            img={null}
          />
        </div>
        <div className={functionManagerIsVisible ? '' : 'hidden'}>
          <div className="function_manager_left">
            <UnassignedDesignators />
            <ul className="function_manager_right">
              <FunctionCreator />
              <AssignedDesignators />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
