// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { SettingsStore } from '../../store/SettingsStore';
import { WSChooserStore } from '../../store/WSChooserStore';
import Button from '../shared/Button';
import { CompareViewStore } from '../../store/CompareViewStore';
import { FileManager } from './FileManager';
import { FileManagerStore } from '../../store/FileManagerStore';
import Input from '../shared/Input';
import SpinButton from '../shared/SpinButton';
import Spinner from '../shared/Spinner';

export function Settings(): React.JSX.Element {
  const Settings = SettingsStore();
  const CompareView = CompareViewStore();
  const FileManager = FileManagerStore();

  useEffect(() => {
    Settings.loadSettings();
  }, []);

  return !FileManager.isVisible ? (
    <div className="w-full">
      <Button
        onClick={() => {
          if (CompareView.isVisible) CompareView.toggleVisibility();
          Settings.toggleVisibility();
        }}
        text={Settings.isVisible ? 'Back' : 'Settings'}
        bg="bg-neutral-700"
        bgHover="hover:bg-neutral-900"
        txtColor="text-neutral-400"
        h="h-20"
        img={null}
      />
      {Settings.isVisible &&
        (Settings.monitor.isLoading ? (
          <Spinner text="Settings are loading..." />
        ) : Settings.monitor.error ? (
          <p>{Settings.monitor.error}</p>
        ) : (
          <div className="flex flex-col gap-8 mt-8">
            <div className="flex flex-col gap-4">
              <p className="text-xl">Mouser Api Key</p>
              <Input
                placeHolder="Mouser Api Key"
                type="password"
                onChange={() => {}}
                value={Settings.apiKeys?.mouser_api_key || ''}
                h="h-20"
              />
              <Button
                onClick={() => {}}
                text="Test Mouser Api Key"
                bg="bg-neutral-700"
                bgHover="hover:bg-neutral-900"
                txtColor="text-neutral-400"
                h="h-20"
                img={null}
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xl">DigiKey Credentials</p>
              <Input
                placeHolder="Digikey Client ID"
                type="password"
                onChange={() => {}}
                value={Settings.apiKeys?.dk_client_id || ''}
                h="h-20"
              />
              <Input
                placeHolder="Digikey Client Secret"
                type="password"
                onChange={() => {}}
                value={Settings.apiKeys?.dk_secret || ''}
                h="h-20"
              />
              <Button
                onClick={() => {}}
                text="Test Digikey Credentials"
                bg="bg-neutral-700"
                bgHover="hover:bg-neutral-900"
                txtColor="text-neutral-400"
                h="h-20"
                img={null}
              />
            </div>
            <div className="flex gap-8 items-center jusitfy-center">
              <label className="w-1/2 h-26 rounded-lg border-neutral-700 border inline-flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={Settings.analyzeSaveState}
                  readOnly
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Analysis Save State
                </span>
              </label>
              <div className="w-1/2">
                <SpinButton
                  label={
                    'Analysis Refresh Days: ' +
                    String(Settings.analysisRefreshDays)
                  }
                  more={() => {}}
                  less={() => {}}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  ) : (
    <></>
  );
}
