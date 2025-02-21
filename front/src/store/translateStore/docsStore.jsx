import { create } from "zustand";

const docsStore = create((set) => ({
  docsList: [],
  bestDocsList: [],
  searchResults: [],
  currentDocsId: 0,
  documentName: "",
  documentCategory: "",
  viewCount: 0,
  likeCount: 0,
  createdAt: "",
  documentVersion: "",
  documentLogo: "",
  position: "",
  setDocsList: (docs) => {
    set({ docsList: docs });
  },
  setSearchResults: (docs) => {
    set({ searchResults: docs });
  },
  clearSearchResults: () => {
    set({ searchResults: [] });
  },
  setDocumentName: (name) => {
    set({ documentName: name });
  },
  setBestDocsList: (docs) => {
    set({ bestDocsList: docs });
  },
}));

export default docsStore;
