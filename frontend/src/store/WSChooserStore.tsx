import { create } from 'zustand';
import {
  GetRecentWorkspaces,
  SetActiveWorkspace,
} from '../../wailsjs/go/main/App';
import { Workspace } from '../types/ws_interfaces';
import { Monitor } from '../types/global';

interface WSChooserProps {
  workspaces: Workspace[];
  workspacesMonitor: Monitor;
  activeWorkspace: string;
  activeWorkspaceMonitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadWorkspaces: () => void;
  setActiveWorkspace: (path: string) => void;
}

export const WSChooserStore = create<WSChooserProps>((set) => ({
  workspaces: [],
  workspacesMonitor: { isLoading: false, error: '' },
  activeWorkspace: '',
  activeWorkspaceMonitor: { isLoading: false, error: '' },
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadWorkspaces: async () => {
    set({ workspacesMonitor: { isLoading: true, error: '' } });
    try {
      const workspaces: Workspace[] = await GetRecentWorkspaces();
      set({ workspaces, workspacesMonitor: { isLoading: false, error: '' } });
    } catch (err) {
      set({ workspacesMonitor: { isLoading: false, error: String(err) } });
    }
  },
  setActiveWorkspace: async (path: string) => {
    set({ activeWorkspaceMonitor: { isLoading: true, error: '' } });
    try {
      await SetActiveWorkspace(path);
      set({
        activeWorkspace: path,
        activeWorkspaceMonitor: { isLoading: false, error: '' },
      });
    } catch (err) {
      set({ activeWorkspaceMonitor: { isLoading: false, error: String(err) } });
    }
  },
}));
