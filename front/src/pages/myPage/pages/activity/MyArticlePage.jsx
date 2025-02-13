import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import ListRender from "../../../../components/pagination/listRender";
import MyArticleStore from "../../../../store/myPageStore/myArticleStore";
import MyArticleService from "../../services/myArticleService";
import like from "../../../../assets/icon/heartFilled24.png";
import view from "../../../../assets/icon/viewCnt.png";
import comment from "../../../../assets/icon/commentCnt.png";

const MyArticlePage = () => {
  const token = localStorage.getItem("token");

  //  store에서 데이터를 가져오기 위해 store의 상태 정의
  const myArticles = MyArticleStore((state) => state.myArticles);
  const totalPages = MyArticleStore((state) => state.totalPages);
  const currentPage = MyArticleStore((state) => state.currentPage);

  // set(메소드) 정의
  const setMyArticles = MyArticleStore((state) => state.setMyArticles);
  const setTotalPages = MyArticleStore((state) => state.setTotalPages);
  const setCurrentPage = MyArticleStore((state) => state.setCurrentPage);
  const setLoading = MyArticleStore((state) => state.setLoading);
  const setError = MyArticleStore((state) => state.setError);

  // TODO: 로그인 상태 확인 로직 필요, 토큰 실어 보내는 로직 추가
  const [itemsPerPage, setItmesPerPage] = useState(15); // 페이지당 보여줄 게시글 수

  // NOTE: 즉시 store에 접근하여 데이터를 가져오기 위해 useEffect 사용
  useEffect(() => {
    // 비동기 함수를 만들어서 데이터를 가져오는 로직을 작성
    const fetchArticles = async () => {
      // 데이터를 가져오기 전에 로딩 상태를 true로 변경
      setLoading(true);

      // 데이터 가져오기
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;

          // articleListService.fetchArticles 함수를 호출하여 데이터를 가져옴
          const data = await MyArticleService.fetchArticles(
            userId, // 유저 아이디
            currentPage, // 현재 페이지
            itemsPerPage // 페이지당 보여줄 게시글 수
          );

          // 가져온 데이터를 store에 저장
          // 데이터가 비어있지 않을 때
          if (!data.empty && data.content.length > 0) {
            setMyArticles(data.content); // 게시글 목록 설정
            setTotalPages(data.totalPages); // 전체 페이지 수
            setCurrentPage(data.pageable.pageNumber); // 현재 페이지
            setItmesPerPage(data.size); // 페이지당 보여줄 게시글 수
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    // 함수 실행
    fetchArticles();
  }, [token, currentPage, itemsPerPage]);

  const renderArticle = (item) => (
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
        <p className="text-base">{item.createdAt}</p>
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
    <div className="p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
      <ListRender
        data={myArticles}
        renderItem={renderArticle}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCategory="article"
      />
    </div>
  );
};

export default MyArticlePage;
