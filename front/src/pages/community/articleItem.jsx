import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import _ from "lodash";

import communityArticleStore from "../../store/communityStore/communityArticleStore";
import useReportStore from "../../store/reportStore";
import ArticleItemService from "./services/articleItemService";

import ReportModal from "../../pages/report";
import CommunityHeader from "./components/communityHeader";
import ArticleFooter from "./components/articleFooter";
import SkeletonArticleItem from "./components/skeletonArticleItem";
import ReplyList from "./replyList";
import RectBtn from "../../components/button/rectBtn";
import ToastViewer from "../translate/components/toastViewer";
import logo from "../../assets/logo.png";

const ArticleItem = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();

  const [isLiked, setIsLiked] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const token = localStorage.getItem("token");

  // stroe의 데이터를 가져오기 위해 정의
  const articleItems = communityArticleStore((state) => state.articleItems);
  const likeCount = communityArticleStore((state) => state.likeCount);

  // store의 메소드를 가져오기 위해 정의
  const setArticleId = communityArticleStore((state) => state.setArticleId);
  const setLikeCount = communityArticleStore((state) => state.setLikeCount);
  const setLoading = communityArticleStore((state) => state.setLoading);
  const setError = communityArticleStore((state) => state.setError);
  const clearArticleItems = communityArticleStore(
    (state) => state.clearArticleItems
  );

  // Items, likeCount 등 설정
  const setArticleData = communityArticleStore((state) => state.setArticleData);

  const toggleReport = useReportStore((state) => state.toggleReport);
  const openReport = useReportStore((state) => state.openReport);

  const handleReport = (data) => {
    useReportStore.setState({
      originContent: data.content,
      reportedUser: data.userId,
      commentId: null,
      articleId: data.articleId,
      transId: null,
      chatId: null,
    });

    openReport();
    toggleReport();
  };

  // NOTE: 즉시 store에 접근하여 데이터를 가져오기 위해 useEffect 사용
  useEffect(() => {
    const fetchArticleItems = async (articleId) => {
      // 데이터를 가져오기 전에 로딩 상태를 true로 변경
      setLoading(true);
      clearArticleItems(); // store의 articleItems 초기화

      // 데이터 가져오기
      try {
        //NOTE: updatedAt이 업데이트 되는 도중에 새로고침해서 데이터를 가져오려 하면 에러 발생

        // 게시글 아이템을 가져오는 fetchArticleItems 함수 호출
        if (articleId) {
          // detailedArticleService.fetchDetailedArticle 함수를 호출하여 데이터를 가져옴
          const data = await ArticleItemService.fetchArticleItem(articleId);
          // NOTE: data 호출에 길어봐야 200ms, 0.2초 밖에 안걸림
          // -> 로딩하는 동안 이전 값들이 보이는 것은 store에 상태를 다시 세팅하는 시간이 걸리기 때문으로 추측

          if (!_.isEqual(data, {})) {
            setArticleId(articleId);
            setArticleData(data);
            setIsInitialLoad(false);
          }
        } else {
          setTimeout(() => {
            setIsInitialLoad(false);
          }, 500);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleItems(articleId);

    // 컴포넌트가 언마운트 될 때 store의 articleItems 초기화
    return () => {
      clearArticleItems();
    };
  }, [articleId]);

  const handleDeleteClick = () => async () => {
    async () => {
      if (window.confirm("게시글을 삭제하시겠습니까?")) {
        const response = await ArticleItemService.deleteArticleItem(articleId);

        if (response.status == 204) {
          toast.info("게시글이 삭제되었습니다.");
          navigate("/community");
        }
      }
    };
  };

  // NOTE: isInitialLoad가 true일 때만 실행. 로딩중일 때의 깜빡임 현상을 줄여 UX 개선하기 위함
  if (isInitialLoad) {
    return (
      <div className="flex justify-center w-full">
        <main className="flex-1 p-8 max-w-[1280px]">
          <CommunityHeader />
          <SkeletonArticleItem />
        </main>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <main className="flex-1 p-4 max-w-[1280px]">
        {/* header */}
        <CommunityHeader />
        {/* main content - bg-white와 rounded 스타일을 상위 div에 적용 */}
        {/* /* 게시글 전체 박스 영역 */}

        <div className="bg-white rounded-tl-xl rounded-tr-xl border-t rounded-bl-xl rounded-br-xl border-b border-l border-r  border-[#E1E1DF]">
          <div className="p-6">
            {/* 게시글 헤더 */}
            <div className="border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="flex w-full justify-between items-center mb-4">
                <h1 className="text-2xl font-bold flex-1 mr-4">
                  {articleItems.title}
                </h1>
                {/* TODO: 본인이 작성한 게 아니면 보이지 않도록 + 불가능하도록 하기 */}
                <div className="flex gap-2 text-sm text-gray-500 flex-shrink-0">
                  {token
                    ? jwtDecode(token)?.userId === articleItems.userId && (
                        <div className="flex gap-2 text-sm text-gray-500 flex-shrink-0">
                          <button
                            className="text-[#7d7c77] underline hover:text-gray-700 cursor-pointer"
                            onClick={() => {
                              // 수정 페이지로 이동
                              navigate(`/community/modify/${articleId}`);
                            }}
                          >
                            수정
                          </button>
                          <span>|</span>
                          <button
                            className="text-[#7d7c77] underline hover:text-gray-700 cursor-pointer"
                            onClick={handleDeleteClick}
                          >
                            삭제
                          </button>
                          {token
                            ? jwtDecode(token)?.userId !=
                                articleItems.userId && <span>|</span>
                            : null}
                        </div>
                      )
                    : null}
                  {/* INFO: 신고 */}
                  {token
                    ? jwtDecode(token)?.userId != articleItems.userId && (
                        <div className="flex gap-2 text-sm text-gray-500">
                          <button
                            className="text-[#7d7c77] underline hover:text-gray-700 cursor-pointer"
                            onClick={() => {
                              handleReport(articleItems);
                            }}
                          >
                            신고
                          </button>
                        </div>
                      )
                    : null}
                </div>
              </div>
              <div className="flex justify-between items-center text-[#7d7c77]">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => {
                    navigate(`/userPage/${articleItems.userId}`);
                  }}
                >
                  <img
                    src={articleItems.profileImage}
                    alt={`${articleItems.nickname}의 프로필`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-medium">{articleItems.nickname}</span>
                  <span>
                    {articleItems?.createdAt
                      ? isSameDay(new Date(articleItems.createdAt), new Date())
                        ? format(new Date(articleItems.createdAt), "HH:mm")
                        : format(new Date(articleItems.createdAt), "yyyy-MM-dd")
                      : "표시할 수 없는 날짜입니다."}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span>조회</span>
                    <span>{articleItems.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>좋아요</span>
                    <span>{articleItems.likeCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 게시글 본문 */}
            <div className="border-b border-[#E1E1DF] pb-4 mb-4">
              <div className="min-h-[200px] whitespace-pre-wrap mb-6">
                <ToastViewer content={articleItems.content} />
              </div>
              <div className="flex justify-center items-center gap-4">
                {token ? (
                  <RectBtn
                    onClick={async () => {
                      // 좋아요 api 날리기
                      const response = await ArticleItemService.likeArticleItem(
                        articleId
                      );

                      const status = response.status;

                      // status가 204이면 좋아요 성공
                      if (status == 204) {
                        setIsLiked(!isLiked); // 좋아요 상태 변경
                        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1); // 좋아요 상태에 따라 수 변경
                      } else {
                        toast.alert("좋아요에 실패했습니다.");
                      }
                    }}
                    text={
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        {likeCount}
                      </div>
                    } // 출력할 좋아요 수
                    className="px-4 py-2 text-base"
                  ></RectBtn>
                ) : null}
              </div>
            </div>

            {/* 게시글 본문 푸터 */}
            <ArticleFooter articleData={articleItems} />
          </div>
        </div>
        {/* 댓글 리스트 */}
        <ReplyList replyCount={articleItems.commentCount} />
      </main>
    </div>
  );
};

export default ArticleItem;
