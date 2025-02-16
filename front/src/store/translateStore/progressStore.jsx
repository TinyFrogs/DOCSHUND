import { create } from "zustand";

const ProgressStore = create((set) => ({
  currentProgress: 0,
  setCurrentProgress: (progress) => {
    set({ currentProgress: progress });
  },
  resetCurrentProgress: () => {
    set({ currentProgress: 0 });
  },
}));

export default ProgressStore;
