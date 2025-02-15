// src/components/WSChooser/WSChooser.tsx
import React, { useEffect } from 'react';
import { SettingsStore } from '../../store/SettingsStore';
import { WSChooserStore } from '../../store/WSChooserStore';

export function Settings(): React.JSX.Element {
  const Settings = SettingsStore();
  const WSChooser = WSChooserStore();

  useEffect(() => {
    Settings.loadApiKeys();
  }, [WSChooser.activeWorkspace]);

  return (
    <div>
      <p onClick={() => Settings.toggleVisibility()}>Settings</p>
      {Settings.isVisible &&
        (Settings.monitor.isLoading ? (
          <p>Settings are loading...</p>
        ) : Settings.monitor.error ? (
          <p>{Settings.monitor.error}</p>
        ) : (
          <div>
            <p>Mouser Api Key</p>
            <input
              placeholder="Mouser Api Key"
              value={Settings.apiKeys?.mouser_api_key || ''}
              type="password"
            />
            <p>Test Mouser Api Key</p>
            <br />
            <p>DigiKey Credentials</p>
            <input
              placeholder="Digikey Client ID"
              value={Settings.apiKeys?.dk_client_id || ''}
              type="password"
            />
            <br />
            <input
              placeholder="Digikey Client Secret"
              value={Settings.apiKeys?.dk_secret || ''}
              type="password"
            />
            <p>Test Digikey Credentials</p>
            <br />
            <span>Analysis Save State </span>
            <input type="checkbox" checked={Settings.analyzeSaveState} />
            <br />
            <span>Analysis Refresh Days </span>
            <input type="number" value={Settings.analysisRefreshDays} min="0" />
          </div>
        ))}
    </div>
  );
}
