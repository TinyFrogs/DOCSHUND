import { create } from "zustand";

const ProgressStore = create((set) => ({
  totalData: 0,
  currentProgress: 0,
  setTotalData: (data) => {
    set({ totalData: data });
  },
  clearTotalData: () => {
    set({ totalData: 0 });
  },
  setCurrentProgress: (progress) => {
    set({ currentProgress: progress });
  },
  resetCurrentProgress: () => {
    set({ currentProgress: 0 });
  },
}));

export default ProgressStore;
