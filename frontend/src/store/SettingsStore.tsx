import { create } from 'zustand';
import {
  GetSavedAPIKeys,
  GetAnalyzeSaveState,
  GetAnalysisRefreshDays,
} from '../../wailsjs/go/main/App';
import { workspaces } from '../../wailsjs/go/models';
import { MonitorStore } from './MonitorStore';

type APIKeys = workspaces.APIKeys;

interface SettingsProps {
  apiKeys: APIKeys | null;
  isVisible: boolean;
  analyzeSaveState: boolean;
  analysisRefreshDays: number;
  toggleVisibility: () => void;
  loadSettings: () => void;
}

export const SettingsStore = create<SettingsProps>((set) => ({
  apiKeys: null,
  isVisible: false,
  analyzeSaveState: false,
  analysisRefreshDays: 0,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadSettings: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Setting Panel', null);
    try {
      const apiKeys: APIKeys = await GetSavedAPIKeys();
      const analyzeSaveState: boolean = await GetAnalyzeSaveState();
      const analysisRefreshDays: number = await GetAnalysisRefreshDays();
      Monitor.setMonitor(false, 'Setting Panel', null);
      set({
        apiKeys,
        analyzeSaveState,
        analysisRefreshDays,
      });
    } catch (err) {
      Monitor.setMonitor(false, 'Setting Panel', String(err));
    }
  },
}));
