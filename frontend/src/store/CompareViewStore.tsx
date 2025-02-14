import { create } from 'zustand';
import { GetComponents } from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { core } from '../../wailsjs/go/models';

type Component = core.Component;

interface CompareViewProps {
  components: Component[] | null;
  monitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  loadComponents: () => void;
}

export const CompareViewStore = create<CompareViewProps>((set) => ({
  components: null,
  monitor: { isLoading: false, error: null },
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  loadComponents: async () => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      const components: Component[] = await GetComponents();
      set({ components, monitor: { isLoading: false, error: null } });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
}));
