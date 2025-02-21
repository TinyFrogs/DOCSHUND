import { create } from "zustand";

const dbStore = create((set) => ({
  dbInitialized: false,
  activateDbInitialized: () => set({ dbInitialized: true }),
  deactivateDbInitialized: () => set({ dbInitialized: false }),
}));

export default dbStore;
