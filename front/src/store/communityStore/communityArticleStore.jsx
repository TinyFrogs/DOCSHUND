import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// communityArticleStore 생성
// store를 생성할 때 create 함수를 사용하고, 파라미터로 함수를 전달
const communityArticleStore = create(
  persist(
    (set) => ({
      // 초기값 설정
      isLoading: false,
      error: null,
      // 메소드 설정
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // article list의 초기값 설정
      articles: [],
      sortType: "latest",
      keyword: "",
      totalPages: 0,
      currentPage: 0,

      // article list의 메소드 설정
      setArticles: (articles) => set({ articles }),
      setSortType: (sortType) => set({ sortType }),
      setKeyword: (keyword) => set({ keyword }),
      setTotalPages: (totalPages) => set({ totalPages }),
      setCurrentPage: (currentPage) => set({ currentPage }),

      // article list의 초기화 메소드 설정
      clearArticles: () =>
        set((state) => ({
          ...state,
          articles: [],
          sortType: "latest",
          keyword: "",
          category: "",
          totalPages: 0,
          currentPage: 0,
        })),

      // article item의 초기값 설정
      articleId: 0,
      articleItems: {},
      likeCount: 0,
      contentLength: 0,
      isLikedArticleIds: [],

      // article item의 메소드 설정
      setArticleId: (articleId) => set({ articleId }),
      setArticleItems: (articleItems) => set({ articleItems }),
      setLikeCount: (likeCount) => set({ likeCount }),
      setContentLength: (contentLength) => set({ contentLength }),
      setIsLikedArticleIds: (isLikedArticleIds) => set({ isLikedArticleIds }),

      // article item의 전체 메소드 설정
      setArticleData: (data) =>
        set({
          articleId: data.id,
          articleItems: data,
          likeCount: data.likeCount,
        }),
      // article item의 초기화 메소드 설정
      clearArticleItems: () => {
        set({ articleId: 0, articleItems: {}, likeCount: 0, contentLength: 0 });
      },

      // 좋아요한 article list의 초기값 설정
      likeArticles: [],
      setLikeArticles: (likeArticles) => set({ likeArticles }),

      // 내가 작성한 article list의 초기값 설정
      myArticles: [],
      setMyArticles: (myArticles) => set({ myArticles }),

      // 글 작성에 필요한 데이터 저장
      title: "",
      position: "", // 문서(대분류) 제목
      category: "", // 문서(소분류) 제목
      content: "",
      fileUrl: "", // 파일 URL
      isPossibleInsertImage: true,

      // 글 작성에 필요한 메소드 설정
      setTitle: (title) => set({ title }),
      setPosition: (position) => set({ position }), // 문서(대분류) 제목 수정
      setCategory: (category) => set({ category }), // 문서(소분류) 제목 수정
      setContent: (content) => set({ content }),
      setFileUrl: (fileUrl) => set({ fileUrl }),
      setIsPossibleInsertImage: (isPossibleInsertImage) =>
        set({ isPossibleInsertImage }),

      // reply list의 초기값 설정
      replies: [], // 댓글 리스트
      commentCount: 0, // 댓글 개수
      isReplied: false, // 댓글 작성 후 댓글 리스트 리렌더링을 위한 flag
      replyId: 0, // 대댓글 작성 시 대댓글을 작성하는 원댓글의 id
      replySortType: "regist", // 대댓글 정렬

      // reply list의 메소드 설정
      setReplies: (replies) => set({ replies }),
      setCommentCount: (commentCount) => set({ commentCount }),
      setIsReplied: (isReplied) => set({ isReplied }),
      setReplyId: (replyId) => set({ replyId }),
      setReplySortType: (replySortType) => set({ replySortType }),

      // reply list의 초기화 메소드 설정
      clearReplies: () => {
        set({ replies: [], commentCount: 0, isReplied: false });
      },
    }),
    {
      name: "communityArticle-storage", // storage 이름 설정
      getStorage: () => createJSONStorage(), // storage 설정
      partialize: (state) => ({
        articleItems: state.articleItems,
        isLikedArticleIds: state.isLikedArticleIds,
      }),
    }
  )
);

export default communityArticleStore;
