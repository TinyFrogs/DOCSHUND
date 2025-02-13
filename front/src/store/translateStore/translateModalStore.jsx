import { create } from "zustand";

const modalStore = create((set) => ({
  isEditorOpen: false, // 번역 에디터 모달 표시
  isArchiveOpen: false, //번역 기록 페이지 모달 표시

  openEditor: () => {
    set({ isEditorOpen: true });
  },
  closeEditor: () => {
    set({ isEditorOpen: false });
  },
  openArchive: () => {
    set({ isArchiveOpen: true });
  },
  closeArchive: () => {
    set({ isArchiveOpen: false });
  },
}));

export default modalStore;
