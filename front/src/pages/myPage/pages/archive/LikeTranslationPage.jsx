import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import useKoreanTime from "../../../../hooks/useKoreanTime";

import TranslationStore from "../../../../store/myPageStore/translationStore";
import ListRender from "../../../../components/pagination/listRender";
import like from "../../../../assets/icon/heartFilled24.png";
import likeCancel from "../../../../assets/icon/heartEmpty24.png";
import LikeTranslationService from "../../services/likeTranslationService";

const LikeTranslationPage = () => {
  const { convertToKoreanTime } = useKoreanTime();
  const token = localStorage.getItem("token");
  const { handleLikeToggle } = useOutletContext();

  const likeTranslations = TranslationStore((state) => state.likeTranslations);
  const setLikeTranslations = TranslationStore(
    (state) => state.setLikeTranslations
  );
  const setLoading = TranslationStore((state) => state.setLoading);
  const setError = TranslationStore((state) => state.setError);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    setLoading(true);
    const fetchTranslations = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;

          const data = await LikeTranslationService.fetchTranslations(userId);

          if (data.length > 0) {
            setLikeTranslations(data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranslations();
  }, [token]);

  useEffect(() => {
    if (likeTranslations.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        likeTranslations.length
      );
      const newTotalPages = Math.ceil(likeTranslations.length / itemsPerPage);

      setTotalPages(newTotalPages);
      setCurrentData(likeTranslations.slice(startIndex, endIndex));
    }
  }, [likeTranslations, currentPage, itemsPerPage]);

  const handleLikeClick = async (item) => {
    await handleLikeToggle("trans", item.docsId, item.transId);
    setLikedItems((prev) => ({
      ...prev,
      [item.transId]: !prev[item.transId],
    }));
  };

  const renderTranslation = (item) => (
    <div className="flex justify-between text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all">
        <Link
          to={`/translate/main/viewer/${item.docsId}`}
          className="text-[#7d7c77] hover:text-[#bc5b39]"
        >
          {item.documentName} {item.pOrder}번째 문단 번역본
        </Link>
      </div>
      <div className="flex space-x-6">
        <p className="whitespace-nowrap">{item.nickname}</p>
        <p className="whitespace-nowrap">
          {convertToKoreanTime(item.createdAt)}
        </p>
        <button onClick={() => handleLikeClick(item)}>
          <img
            src={likedItems[item.transId] ? likeCancel : like}
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
        data={currentData}
        renderItem={renderTranslation}
        totalPages={likeTranslations.length > 0 ? totalPages : 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCategory={"trans"}
      />
    </div>
  );
};
export default LikeTranslationPage;
