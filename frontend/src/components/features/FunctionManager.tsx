// src/components/WSChooser/WSChooser.tsx
import React from 'react';
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
  console.log('FunctionManager');
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

  return !fileManagerIsVisible && !settingsIsVisible ? (
    <>
      <div
        className={`function_manager ${functionManagerIsVisible ? 'mt-8' : ''}`}
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
          {functionManagerIsVisible ? (
            <Button
              onClick={() => {
                saveDesignators();
              }}
              text={'Save'}
              bg="bg-emerald-700"
              bgHover="hover:bg-emerald-900"
              txtColor="text-white"
              h="h-15"
              img={null}
            />
          ) : (
            <></>
          )}
        </div>
        {functionManagerIsVisible ? (
          <>
            <div className="function_manager_left">
              <UnassignedDesignators />
              <ul className="function_manager_right">
                <FunctionCreator />
                <AssignedDesignators />
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <></>
  );
}
