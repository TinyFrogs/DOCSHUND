import { create } from "zustand";

const useModalStore = create((set) => ({
  openId: null, // 특정 아이템 ID (아이템별 모달)
  isOpen: false, // 일반 모달 열림 상태

  openModal: () => set({ isOpen: true }), // 일반 모달 열기
  closeModal: () => set({ isOpen: false, openId: null }), // 모든 모달 닫기
  setOpenId: (id) => set({ openId: id }), // 특정 아이템 모달 열기
}));

export default useModalStore;
