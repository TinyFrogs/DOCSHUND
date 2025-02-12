import { create } from "zustand";

const useUserActivityStore = create((set) => ({
  userProfile: null,
  articles: [],
  comments: [],
  translations: [],
  loading: false,
  error: null,

  setUserProfile: (profileData) => set({ userProfile: profileData }),
  setArticles: (articles) => set({ articles }),
  setComments: (comments) => set({ comments }),
  setTranslations: (translations) => set({ translations }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (errorMessage) => set({ error: errorMessage }),
}));

export default useUserActivityStore;
