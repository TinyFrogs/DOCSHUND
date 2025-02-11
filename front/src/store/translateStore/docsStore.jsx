import { create } from "zustand";

const docsStore = create((set) => ({
  docsList: [],
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
  setDocumentName: (name) => {
    set({ documentName: name });
  },
}));

export default docsStore;
