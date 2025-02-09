import { create } from 'zustand';
import {
  OpenDirectoryDialog,
  CreateWorkspace,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';

interface WSCreatorProps {
  workspaceName: string;
  workspacePath: string;
  createWorkspaceMonitor: Monitor;
  chooseDirectoryMonitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  setWorkspaceName: (name: string) => void;
  chooseDirectory: () => void;
  createWorkspace: () => void;
}

export const WSCreatorStore = create<WSCreatorProps>((set) => ({
  workspaceName: '',
  workspacePath: '',
  createWorkspaceMonitor: { isLoading: false, error: '' },
  chooseDirectoryMonitor: { isLoading: false, error: '' },
  isVisible: false,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setWorkspaceName: (name: string) =>
    set({
      workspaceName: name,
      createWorkspaceMonitor: { isLoading: false, error: '' },
    }),
  chooseDirectory: async () => {
    set({ chooseDirectoryMonitor: { isLoading: true, error: '' } });
    set({ createWorkspaceMonitor: { isLoading: false, error: '' } });
    try {
      const workspacePath: string = await OpenDirectoryDialog();
      set({
        workspacePath,
        chooseDirectoryMonitor: { isLoading: false, error: '' },
      });
    } catch (err) {
      set({ chooseDirectoryMonitor: { isLoading: false, error: String(err) } });
    }
  },
  createWorkspace: async () => {
    set({ createWorkspaceMonitor: { isLoading: true, error: '' } });
    const state = WSCreatorStore.getState();
    if (state.workspaceName === '' || state.workspacePath === '')
      return set({
        createWorkspaceMonitor: {
          isLoading: false,
          error: 'Please select a directory and enter a workspace name.',
        },
      });
    try {
      await CreateWorkspace(state.workspacePath, state.workspaceName);
      set({
        isVisible: false,
        createWorkspaceMonitor: { isLoading: false, error: '' },
      });
      WSChooserStore.getState().loadWorkspaces();
    } catch (err) {
      set({ createWorkspaceMonitor: { isLoading: false, error: String(err) } });
    }
  },
}));
