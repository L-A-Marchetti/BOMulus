import { create } from 'zustand';
import { GetComponents } from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { core } from '../../wailsjs/go/models';

type Component = core.Component;

interface CompareViewProps {
  components: Component[] | null;
  insert: Component[] | null;
  update: Component[] | null;
  delete: Component[] | null;
  equal: Component[] | null;
  monitor: Monitor;
  isVisible: boolean;
  insertIsVisible: boolean;
  updateIsVisible: boolean;
  deleteIsVisible: boolean;
  equalIsVisible: boolean;
  expandedComponents: number[];
  warningOutOfStock: number[];
  warningLifeCycle: number[];
  warningMessage: number[];
  warningMismatchMpn: number[];
  warningMoq: number[];
  selectedWarnings: string[];
  toggleVisibility: () => void;
  toggleOperatorVisibility: (operator: string) => void;
  toggleComponentDetails: (componentId: number) => void;
  loadComponents: () => void;
  componentHasAWarning: (componentId: number) => boolean;
  toggleWarningFilter: (warning: string) => void;
  filterComponents: (components: Component[]) => Component[];
}

export const CompareViewStore = create<CompareViewProps>((set) => ({
  components: null,
  insert: null,
  update: null,
  delete: null,
  equal: null,
  monitor: { isLoading: false, error: null },
  isVisible: false,
  insertIsVisible: true,
  updateIsVisible: true,
  deleteIsVisible: true,
  equalIsVisible: true,
  expandedComponents: [],
  warningOutOfStock: [],
  warningLifeCycle: [],
  warningMessage: [],
  warningMismatchMpn: [],
  warningMoq: [],
  selectedWarnings: [],
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
        ? state.expandedComponents.filter((id) => id !== componentId)
        : [...state.expandedComponents, componentId],
    })),
  loadComponents: async () => {
    set({ monitor: { isLoading: true, error: null } });
    try {
      const components: Component[] = await GetComponents();
      const insert = components.filter(
        (component) => component.Operator === 'INSERT',
      );
      const update = components.filter(
        (component) => component.Operator === 'UPDATE',
      );
      const del = components.filter(
        (component) => component.Operator === 'DELETE',
      );
      const equal = components.filter(
        (component) => component.Operator === 'EQUAL',
      );
      const warningOutOfStock: number[] = [];
      const warningLifeCycle: number[] = [];
      const warningMessage: number[] = [];
      const warningMismatchMpn: number[] = [];
      const warningMoq: number[] = [];
      components.forEach((component) => {
        const operator = component.Operator || '';
        if (
          component.analyzed &&
          operator !== 'DELETE' &&
          component.availability?.every((avail) => avail.value.trim() === '')
        ) {
          warningOutOfStock.push(component.id);
        }
        if (
          component.analyzed &&
          operator !== 'DELETE' &&
          component.lifecycle_status?.some(
            (lcs) =>
              lcs.value !== '' &&
              lcs.value !== 'New Product' &&
              lcs.value !== 'New at Mouser' &&
              lcs.value !== 'Active',
          )
        ) {
          warningLifeCycle.push(component.id);
        }
        if (
          component.analyzed &&
          operator !== 'DELETE' &&
          component.info_messages?.some((msg) => msg.trim() !== '')
        ) {
          warningMessage.push(component.id);
        }
        if (component.analyzed && component.mismatch_mpn === true) {
          warningMismatchMpn.push(component.id);
        }
        if (component.calculated_price?.is_moq_not_reached) {
          warningMoq.push(component.id);
        }
      });
      set({
        components,
        insert,
        update,
        delete: del,
        equal,
        warningOutOfStock,
        warningLifeCycle,
        warningMessage,
        warningMismatchMpn,
        warningMoq,
        monitor: { isLoading: false, error: null },
      });
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  componentHasAWarning: (componentId: number) => {
    if (CompareViewStore.getState().warningLifeCycle.includes(componentId))
      return true;
    if (CompareViewStore.getState().warningMessage.includes(componentId))
      return true;
    if (CompareViewStore.getState().warningMismatchMpn.includes(componentId))
      return true;
    if (CompareViewStore.getState().warningMoq.includes(componentId))
      return true;
    if (CompareViewStore.getState().warningOutOfStock.includes(componentId))
      return true;
    return false;
  },
  toggleWarningFilter: (warning) =>
    set((state) => {
      const selectedWarnings = state.selectedWarnings.includes(warning)
        ? state.selectedWarnings.filter((w) => w !== warning)
        : [...state.selectedWarnings, warning];
      return { selectedWarnings };
    }),
  filterComponents: (components: Component[]) => {
    const {
      selectedWarnings,
      warningOutOfStock,
      warningLifeCycle,
      warningMessage,
      warningMismatchMpn,
      warningMoq,
    } = CompareViewStore.getState();
    let filteredComponents = [...components];
    if (selectedWarnings.length === 0) {
      return filteredComponents;
    }
    if (selectedWarnings.includes('outOfStock')) {
      filteredComponents = filteredComponents.filter((component) =>
        warningOutOfStock.includes(component.id),
      );
    }
    if (selectedWarnings.includes('lifeCycle')) {
      filteredComponents = filteredComponents.filter((component) =>
        warningLifeCycle.includes(component.id),
      );
    }
    if (selectedWarnings.includes('message')) {
      filteredComponents = filteredComponents.filter((component) =>
        warningMessage.includes(component.id),
      );
    }
    if (selectedWarnings.includes('mismatchMpn')) {
      filteredComponents = filteredComponents.filter((component) =>
        warningMismatchMpn.includes(component.id),
      );
    }
    if (selectedWarnings.includes('moq')) {
      filteredComponents = filteredComponents.filter((component) =>
        warningMoq.includes(component.id),
      );
    }
    return filteredComponents;
  },
}));
