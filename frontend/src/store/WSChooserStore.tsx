import { create } from 'zustand';
import {
  GetRecentWorkspaces,
  SetActiveWorkspace,
  DeleteWorkspace,
} from '../../wailsjs/go/main/App';
import { workspaces } from '../../wailsjs/go/models';
type Workspace = workspaces.Workspace;
import { Monitor } from '../types/global';

interface WSChooserProps {
  workspaces: Workspace[] | null;
  monitor: Monitor;
  activeWorkspace: Workspace | null;
  workspaceToDelete: Workspace | null;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadWorkspaces: () => void;
  setActiveWorkspace: (workspace: Workspace) => void;
  setWorkspaceToDelete: (workspace: Workspace | null) => void;
  deleteWorkspace: () => void;
  resetMonitor: () => void;
}

export const WSChooserStore = create<WSChooserProps>((set) => ({
  workspaces: null,
  monitor: { isLoading: false, error: null },
  activeWorkspace: null,
  workspaceToDelete: null,
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadWorkspaces: async () => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      const workspaces: Workspace[] = await GetRecentWorkspaces();
      set({ workspaces, monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  setActiveWorkspace: async (workspace) => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      await SetActiveWorkspace(workspace);
      set({
        activeWorkspace: workspace,
        monitor: { isLoading: false, error: null },
        isVisible: false,
      });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  setWorkspaceToDelete: (workspace) => set({ workspaceToDelete: workspace }),
  deleteWorkspace: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const state = WSChooserStore.getState();
    if (!state.workspaceToDelete) return;
    try {
      await DeleteWorkspace(state.workspaceToDelete);
      set({
        workspaceToDelete: null,
        monitor: { isLoading: false, error: null },
      });
      state.loadWorkspaces();
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  resetMonitor: () => set({ monitor: { isLoading: false, error: null } }),
}));
