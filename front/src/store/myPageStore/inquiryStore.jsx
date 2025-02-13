import { create } from "zustand";

const inquiryStore = create((set) => ({
  // 초기값 설정
  isLoading: false,
  error: null,
  // 메소드 설정
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // 문의사항 초기값 설정
  inquiries: [],
  setInquiries: (inquiries) => set({ inquiries }),

  totalPages: 0,
  setTotalPages: (totalPages) => set({ totalPages }),

  currentPage: 0,
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default inquiryStore;
