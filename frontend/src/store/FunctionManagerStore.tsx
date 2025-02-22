import { create } from 'zustand';
import { Monitor } from '../types/global';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';

type Designator = core.Designator;

interface FunctionManagerProps {
  designators: Designator[] | null;
  functions: { name: string; color: string }[] | null;
  expandedFunctions: string[];
  monitor: Monitor;
  isVisible: boolean;
  name: string;
  color: string;
  toggleVisibility: () => void;
  toggleFunctionExpand: (name: string) => void;
  loadDesignators: () => void;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  createFunction: () => void;
}

export const FunctionManagerStore = create<FunctionManagerProps>((set) => ({
  designators: null,
  functions: null,
  expandedFunctions: [],
  monitor: { isLoading: false, error: null },
  isVisible: false,
  name: '',
  color: '#000000',
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  toggleFunctionExpand: (name: string) =>
    set((state) => ({
      expandedFunctions: state.expandedFunctions.includes(name)
        ? state.expandedFunctions.filter((id) => id !== name)
        : [...state.expandedFunctions, name],
    })),
  loadDesignators: () => {
    set({ monitor: { isLoading: true, error: null } });
    const components = CompareViewStore.getState().components;
    if (!components)
      return set({
        monitor: { isLoading: false, error: 'Components are not loaded...' },
      });
    const uniqueDesignators = new Map<string, Designator>();
    const functions = new Map<string, string>();
    for (const c of components) {
      if (c.designators && c.designators.length > 0) {
        for (const d of c.designators) {
          if (!uniqueDesignators.has(d.designator)) {
            uniqueDesignators.set(d.designator, d);
          }
          if (d.label && d.label.name) {
            const fName = d.label.name.trim();
            if (fName && !functions.has(fName)) {
              functions.set(fName, d.label.color);
            }
          }
        }
      }
    }
    set({
      designators: Array.from(uniqueDesignators.values()),
      functions: Array.from(functions, ([name, color]) => ({ name, color })),
      monitor: { isLoading: false, error: null },
    });
  },
  setName: (name: string) => set({ name }),
  setColor: (color: string) => set({ color }),
  createFunction: () => {
    set((state) => ({
      functions: state.functions
        ? [...state.functions, { name: state.name, color: state.color }] // Utilisation correcte des propriétés de l'état
        : [{ name: state.name, color: state.color }],
    }));
  },
}));
