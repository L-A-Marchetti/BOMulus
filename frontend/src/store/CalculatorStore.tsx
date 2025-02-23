import { create } from 'zustand';
import {
  SetProductionQuantity,
  PriceCalculator,
  GetProductionQuantity,
} from '../../wailsjs/go/main/App';
import { Monitor } from '../types/global';
import { WSChooserStore } from './WSChooserStore';
import { components } from '../../wailsjs/go/models';
import { CompareViewStore } from './CompareViewStore';

type PriceCalculationResult = components.PriceCalculationResult;

interface CalculatorProps {
  productionQuantity: number;
  calculationResult: PriceCalculationResult | null;
  monitor: Monitor;
  isVisible: boolean;
  toggleVisibility: () => void;
  setProductionQuantity: (productionQuantity: number, init: boolean) => void;
  getProductionQuantity: () => void;
  reset: () => void;
}

export const CalculatorStore = create<CalculatorProps>((set) => ({
  productionQuantity: 1,
  calculationResult: null,
  monitor: { isLoading: false, error: null },
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setProductionQuantity: async (
    productionQuantity: number,
    init: boolean = false,
  ) => {
    if (isNaN(productionQuantity) || productionQuantity < 0) {
      return set({
        productionQuantity: 0,
        monitor: { isLoading: false, error: null },
      });
    }
    if (productionQuantity === CalculatorStore.getState().productionQuantity)
      return set({ monitor: { isLoading: false, error: null } });
    set({ productionQuantity, monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      const productionQuantity = CalculatorStore.getState().productionQuantity;
      if (!init) {
        await SetProductionQuantity(
          activeWorkspace,
          productionQuantity.toString(),
        );
      }
      const calculationResult: PriceCalculationResult = await PriceCalculator(
        activeWorkspace,
        productionQuantity,
      );
      set({ calculationResult, monitor: { isLoading: false, error: null } });
      CompareViewStore.getState().loadComponents();
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  getProductionQuantity: async () => {
    set({ monitor: { isLoading: true, error: null } });
    const activeWorkspace = WSChooserStore.getState().activeWorkspace;
    if (!activeWorkspace)
      return set({
        monitor: { isLoading: false, error: 'No active workspace found.' },
      });
    try {
      const quantityFromBackend: string =
        await GetProductionQuantity(activeWorkspace);
      let productionQuantity = quantityFromBackend
        ? parseInt(quantityFromBackend, 10)
        : 1;
      if (isNaN(productionQuantity) || productionQuantity <= 0) {
        productionQuantity = 1;
      }
      set({ monitor: { isLoading: false, error: null } });
      CalculatorStore.getState().setProductionQuantity(
        productionQuantity,
        true,
      );
    } catch (err) {
      set({ monitor: { isLoading: false, error: String(err) } });
    }
  },
  reset: () =>
    set({
      productionQuantity: 1,
      calculationResult: null,
      monitor: { isLoading: false, error: null },
      isVisible: true,
    }),
}));
