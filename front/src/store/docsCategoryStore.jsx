import { create } from "zustand";

// docsCategoryStore 생성
// store를 생성할 때 create 함수를 사용하고, 파라미터로 함수를 전달
const docsCategoryStore = create((set) => ({
  // 초기값 설정
  isLoading: false,
  error: null,
  // 메소드 설정
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // 가장 큰 카테고리인 대분류 목록(BAKEND, FRONTEND, DBSQL)
  positions: [],
  // 대분류 목록 메소드 설정
  setPositions: (positions) => set({ positions }),

  // 대분류에 해당하는 소분류 목록 (문서 제목들)
  documentNames: [{}],
  // 소분류 목록 메소드 설정
  setDocumentNames: (documentNames) => set({ documentNames }),
}));

export default docsCategoryStore;
