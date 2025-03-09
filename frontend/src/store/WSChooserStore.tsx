import { create } from 'zustand';
import {
  GetRecentWorkspaces,
  SetActiveWorkspace,
  DeleteWorkspace,
} from '../../wailsjs/go/main/App';
import { workspaces } from '../../wailsjs/go/models';
type Workspace = workspaces.Workspace;
import { MonitorStore } from './MonitorStore';
import { SettingsStore } from './SettingsStore';

interface WSChooserProps {
  workspaces: Workspace[] | null;
  activeWorkspace: Workspace | null;
  workspaceToDelete: Workspace | null;
  isVisible: boolean;
  WSManagerIsVisible: boolean;
  toggleVisibility: () => void;
  toggleWSMVisibility: () => void;
  loadWorkspaces: () => void;
  setActiveWorkspace: (workspace: Workspace) => void;
  setWorkspaceToDelete: (workspace: Workspace | null) => void;
  deleteWorkspace: () => void;
}

export const WSChooserStore = create<WSChooserProps>((set) => ({
  workspaces: null,
  activeWorkspace: null,
  workspaceToDelete: null,
  isVisible: true,
  WSManagerIsVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  toggleWSMVisibility: () =>
    set((state) => ({ WSManagerIsVisible: !state.WSManagerIsVisible })),
  loadWorkspaces: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Workspace', null);
    try {
      const workspaces: Workspace[] = await GetRecentWorkspaces();
      Monitor.setMonitor(false, 'Workspace', null);
      set({ workspaces, isVisible: true, WSManagerIsVisible: true });
    } catch (err) {
      Monitor.setMonitor(false, 'Workspace', String(err));
    }
  },
  setActiveWorkspace: async (workspace) => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Workspace', null);
    try {
      await SetActiveWorkspace(workspace);
      Monitor.setMonitor(false, 'Workspace', null);
      SettingsStore.getState().loadSettings();
      set({
        activeWorkspace: workspace,
        isVisible: false,
        WSManagerIsVisible: false,
      });
    } catch (err) {
      Monitor.setMonitor(true, 'Workspace', String(err));
    }
  },
  setWorkspaceToDelete: (workspace) => set({ workspaceToDelete: workspace }),
  deleteWorkspace: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Workspace', null);
    const state = WSChooserStore.getState();
    if (!state.workspaceToDelete) return;
    try {
      await DeleteWorkspace(state.workspaceToDelete);
      Monitor.setMonitor(false, 'Workspace', null);
      set({ workspaceToDelete: null });
      state.loadWorkspaces();
    } catch (err) {
      Monitor.setMonitor(false, 'Workspace', String(err));
    }
  },
}));
