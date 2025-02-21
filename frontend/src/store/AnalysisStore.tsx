import { create } from 'zustand';
import { RunAnalysis, GetAnalysisState } from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';

type AnalysisStatus = core.AnalysisStatus;

interface AnalysisProps {
  analysisStatus: AnalysisStatus | null;
  monitor: Monitor;
  runAnalysis: () => void;
  getAnalysisStatus: () => Promise<void>;
}

export const AnalysisStore = create<AnalysisProps>((set) => ({
  analysisStatus: null,
  monitor: { isLoading: false, error: null },
  runAnalysis: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      RunAnalysis(activeWorkspace);
      const refresh = setInterval(async () => {
        await AnalysisStore.getState().getAnalysisStatus();
        if (AnalysisStore.getState().analysisStatus?.Completed) {
          clearInterval(refresh);
          set({ monitor: { isLoading: false, error: null } });
        }
      }, 100);
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  getAnalysisStatus: async () => {
    try {
      const analysisStatus: AnalysisStatus = await GetAnalysisState();
      CompareViewStore.getState().loadComponents();
      const errors = [analysisStatus.DigikeyErr, analysisStatus.MouserErr]
        .filter(Boolean)
        .join(' | ');
      set({
        analysisStatus,
        monitor: {
          isLoading: errors ? false : true,
          error: errors || null,
        },
      });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
