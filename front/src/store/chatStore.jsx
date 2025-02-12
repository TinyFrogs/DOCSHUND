import { create } from "zustand";

const ChatStore = create((set) => ({
  isChatOpen: true,
  isChatVisible: false,
  toggleChat: () =>
    set((state) => ({
      isChatVisible: !state.isChatVisible,
    })),
}));

export default ChatStore;
