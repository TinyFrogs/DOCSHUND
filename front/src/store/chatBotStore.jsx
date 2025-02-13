import { create } from "zustand";

const ChatBotStore = create((set) => ({
  isChatBotOpen: true,
  isChatBotVisible: false,
  isChatBotBtnVisible: true,
  chatBotBtnPosition: [10, 10],
  chatBotPosition: [],
  chatList: [],
  chatMemory: "",
  registMessages: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  toggleChatBot: () =>
    set((state) => ({
      isChatBotVisible: !state.isChatBotVisible,
    })),
  toggleChatBotBtn: () =>
    set((state) => ({
      isChatBotBtnVisible: !state.isChatBotBtnVisible,
    })),
  setChatBotPosition: (position) => {
    set({ chatBotPosition: position });
  },
  setChatBotBtnPosition: (position) => {
    set({ chatBotBtnPosition: position });
  },
  setChatList: (chatMessages) => {
    set({ chatList: chatMessages });
  },
  clearChatList: () => {
    set({ chatList: [] });
  },
  setChatMemory: (previousChat) => {
    set({ chatMemory: previousChat });
  },
  clearChatMemory: () => {
    set({ chatMemory: "" });
  },
}));

export default ChatBotStore;
