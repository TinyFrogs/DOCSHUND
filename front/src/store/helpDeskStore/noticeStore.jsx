import { create } from "zustand";

const useNoticeStore = create((set) => ({
  notices: [],
  noticeDetail: {},
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,

  setNotices: (notices) => set({ notices }),
  setNoticeDetail: (noticeDetail) => set({ noticeDetail }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default useNoticeStore;
