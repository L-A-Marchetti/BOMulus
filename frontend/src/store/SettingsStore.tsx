import { create } from 'zustand';
import {
  GetSavedAPIKeys,
  GetAnalyzeSaveState,
  GetAnalysisRefreshDays,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { workspaces } from '../../wailsjs/go/models';

type APIKeys = workspaces.APIKeys;

interface SettingsProps {
  apiKeys: APIKeys | null;
  monitor: Monitor;
  isVisible: boolean;
  analyzeSaveState: boolean;
  analysisRefreshDays: number;
  toggleVisibility: () => void;
  loadSettings: () => void;
}

export const SettingsStore = create<SettingsProps>((set) => ({
  apiKeys: null,
  monitor: { isLoading: false, error: null },
  isVisible: false,
  analyzeSaveState: false,
  analysisRefreshDays: 0,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadSettings: async () => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      const apiKeys: APIKeys = await GetSavedAPIKeys();
      const analyzeSaveState: boolean = await GetAnalyzeSaveState();
      const analysisRefreshDays: number = await GetAnalysisRefreshDays();
      set({
        apiKeys,
        analyzeSaveState,
        analysisRefreshDays,
        monitor: { isLoading: false, error: null },
      });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
