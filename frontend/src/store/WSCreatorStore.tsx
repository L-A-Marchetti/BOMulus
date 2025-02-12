import { create } from 'zustand';
import {
  OpenDirectoryDialog,
  CreateWorkspace,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';

interface WSCreatorProps {
  workspaceName: string | null;
  workspacePath: string | null;
  monitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  setWorkspaceName: (name: string) => void;
  chooseDirectory: () => void;
  createWorkspace: () => void;
}

export const WSCreatorStore = create<WSCreatorProps>((set) => ({
  workspaceName: null,
  workspacePath: null,
  monitor: { isLoading: false, error: null },
  isVisible: false,
  toggleVisibility: () => {
    set((state) => ({ isVisible: !state.isVisible }));
    WSChooserStore.getState().toggleVisibility();
  },
  setWorkspaceName: (name: string) =>
    set({
      workspaceName: name,
      monitor: { isLoading: false, error: null },
    }),
  chooseDirectory: async () => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      const workspacePath: string = await OpenDirectoryDialog();
      set({
        workspacePath,
        monitor: { isLoading: false, error: null },
      });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  createWorkspace: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const state = WSCreatorStore.getState();
    if (!state.workspaceName || !state.workspacePath)
      return set({
        monitor: {
          isLoading: false,
          error: 'Please select a directory and enter a workspace name.',
        },
      });
    try {
      await CreateWorkspace(state.workspacePath, state.workspaceName);
      set({
        isVisible: false,
        monitor: { isLoading: false, error: null },
      });
      WSChooserStore.getState().loadWorkspaces();
      WSChooserStore.getState().toggleVisibility();
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
