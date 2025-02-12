import { useState } from "react";
import PropTypes from "prop-types";
import { registDocumentContent } from "../Hooks/adminPostService";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const RegistDocsContent = ({ docsId, open, onClose }) => {
  const [content, setContent] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const originDocumentData = content;
    console.log("원본 내용입니다. : ", originDocumentData.toString());
    const status = await registDocumentContent(docsId, originDocumentData);
    if (status === 200) {
      toast.success("문서 원본 업로드 성공");
      onClose();
    } else {
      toast.error("문서 원본 업로드 실패");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">문서 내용 등록</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="여기에 문서 내용을 붙여넣으세요..."
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-[#bc5b39] rounded-md hover:bg-[#a34e31]"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

RegistDocsContent.propTypes = {
  docsId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RegistDocsContent;
