import { create } from "zustand";

const notificationModalStore = create((set) => ({
  // 모달 열림 상태
  isOpen: false,

  // 모달 열기
  openModal: () => set({ isOpen: true }),
  // 모달 닫기
  closeModal: () => set({ isOpen: false }),
  toggleModal: () => {
    set((state) => ({
      isOpen: !state.isOpen,
    }));
  },

  // 모달 내용
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  clearNotifications: () => set({ notifications: [] }),
  setNotifications: (notifications) => set({ notifications }),
}));

export default notificationModalStore;
