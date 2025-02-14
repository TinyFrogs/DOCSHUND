import propTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";
import ReplyItemService from "../services/replyItemService";
import RectBtn from "../../../components/button/rectBtn";

const ReplyTextarea = ({ reCommentFlag, commentId }) => {
  const { articleId } = useParams();
  const [replyContent, setReplyContent] = useState("");
  const [contentLength, setContentLength] = useState(0);

  const setIsReplied = communityArticleStore((state) => state.setIsReplied);

  // Debounced submit handler
  const debouncedSubmit = useCallback(
    debounce(async (content, isReComment, commentId) => {
      if (!content.trim()) {
        toast.warn("댓글을 입력해주세요.");
        return;
      } else if (content.length > 5000) {
        toast.warn("댓글은 5,000자 이하로 입력해주세요.");
        return;
      }

      try {
        if (isReComment) {
          await ReplyItemService.postReReplyItem(articleId, commentId, content);
        } else {
          await ReplyItemService.postReplyItem(articleId, content);
        }

        setReplyContent("");
        setContentLength(0);
        setIsReplied((prev) => !prev);
      } catch (error) {
        toast.error("댓글 작성에 실패했습니다.");
        return error;
      }
    }, 500),
    [articleId, setIsReplied]
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  const handleSubmit = () => {
    debouncedSubmit(replyContent, reCommentFlag, commentId);
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
