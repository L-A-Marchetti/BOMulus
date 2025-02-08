import { create } from 'zustand';
import { GetRecentWorkspaces } from '../../wailsjs/go/main/App';
import { Workspace } from '../types/ws_interfaces';

interface WSChooserProps {
  workspaces: Workspace[];
  isVisible: boolean;
  isLoading: boolean;
  error: string;
  toggleVisibility: () => void;
  loadWorkspaces: () => void;
}

export const WSChooserStore = create<WSChooserProps>((set) => ({
  workspaces: [],
  isVisible: true,
  isLoading: true,
  error: '',
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadWorkspaces: async () => {
    set({ isLoading: true, error: '' });
    try {
      const workspaces: Workspace[] = await GetRecentWorkspaces(); // Directement typé
      set({ workspaces, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },
}));
