import { create } from "zustand";

const modalStore = create((set) => ({
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, openId: null }),

  openId: null, // 특정 아이템 ID (아이템별 모달)
  isOpen: false, // 일반 모달 열림 상태

  setOpenId: (id) => set({ openId: id }), // 특정 아이템 모달 열기
}));

export default modalStore;
