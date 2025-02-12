import propTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";

import communityArticleStore from "../../../store/communityStore/communityArticleStore";
import ReplyItemService from "../services/replyItemService";
import RectBtn from "../../../components/button/rectBtn";

const ReplyTextarea = ({ reCommentFlag, commentId }) => {
  const { articleId } = useParams();
  const [replyContent, setReplyContent] = useState("");
  const [contentLength, setContentLength] = useState(0);

  // store에서 데이터를 가져오기 위해 정의
  const setIsReplied = communityArticleStore((state) => state.setIsReplied);

  const handleContentLength = (e) => {
    setContentLength(replyContent.length);
  };

  // 댓글 작성
  const handleSubmit = async () => {
    if (!replyContent.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    } else if (replyContent.length > 5000) {
      alert("댓글은 10,000자 이하로 입력해주세요.");
      return;
    }

    // NOTE: 대댓글인지 원댓글인지에 따라 다르게 처리
    // 1. 대댓글 작성
    if (reCommentFlag) {
      // 대댓글 작성 시에는 대댓글을 작성하는 원댓글의 id를 가져와야 함
      const response = await ReplyItemService.postReReplyItem(
        articleId,
        commentId,
        replyContent
      );
    } else {
      // 2. 원댓글 작성
      const response = await ReplyItemService.postReplyItem(
        articleId,
        replyContent
      );
    }

    setReplyContent(""); // 제출 후 입력창 초기화
    setContentLength(0); // 제출 후 글자 수 초기화

    // 제출 후 댓글 리스트 리렌더링
    setIsReplied((prev) => !prev);
  };

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col gap-3">
        <textarea
          value={replyContent}
          onChange={(e) => {
            setReplyContent(e.target.value);
            setContentLength(e.target.value.length);
          }}
          placeholder="댓글을 입력해주세요."
          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        ></textarea>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              contentLength > 5000 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {contentLength.toLocaleString()} / 5,000자
          </span>
          <RectBtn
            onClick={handleSubmit}
            text="댓글 작성"
            className="w-28 h-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

ReplyTextarea.propTypes = {
  reCommentFlag: propTypes.bool,
  commentId: propTypes.number,
};

export default ReplyTextarea;
