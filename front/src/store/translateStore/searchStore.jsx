import { create } from "zustand";
import { createRef } from "react";

const searchStore = create((set) => ({
  virtuosoRef: createRef(null),
  docDataLength: createRef(0),
  highlightIndex: null,
  setHighlightIndex: (index) => set({ highlightIndex: index }),
  clearHighlightIndex: () => set({ highlightIndex: null }),
}));

export default searchStore;
