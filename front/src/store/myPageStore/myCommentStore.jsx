import { create } from "zustand";

const myCommentStore = create((set) => ({
  // 초기값 설정
  isLoading: false,
  error: null,
  // 메소드 설정
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // store에 저장할 데이터들
  comments: [],

  // store에 저장할 메소드들
  setComments: (comments) => set({ comments }),
}));

export default myCommentStore;
