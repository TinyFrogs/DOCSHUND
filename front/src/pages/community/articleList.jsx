import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";

import articleListService from "./services/articleListService";
import ListRender from "../../components/pagination/listRender.jsx";
import communityArticleStore from "../../store/communityStore/communityArticleStore.jsx";
import CommunityHeader from "./components/communityHeader.jsx";

import like from "../../assets/icon/heartFilled24.png";
import view from "../../assets/icon/viewCnt.png";
import comment from "../../assets/icon/commentCnt.png";

const ArticleList = () => {
  //  store에서 데이터를 가져오기 위해 store의 상태 정의
  const articles = communityArticleStore((state) => state.articles);
  const totalPages = communityArticleStore((state) => state.totalPages);
  const currentPage = communityArticleStore((state) => state.currentPage);
  const category = communityArticleStore((state) => state.category);

  // set(메소드) 정의
  const setArticles = communityArticleStore((state) => state.setArticles);
  const setTotalPages = communityArticleStore((state) => state.setTotalPages);
  const setCurrentPage = communityArticleStore((state) => state.setCurrentPage);
  const setLoading = communityArticleStore((state) => state.setLoading);
  const setError = communityArticleStore((state) => state.setError);

  const [itemsPerPage, setItmesPerPage] = useState(10); // 페이지당 보여줄 게시글 수

  const [sortType, setSortBy] = useState("latest"); // 정렬 기준
  const [keyword, setKeyword] = useState(""); // 검색어
  const [tmpKeyword, setTmpKeyword] = useState(""); // 임시 검색어

  // 정렬 옵션
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "likes", label: "좋아요순" },
    { value: "views", label: "조회수순" },
  ];

  // 정렬 상태 변경
  const handleSort = (value) => {
    setSortBy(value);
  };

  // NOTE: 즉시 store에 접근하여 데이터를 가져오기 위해 useEffect 사용
  useEffect(() => {
    // 비동기 함수를 만들어서 데이터를 가져오는 로직을 작성
    const fetchArticles = async () => {
      // 데이터를 가져오기 전에 로딩 상태를 true로 변경
      setLoading(true);

      // 데이터 가져오기
      try {
        // articleListService.fetchArticles 함수를 호출하여 데이터를 가져옴
        const data = await articleListService.fetchArticles(
          sortType, // 정렬 기준
          category, // 필터(카테고리) TODO: 카테고리 기능 추가
          keyword, // 검색어
          "title", // 검색 타입
          currentPage, // 현재 페이지
          itemsPerPage // 페이지당 보여줄 게시글 수
        );

        if (data.content) {
          console.log(data.content);
        }

        // 가져온 데이터를 store에 저장
        // 데이터가 비어있지 않을 때
        if (data.content.length > 0) {
          setArticles(data.content); // 게시글 목록 설정
          setTotalPages(data.totalPages); // 전체 페이지 수
          setCurrentPage(data.pageable.pageNumber); // 현재 페이지
          setItmesPerPage(data.size); // 페이지당 보여줄 게시글 수
        } else {
          setArticles([]);
          setTotalPages(0);
          setCurrentPage(0);
          setItmesPerPage(0);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    // fetchArticles 함수를 실행
    fetchArticles();
  }, [sortType, keyword, currentPage, category, itemsPerPage]); // 의존성 배열에 sortType, keyword, currentPage, itemsPerPage 추가

  // 리스트 아이템 렌더링
  const renderItem = (item) => (
    <div className="flex justify-between text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 flex flex-col justify-between">
        {/* // Link 컴포넌트를 사용하여 글 제목을 클릭하면 해당 글로 이동하도록 설정 */}
        <Link
          to={`/community/article/${item.articleId}`}
          className="font-semibold line-clamp-1 break-all text-[#7d7c77] hover:text-[#bc5b39]"
        >
          {item.title}
        </Link>
        <p className="text-base line-clamp-1 break-all">{item.content}</p>
        <p className="text-base">
          {item.createdAt
            ? isSameDay(new Date(item.createdAt), new Date())
              ? format(new Date(item.createdAt), "HH:mm")
              : format(new Date(item.createdAt), "yyyy-MM-dd")
            : "표시할 수 없는 날짜입니다."}
        </p>
      </div>
      <div className="flex space-x-6 items-bottom">
        <p className="self-end">{item.nickname}</p>
        <div className="flex flex-col justify-between">
          <div className="flex items-center">
            <img className="mr-2" src={like} alt="좋아요수 아이콘" />
            <p className="w-8 text-right">{item.likeCount}</p>
          </div>
          <div className="flex items-center">
            <img className="mr-2" src={view} alt="조회수 아이콘" />
            <p className="w-8 text-right">{item.viewCount}</p>
          </div>
          <div className="flex items-center">
            <img className="mr-2" src={comment} alt="댓글수 아이콘" />
            <p className="w-8 text-right">{item.commentCount}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <main className="flex-1 p-4">
        <CommunityHeader />
        <div>
          {/* 2-2. 글 목록 */}
          {/* 글 목록이 있을 때 */}
          <div className="pt-4 bg-white rounded-tl-xl rounded-tr-xl border-t border-l border-r border-[#E1E1DF]">
            <div className="flex justify-between items-center pt-4">
              {/* 검색 바 */}
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="border p-2 ml-10 rounded-full w-full h-8 focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
                  onChange={(e) => setTmpKeyword(e.target.value)} // 검색어 입력에 따라 임시 검색어 변경
                  onKeyDown={(e) => {
                    // 엔터키 입력 시 검색어로 검색
                    if (e.key === "Enter") {
                      setKeyword(e.target.value);
                    }
                  }}
                />
                {/* 돋보기 아이콘, 클릭 시 임시 검색어로 검색 실행 (input의 value 참조를 위한 로직) */}
                <div
                  className="absolute right-2 cursor-pointer"
                  onClick={() => setKeyword(tmpKeyword)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      fill="none"
                      stroke="#bc5b39"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.5 15.5L20 20M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                    />
                  </svg>
                </div>
              </div>
              {/* 정렬 드롭다운 */}
              <select
                value={sortType}
                onChange={(e) => handleSort(e.target.value)}
                className="px-2 h-8 ml-8 mr-8 rounded-full border bg-white focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
                style={{ height: "30px" }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* 글 목록, 페이지네이션 */}
        <div className="p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
          <ListRender
            data={articles}
            renderItem={renderItem}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemCategory="article"
          />
        </div>
      </main>
    </div>
  );
};

export default ArticleList;
