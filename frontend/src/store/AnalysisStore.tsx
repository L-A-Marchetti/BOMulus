import { create } from 'zustand';
import { RunAnalysis, GetAnalysisState } from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { core } from '../../wailsjs/go/models';

type AnalysisStatus = core.AnalysisStatus;

interface AnalysisProps {
  analysisStatus: AnalysisStatus | null;
  monitor: Monitor;
  runAnalysis: () => void;
  getAnalysisStatus: () => void;
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
      await RunAnalysis(activeWorkspace);
      set({ monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  getAnalysisStatus: async () => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      const analysisStatus: AnalysisStatus = await GetAnalysisState();
      set({
        analysisStatus,
        monitor: {
          isLoading: false,
          error: analysisStatus.DigikeyErr
            ? analysisStatus.DigikeyErr
            : analysisStatus.MouserErr
              ? analysisStatus.MouserErr
              : null,
        },
      });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
