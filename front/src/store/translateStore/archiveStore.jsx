import { create } from "zustand";

const archiveStore = create((set) => ({
  transList: [],
  transUserList: [],
  orderByLike: true,
  orderByUpdatedAt: false,
  orderBy: "like",
  toggledStyle: "text-[#BC5B39] font-bold",
  defaultStyle: "text-black cursor-pointer",
  setTransList: (contents) => {
    console.log("새로운 데이터", contents);
    set({ transList: contents });
  },
  setTransUserList: (list) => {
    set({ transUserList: list });
  },
  setOrderBy: (text) => {
    set({ orderBy: text });
  },
  setOrderByLike: () => {
    set({ orderByLike: true, orderByUpdatedAt: false });
  },
  setOrderByUpdatedAt: () => {
    set({ orderByLike: false, orderByUpdatedAt: true });
  },
  clearTransList: () => {
    set({ transList: [] });
  },
}));

export default archiveStore;
