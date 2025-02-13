import { create } from "zustand";

const useMemoStore = create((set) => ({
  memos: [],
  isLoading: false,
  error: null,

  setMemos: (memos) => set({ memos }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // 메모 추가
  addMemo: (newMemo) => set((state) => ({ memos: [newMemo, ...state.memos] })),

  // 메모 수정
  updateMemo: (memoId, updatedMemo) =>
    set((state) => ({
      memos: state.memos.map((memo) =>
        memo.memoId === memoId ? updatedMemo : memo
      ),
    })),

  // 메모 삭제
  deleteMemo: (memoId) =>
    set((state) => ({
      memos: state.memos.filter((memo) => memo.memoId !== memoId),
    })),
}));

export default useMemoStore;
