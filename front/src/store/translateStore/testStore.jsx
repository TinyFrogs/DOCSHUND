import { create } from "zustand";

const testStore = create((set) => ({
  isTest: false,
}));

export default testStore;
