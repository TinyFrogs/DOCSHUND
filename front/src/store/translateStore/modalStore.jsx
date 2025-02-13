import { create } from "zustand";

const modalStore = create((set) => ({
  isEditorOpen: false, // 번역 에디터 모달 표시
  isEditorVisible: false, // 번역 에디터 애니메이션
  isArchiveOpen: false, //번역 기록 페이지 모달 표시
  isArchiveVisible: false, //번역 기록 페이지 애니메이션
  openEditor: () => {
    set({ isEditorOpen: true });
  },
  closeEditor: () => {
    set({ isEditorOpen: false });
  },
  toggleEditor: () => {
    set((state) => ({
      isEditorVisible: !state.isEditorVisible,
    }));
  },
  openArchive: () => {
    set({ isArchiveOpen: true });
  },
  closeArchive: () => {
    set({ isArchiveOpen: false });
  },
  toggleArchive: () => {
    set((state) => ({
      isArchiveVisible: !state.isArchiveVisible,
    }));
  },
}));

export default modalStore;
