import { create } from 'zustand';
import { RunAnalysis, GetAnalysisState } from '../../wailsjs/go/main/App';
import { WSChooserStore } from './WSChooserStore';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';
import { MonitorStore } from './MonitorStore';

type AnalysisStatus = core.AnalysisStatus;

interface AnalysisProps {
  analysisStatus: AnalysisStatus | null;
  runAnalysis: () => void;
  getAnalysisStatus: () => Promise<void>;
  reset: () => void;
}

export const AnalysisStore = create<AnalysisProps>((set) => ({
  analysisStatus: null,
  runAnalysis: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(false, 'Analysis', null);
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return Monitor.setMonitor(
        false,
        'Analysis',
        'No active workspace found...',
      );
    try {
      RunAnalysis(activeWorkspace);
      const refresh = setInterval(async () => {
        await AnalysisStore.getState().getAnalysisStatus();
        if (AnalysisStore.getState().analysisStatus?.Completed) {
          clearInterval(refresh);
          Monitor.setMonitor(false, 'Analysis', null);
        }
      }, 500);
    } catch (err) {
      Monitor.setMonitor(false, 'Analysis', String(err));
    }
  },
  getAnalysisStatus: async () => {
    const Monitor = MonitorStore.getState();
    try {
      const analysisStatus: AnalysisStatus = await GetAnalysisState();
      CompareViewStore.getState().loadComponents();
      const errors = [analysisStatus.DigikeyErr, analysisStatus.MouserErr]
        .filter(Boolean)
        .join(' | ');
      Monitor.setMonitor(false, 'Analysis', errors || null);
      set({ analysisStatus });
    } catch (err) {
      Monitor.setMonitor(false, 'Analysis', String(err));
    }
  },
  reset: () => set({ analysisStatus: null }),
}));
