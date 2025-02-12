import { create } from "zustand";

const editorStore = create((set) => ({
  docsPart: "",
  bestTrans: "",
  docsId: 0,
  originId: 0,
  currentUserText: "",
  currentPartHeight: 0,
  tempSave: "",
  submitData: "",
  setDocsPart: (text) => {
    set({ docsPart: text });
  },

  setBestTrans: (text) => {
    set({ bestTrans: text });
  },
  setDocsId: (id) => {
    set({ docsId: id });
  },
  setOriginId: (id) => {
    set({ originId: id });
  },
  setCurrentUserText: (text) => {
    set({ currentUserText: text });
  },
  setCurrentPartHeight: (height) => {
    set({ currentPartHeight: height });
  },
  setTempSave: (text) => {
    set({ tempSave: text });
  },
  setSubmitData: (data) => {
    set({ submitData: data });
  },
  clearDocsPart: () => {
    set({ docsPart: "" });
  },

  clearBestTrans: () => {
    set({ bestTrans: "" });
  },

  clearDocsId: () => {
    set({ docsId: 0 });
  },

  clearOriginId: () => {
    set({ originId: 0 });
  },

  clearCurrentUserText: () => {
    set({ currentUserText: "" });
  },

  clearTempSave: () => {
    set({ tempSave: "" });
  },

  clearSubmitData: () => {
    set({ submitData: "" });
  },
  clearEditor: () => {
    set({
      docsPart: "",
      bestTrans: "",
      tempSave: "",
      submitData: "",
    });
  },
  clearAll: () => {
    set({
      docsPart: "",
      bestTrans: "",
      docsId: 0,
      originId: 0,
      currentUserText: "",
      tempSave: "",
      submitData: "",
    });
  },
}));

export default editorStore;
