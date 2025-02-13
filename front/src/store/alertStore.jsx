import { create } from "zustand";

const alertStore = create((set) => ({
  isAlertOpen: false,
  toggleAlert: () => {
    set((state) => ({
      isAlertOpen: !state.isAlertOpen,
    }));
  },
  resetAlert: () => set({ isAlertOpen: false }),
}));

export default alertStore;
