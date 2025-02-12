import { create } from 'zustand';
import {
  GetRecentWorkspaces,
  SetActiveWorkspace,
  DeleteWorkspace,
} from '../../wailsjs/go/main/App';
import { Workspace } from '../types/ws_interfaces';
import { Monitor } from '../types/global';

interface WSChooserProps {
  workspaces: Workspace[] | null;
  monitor: Monitor;
  activeWorkspace: string | null;
  workspaceToDelete: Workspace | null;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadWorkspaces: () => void;
  setActiveWorkspace: (path: string) => void;
  setWorkspaceToDelete: (workspace: Workspace | null) => void;
  deleteWorkspace: () => void;
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
  setActiveWorkspace: async (path: string) => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      await SetActiveWorkspace(path);
      set({
        activeWorkspace: path,
        monitor: { isLoading: false, error: null },
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
      await DeleteWorkspace(state.workspaceToDelete.workspace_infos.path);
      set({
        workspaceToDelete: null,
        monitor: { isLoading: false, error: null },
      });
      state.loadWorkspaces();
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
