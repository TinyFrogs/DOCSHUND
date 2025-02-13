import { create } from "zustand";

const userManagerStore = create((set) => ({
  currentUserList: [],
  addUserList: (userList) => set({ userList }),
  removeUserList: () => set({ userList: [] }),
}));

export default userManagerStore;
