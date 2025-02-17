import { create } from "zustand";

const notificationModalStore = create((set) => ({
  // 모달 열림 상태
  isNotificationModalOpen: false,

  // 모달 열기
  openNotificationModal: () => set({ isNotificationModalOpen: true }),
  // 모달 닫기
  closeNotificationModal: () => set({ isNotificationModalOpen: false }),
  toggleNotificationModal: () => {
    set((state) => ({
      isNotificationModalOpen: !state.isNotificationModalOpen,
    }));
  },

  // 모달 내용
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  clearNotifications: () => set({ notifications: [] }),
  setNotifications: (notifications) => set({ notifications }),

  // 알림 확인
  isAllChecked: false,
  setIsAllChecked: (isAllChecked) => set({ isAllChecked }),
}));

export default notificationModalStore;
