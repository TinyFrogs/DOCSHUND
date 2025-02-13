import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import MyCommentService from "../../services/myCommentService";
import myCommentStore from "../../../../store/myPageStore/myCommentStore";
import ListRender from "../../../../components/pagination/listRender";

const MyCommentPage = () => {
  const token = localStorage.getItem("token");

  const comments = myCommentStore((state) => state.comments);

  const setComments = myCommentStore((state) => state.setComments);
  const setLoading = myCommentStore((state) => state.setLoading);
  const setError = myCommentStore((state) => state.setError);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  // comments 데이터를 가져오는 useEffect
  useEffect(() => {
    // 로딩 시작
    setLoading(true);

    // comments 데이터를 가져오는 함수
    const fetchComments = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;

          const data = await MyCommentService.fetchComments(userId);

          // data가 존재하면 setComments로 데이터를 저장
          if (data.length > 0) {
            setComments(data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [token]);

  // 페이지네이션 관련 상태들을 하나의 useEffect로 통합
  useEffect(() => {
    if (comments.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, comments.length);
      const newTotalPages = Math.ceil(comments.length / itemsPerPage);

      setTotalPages(newTotalPages);
      setCurrentData(comments.slice(startIndex, endIndex));
    }
  }, [comments, currentPage, itemsPerPage]);

  const renderComment = (item) => (
    <div className="flex justify-between text-lg px-3">
      <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all">
        <Link
          to={`/community/article/${item.articleId}`}
          className="text-[#7d7c77] hover:text-[#bc5b39]"
        >
          {item.content}
        </Link>
      </div>
      <p className="whitespace-nowrap">{item.createdAt}</p>
    </div>
  );

  return (
    <div className="p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
      <ListRender
        data={currentData}
        renderItem={renderComment}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCategory="comment"
      />
    </div>
  );
};

export default MyCommentPage;
