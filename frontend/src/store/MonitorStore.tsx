// monitorStore.ts
import { create } from 'zustand';
import { Monitor } from '../types/global';

interface MonitorState {
  isLoading: boolean;
  moduleName: string;
  error: string | null;
  setMonitor: (
    isLoading: boolean,
    moduleName: string,
    error: string | null,
  ) => void;
  resetMonitor: () => void;
}

export const MonitorStore = create<MonitorState>((set) => ({
  isLoading: false,
  moduleName: '',
  error: null,
  setMonitor: (isLoading: boolean, moduleName: string, error: string | null) =>
    set({ isLoading: isLoading, moduleName: moduleName, error: error }),
  resetMonitor: () => set({ isLoading: false, moduleName: '', error: null }),
}));
