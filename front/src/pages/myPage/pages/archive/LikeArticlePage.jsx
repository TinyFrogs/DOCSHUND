import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import LikeArticleService from "../../services/likeArticleService";
import communityArticleStore from "../../../../store/communityStore/communityArticleStore";
import ListRender from "../../../../components/pagination/listRender";
import like from "../../../../assets/icon/heartFilled24.png";
import likeCancel from "../../../../assets/icon/heartEmpty24.png";

const LikeArticlePage = () => {
  const likeArticles = communityArticleStore((state) => state.likeArticles);
  const totalPages = communityArticleStore((state) => state.totalPages);
  const currentPage = communityArticleStore((state) => state.currentPage);
  const { handleLikeToggle } = useOutletContext();

  const setLikeArticles = communityArticleStore(
    (state) => state.setLikeArticles
  );
  const setTotalPages = communityArticleStore((state) => state.setTotalPages);
  const setCurrentPage = communityArticleStore((state) => state.setCurrentPage);
  const setLoading = communityArticleStore((state) => state.setLoading);
  const setError = communityArticleStore((state) => state.setError);

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

        if (!data.empty && data.content.length > 0) {
          setLikeArticles(data.content);
          setTotalPages(data.totalPages);
          setCurrentPage(data.pageable.pageNumber);
          setItmesPerPage(data.numberOfElements);
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
          to={`/community/article/${item.id}`}
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
