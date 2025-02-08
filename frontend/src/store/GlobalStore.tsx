import { create } from 'zustand';
import { GetRecentWorkspaces } from "../../wailsjs/go/main/App";

type workspaceInfos = {
  name: string;
  path: string;
  createdAt: string;
  last_opened: string;
  production_quantity: string;
  last_comparison: {
    v1: string;
    v2: string;
  };
};

type fileInfo = {
  version_tag: number;
  name: string;
  path: string;
  components: any[];
  filters: any; 
};

export type workspace = {
  workspace_infos: workspaceInfos,
  files: fileInfo[],
};


interface WSChooserProps {
  workspaces: workspace[];
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
  error: "",
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadWorkspaces: async () => {
    set({ isLoading: true, error: "" });
    try {
      const workspaces: workspace[] = await GetRecentWorkspaces(); // Directement typé
      set({ workspaces, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load workspaces", isLoading: false });
    }
  },
}));