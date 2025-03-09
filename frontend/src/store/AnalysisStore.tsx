import { create } from 'zustand';
import {
  RunAnalysis,
  GetAnalysisState,
  WebsocketProcess,
} from '../../wailsjs/go/main/App';
import { WSChooserStore } from './WSChooserStore';
import { core } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';
import { MonitorStore } from './MonitorStore';

type AnalysisStatus = core.AnalysisStatus;
type Component = core.Component;

interface AnalysisProps {
  analyzing: boolean;
  analysisProgress: number;
  loginIsVisible: boolean;
  email: string | null;
  password: string | null;
  token: string | null;
  toggleLoginVisibility: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  runAuth: () => void;
  startAnalysis: () => void;
  // runAnalysis: () => void;
  // getAnalysisStatus: () => Promise<void>;
  reset: () => void;
}

export const AnalysisStore = create<AnalysisProps>((set) => ({
  analyzing: false,
  analysisProgress: 0,
  loginIsVisible: false,
  email: null,
  password: null,
  token: null,
  toggleLoginVisibility: () => {
    set((state) => ({ loginIsVisible: !state.loginIsVisible }));
  },
  setEmail: (email: string) => set({ email: email }),
  setPassword: (password: string) => set({ password: password }),
  runAuth: async () => {
    const email = AnalysisStore.getState().email;
    const password = AnalysisStore.getState().password;
    const Monitor = MonitorStore.getState();
    Monitor.setMonitor(true, 'Login', null);
    try {
      const response = await fetch('http://localhost/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        set({ token: data.token });
        Monitor.setMonitor(false, 'Login', null);
        set({ loginIsVisible: false });
        AnalysisStore.getState().startAnalysis();
      } else {
        const errorData = await response.json();
        Monitor.setMonitor(false, 'Login', errorData.error);
      }
    } catch (error) {
      Monitor.setMonitor(false, 'Login', String(error));
    }
  },
  startAnalysis: () => {
    let lastReloadTime = 0;
    let returnCount = 0;
    const allComponents: Component[] | null =
      CompareViewStore.getState().components;

    const components = allComponents?.filter((comp) => comp.mpn !== '');

    const token = AnalysisStore.getState().token;
    if (!token) {
      alert('Token not found');
      return;
    }

    const ws = new WebSocket('http://localhost/analysis/start');

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'authentication',
          token: token,
          components,
        }),
      );
      set({ analyzing: true, analysisProgress: 0 });
      console.log('WebSocket connected !');
    };

    ws.onmessage = async (event) => {
      const parsedData = JSON.parse(event.data);
      const analyzedComponent: Component = parsedData;
      await WebsocketProcess(analyzedComponent);

      returnCount++;

      const totalAnalyses = components ? components.length * 2 : 0;
      const progress = Math.round((returnCount / totalAnalyses) * 100);
      set({ analysisProgress: progress });

      const now = Date.now();
      if (now - lastReloadTime > 1000) {
        CompareViewStore.getState().loadComponents();
        lastReloadTime = now;
      }
    };

    ws.onerror = (error) => {
      console.error('Error WebSocket :', error);
      set({ analyzing: false, analysisProgress: 0 });
    };

    ws.onclose = () => {
      console.log('WebSocket closed !');
      set({ analyzing: false, analysisProgress: 0 });
    };

    return () => ws.close();
  },
  // runAnalysis: async () => {
  //   const Monitor = MonitorStore.getState();
  //   Monitor.setMonitor(false, 'Analysis', null);
  //   const activeWorkspace = WSChooserStore.getState().activeWorkspace;
  //   if (!activeWorkspace)
  //     return Monitor.setMonitor(
  //       false,
  //       'Analysis',
  //       'No active workspace found...',
  //     );
  //   try {
  //     RunAnalysis(activeWorkspace);
  //     const refresh = setInterval(async () => {
  //       await AnalysisStore.getState().getAnalysisStatus();
  //       if (AnalysisStore.getState().analysisStatus?.Completed) {
  //         clearInterval(refresh);
  //         Monitor.setMonitor(false, 'Analysis', null);
  //       }
  //     }, 500);
  //   } catch (err) {
  //     Monitor.setMonitor(false, 'Analysis', String(err));
  //   }
  // },
  // getAnalysisStatus: async () => {
  //   const Monitor = MonitorStore.getState();
  //   try {
  //     const analysisStatus: AnalysisStatus = await GetAnalysisState();
  //     CompareViewStore.getState().loadComponents();
  //     const errors = [analysisStatus.DigikeyErr, analysisStatus.MouserErr]
  //       .filter(Boolean)
  //       .join(' | ');
  //     Monitor.setMonitor(false, 'Analysis', errors || null);
  //     set({ analysisStatus });
  //   } catch (err) {
  //     Monitor.setMonitor(false, 'Analysis', String(err));
  //   }
  // },
  reset: () =>
    set({
      loginIsVisible: false,
      analyzing: false,
      analysisProgress: 0,
      email: null,
      password: null,
      token: null,
    }),
}));
