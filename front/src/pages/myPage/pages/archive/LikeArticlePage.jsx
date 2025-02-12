import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import LikeArticleService from "../../services/likeArticleService";
import LikeArticleStore from "../../../../store/myPageStore/likeArticleStore";

import ListRender from "../../../../components/pagination/listRender";
import like from "../../../../assets/icon/heartFilled24.png";
import likeCancel from "../../../../assets/icon/heartEmpty24.png";

const LikeArticlePage = () => {
  // store에서 데이터를 가져오기 위해 store의 상태 정의
  const likeArticles = LikeArticleStore((state) => state.likeArticles);
  const totalPages = LikeArticleStore((state) => state.totalPages);
  const currentPage = LikeArticleStore((state) => state.currentPage);

  // set(메소드) 정의
  const setLikeArticles = LikeArticleStore((state) => state.setLikeArticles);
  const setTotalPages = LikeArticleStore((state) => state.setTotalPages);
  const setCurrentPage = LikeArticleStore((state) => state.setCurrentPage);
  const setLoading = LikeArticleStore((state) => state.setLoading);
  const setError = LikeArticleStore((state) => state.setError);

  const [itemsPerPage, setItmesPerPage] = useState(15);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await LikeArticleService.fetchArticles(
          currentPage,
          itemsPerPage
        );

        console.log(data);

        // 데이터가 비어있지 않다면
        if (data.content.length > 0) {
          setLikeArticles(data.content); // 게시글 목록 설정 TODO: data.content가 왜 바인딩 안되는지 확인
          setTotalPages(data.totalPages); // 전체 페이지 수
          setCurrentPage(data.pageable.pageNumber); // 현재 페이지
          setItmesPerPage(data.numberOfElements); // 페이지당 보여줄 게시글 수
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, itemsPerPage]);

  const handleLikeClick = async (item) => {
    await handleLikeToggle("article", item.articleId);
    setLikedItems((prev) => ({
      ...prev,
      [item.articleId]: !prev[item.articleId],
    }));
  };

  const renderArticle = (item) => (
    <div className="flex justify-between text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 flex flex-col justify-between">
        <Link
          to={`/community/article/${item.articleId}`}
          className="font-semibold line-clamp-1 break-all text-[#7d7c77] hover:text-[#bc5b39]"
        >
          {item.title}
        </Link>
        <p className="text-base line-clamp-1 break-all">{item.content}</p>
      </div>
      <div className="flex space-x-6 items-center">
        <p>{item.createAt}</p>
        <p>{item.nickname}</p>
        <button onClick={() => handleLikeClick(item)}>
          <img
            src={likedItems[item.articleId] ? likeCancel : like}
            alt="좋아요 아이콘"
            className="w-6 h-6 cursor-pointer"
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
      <ListRender
        data={likeArticles}
        renderItem={renderArticle}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCategory="article"
      />
    </div>
  );
};

export default LikeArticlePage;
