import { create } from 'zustand';

type workspace = {
  id: number;
  name: string;
}

interface WSChooserProps {
  workspaces: workspace[];
  isVisible: boolean;
  isLoading: boolean;
  error: string;
  toggleVisibility: () => void;
  //loadWorkspaces: () => void;
}

export const WSChooserStore = create<WSChooserProps>((set) => ({
  workspaces: [],
  isVisible: true,
  isLoading: true,
  error: "",
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));
