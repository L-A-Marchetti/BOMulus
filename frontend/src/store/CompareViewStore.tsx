import { create } from 'zustand';
import { GetComponents } from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { core } from '../../wailsjs/go/models';

type Component = core.Component;

interface CompareViewProps {
  components: Component[] | null;
  monitor: Monitor;
  isVisible: boolean;
  insertIsVisible: boolean;
  updateIsVisible: boolean;
  deleteIsVisible: boolean;
  equalIsVisible: boolean;
  expandedComponents: number[];
  toggleVisibility: () => void;
  toggleOperatorVisibility: (operator: string) => void;
  toggleComponentDetails: (componentId: number) => void;
  loadComponents: () => void;
}

export const CompareViewStore = create<CompareViewProps>((set) => ({
  components: null,
  monitor: { isLoading: false, error: null },
  isVisible: false,
  insertIsVisible: true,
  updateIsVisible: true,
  deleteIsVisible: true,
  equalIsVisible: true,
  expandedComponents: [],
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  toggleOperatorVisibility: (operator: string) =>
    set((state) => ({
      insertIsVisible:
        operator === 'INSERT' ? !state.insertIsVisible : state.insertIsVisible,
      updateIsVisible:
        operator === 'UPDATE' ? !state.updateIsVisible : state.updateIsVisible,
      deleteIsVisible:
        operator === 'DELETE' ? !state.deleteIsVisible : state.deleteIsVisible,
      equalIsVisible:
        operator === 'EQUAL' ? !state.equalIsVisible : state.equalIsVisible,
    })),
  toggleComponentDetails: (componentId) =>
    set((state) => ({
      expandedComponents: state.expandedComponents.includes(componentId)
        ? state.expandedComponents.filter((id) => id !== componentId) // Ferme si déjà ouvert
        : [...state.expandedComponents, componentId], // Ajoute si fermé
    })),
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
