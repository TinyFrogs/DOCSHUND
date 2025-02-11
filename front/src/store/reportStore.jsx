import { create } from "zustand";

const reportStore = create((set) => ({
  isReportOpen: false,
  isReportVisible: false,
  originContent: "",
  reportedUser: "",
  chatId: "",
  articleId: "",
  transId: "",
  commentId: "",
  openReport: () => {
    set({ isReportOpen: true });
  },
  closeReport: () => {
    set({ isReportOpen: false });
    set({
      originContent: "",
      reportedUser: "",
      chatId: "",
      articleId: "",
      transId: "",
      commentId: "",
    });
  },
  toggleReport: () => {
    set((state) => ({
      isReportVisible: !state.isReportVisible,
    }));
  },
}));

export default reportStore;
