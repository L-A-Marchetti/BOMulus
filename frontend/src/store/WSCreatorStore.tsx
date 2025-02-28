import { create } from 'zustand';
import {
  OpenDirectoryDialog,
  CreateWorkspace,
} from '../../wailsjs/go/main/App';
import { WSChooserStore } from './WSChooserStore';
import { MonitorStore } from './MonitorStore';

interface WSCreatorProps {
  workspaceName: string | null;
  workspacePath: string | null;
  isVisible: boolean;
  toggleVisibility: () => void;
  setWorkspaceName: (name: string) => void;
  chooseDirectory: () => void;
  createWorkspace: () => void;
}

export const WSCreatorStore = create<WSCreatorProps>((set) => ({
  workspaceName: null,
  workspacePath: null,
  isVisible: false,
  toggleVisibility: () => {
    set((state) => ({ isVisible: !state.isVisible }));
    WSChooserStore.getState().toggleVisibility();
  },
  setWorkspaceName: (name: string) => set({ workspaceName: name }),
  chooseDirectory: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Workspace Creator', null);
    try {
      const workspacePath: string = await OpenDirectoryDialog();
      Monitor.setMonitor(false, 'Workspace Creator', null);
      set({ workspacePath });
    } catch (err) {
      Monitor.setMonitor(true, 'Workspace Creator', String(err));
    }
  },
  createWorkspace: async () => {
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Workspace Creator', null);
    const state = WSCreatorStore.getState();
    if (!state.workspaceName || !state.workspacePath)
      return Monitor.setMonitor(
        false,
        'Workspace Creator',
        'Please select a directory and enter a workspace name.',
      );
    try {
      await CreateWorkspace(state.workspacePath, state.workspaceName);
      Monitor.setMonitor(false, 'Workspace Creator', null);
      set({ isVisible: false });
      WSChooserStore.getState().loadWorkspaces();
    } catch (err) {
      Monitor.setMonitor(true, 'Workspace Creator', null);
    }
  },
}));
