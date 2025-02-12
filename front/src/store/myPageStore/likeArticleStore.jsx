import { create } from "zustand";

// likeArticleStore 생성
const LikeArticleStore = create((set) => ({
  // 초기값 설정
  isLoading: false,
  error: null,
  // 메소드 설정
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // article list의 초기값 설정
  likeArticles: [],
  sortType: "latest",
  keyword: "",
  totalPages: 0,
  currentPage: 0,

  // article list의 메소드 설정
  setLikeArticles: (likeArticles) => set({ likeArticles }),
  setSortType: (sortType) => set({ sortType }),
  setKeyword: (keyword) => set({ keyword }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default LikeArticleStore;
