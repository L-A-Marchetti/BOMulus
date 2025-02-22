import { create } from 'zustand';
import { Monitor } from '../types/global';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';

type Designator = core.Designator;

interface FunctionManagerProps {
  designators: Designator[] | null;
  selectedDesignators: Designator[];
  functions: { name: string; color: string }[] | null;
  expandedFunctions: string[];
  monitor: Monitor;
  isVisible: boolean;
  name: string;
  color: string;
  searchQueries: { name: string; query: string }[];
  toggleVisibility: () => void;
  toggleFunctionExpand: (name: string) => void;
  toggleDesignatorSelection: (designator: Designator) => void;
  loadDesignators: () => void;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  createFunction: () => void;
  assignToFunction: (functionName: string) => void;
  removeDesignator: (designator: Designator) => void;
  setSearchQueries: (functionName: string, query: string) => void;
}

export const FunctionManagerStore = create<FunctionManagerProps>((set) => ({
  designators: null,
  selectedDesignators: [],
  functions: null,
  expandedFunctions: [],
  monitor: { isLoading: false, error: null },
  isVisible: false,
  name: '',
  color: '#000000',
  searchQueries: [],
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  toggleFunctionExpand: (name: string) =>
    set((state) => ({
      expandedFunctions: state.expandedFunctions.includes(name)
        ? state.expandedFunctions.filter((id) => id !== name)
        : [...state.expandedFunctions, name],
    })),
  toggleDesignatorSelection: (designator: Designator) =>
    set((state) => ({
      selectedDesignators: state.selectedDesignators.includes(designator)
        ? state.selectedDesignators.filter((id) => id !== designator)
        : [...state.selectedDesignators, designator],
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
        ? [...state.functions, { name: state.name, color: state.color }]
        : [{ name: state.name, color: state.color }],
    }));
  },
  assignToFunction: (functionName: string) =>
    set((state) => {
      if (!state.functions || !state.designators) return state;
      const selectedFunction = state.functions.find(
        (f) => f.name === functionName,
      );
      if (!selectedFunction) return state;
      const updatedDesignators: Designator[] = state.designators.map(
        (d): Designator =>
          state.selectedDesignators.includes(d)
            ? {
                ...d,
                label: {
                  name: selectedFunction.name,
                  color: selectedFunction.color,
                },
                convertValues: d.convertValues,
              }
            : d,
      );
      return {
        designators: updatedDesignators,
        selectedDesignators: [],
      };
    }),
  removeDesignator: (designator: Designator) =>
    set((state) => {
      if (!state.designators) return state;
      const updatedDesignators = state.designators.map(
        (d): Designator =>
          d.designator === designator.designator
            ? {
                ...d,
                label: { name: 'not assigned', color: '#ffffff' },
                convertValues: d.convertValues,
              }
            : d,
      );
      return { designators: updatedDesignators };
    }),
  setSearchQueries: (functionName: string, query: string) =>
    set((state) => {
      const updatedQueries = new Map(
        state.searchQueries.map(({ name, query }) => [name, query]),
      );
      updatedQueries.set(functionName, query);
      return {
        searchQueries: Array.from(updatedQueries, ([name, query]) => ({
          name,
          query,
        })),
      };
    }),
}));
