import { create } from 'zustand';

interface WSChooserProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

export const WSChooserStore = create<WSChooserProps>((set) => ({
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));
