import { create } from "zustand";

// likeArticleStore 생성
const MyArticleStore = create((set) => ({
  // 초기값 설정
  isLoading: false,
  error: null,
  // 메소드 설정
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // article list의 초기값 설정
  myArticles: [],
  sortType: "latest",
  keyword: "",
  totalPages: 0,
  currentPage: 0,

  // article list의 메소드 설정
  setMyArticles: (myArticles) => set({ myArticles }),
  setSortType: (sortType) => set({ sortType }),
  setKeyword: (keyword) => set({ keyword }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default MyArticleStore;
