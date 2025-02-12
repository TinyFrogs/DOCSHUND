import { create } from "zustand";

const likeDocsStore = create((set) => ({
  // 초기값 설정
  isLoading: false,
  error: null,
  // 메소드 설정
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // state 정의
  docs: [],

  // 메소드 설정
  setDocs: (docs) => set({ docs }),
}));

export default likeDocsStore;
