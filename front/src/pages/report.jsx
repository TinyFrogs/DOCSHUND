import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { toast } from "react-toastify";
import Modal from "react-modal";
import ReportStore from "../store/reportStore";
import ReportService from "../services/reportService";
import _ from "lodash";

import { X } from "lucide-react";

const ReportModal = () => {
  const navigate = useNavigate();

  const {
    originContent,
    reportedUser,
    commentId,
    articleId,
    transId,
    chatId,
    isReportOpen,
    isReportVisible,
    closeReport,
    toggleReport,
  } = ReportStore();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isSelected, setIsSelected] = useState(true);

  const MAX_CONTENT_LENGTH = 500;

  const debouncedHandleSubmit = _.debounce(async (e) => {
    e.preventDefault();
    if (!category || !content) {
      toast.warn("신고 카테고리, 내용을 모두 입력해주세요.");
      return;
    }

    let userId = null;
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    }

    const report = {
      category,
      originContent,
      content,
      reportedUser,
      commentId,
      articleId,
      transId,
      chatId,
    };

    if (userId) {
      report.userId = userId;
    }

    const formData = new FormData();
    formData.append(
      "report",
      new Blob([JSON.stringify(report)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    try {
      await ReportService.submitReport(formData);
      toast.success("신고가 성공적으로 제출되었습니다.");
      setCategory("");
      setTitle("");
      setEmail("");
      setContent("");
      setFile(null);
    } catch (error) {
      toast.error("신고 제출 중 오류가 발생했습니다.");
      console.log("신고 등록 실패", error);
    }

    toggleReport();
    closeReport();
  }, 1000);

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedHandleSubmit(e);
  };

  const MAX_FILE_SIZE = 5 * 1000 * 1000;
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.warn("올바른 파일형식이 아닙니다.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.warn("파일 크기는 최대 5MB까지 업로드 가능합니다.");
      return;
    }
    setFile(selectedFile);
  };

  const handleFileCancel = () => {
    setFile(null);
  };

  return (
    <AnimatePresence>
      {isReportOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[2200] backdrop-brightness-60 border-box w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <motion.div
            key="editor-modal"
            className="fixed inset-0 flex items-center justify-center min-w-full min-h-full "
          >
            <div className="p-6 bg-white h-fit rounded-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77] mb-5">
              <div className="w-full h-fit flex justify-end items-center">
                <button
                  onClick={() => {
                    closeReport();
                  }}
                  className="cursor-pointer"
                >
                  <X className="text-red-800 " />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-lg font-medium text-black mb-2">
                    신고 카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                  >
                    {isSelected && (
                      <option value="">카테고리를 선택하세요</option>
                    )}

                    <option
                      onClick={() => setIsSelected(false)}
                      value="ABUSIVE_LANGUAGE_OR_VIOLENCE"
                    >
                      욕설 및 폭력성
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="EXPLICIT_OR_ILLEGAL_CONTENT"
                    >
                      음란물 및 불법 콘텐츠
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="PROMOTING_GAMBLING"
                    >
                      사행성 조장
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="SPAM_OR_ADVERTISING"
                    >
                      스팸 및 광고
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="FLOODING"
                    >
                      도배
                    </option>
                    <option
                      onClick={() => setIsSelected(false)}
                      value="PERSONAL_INFORMATION_EXPOSURE"
                    >
                      개인정보 노출
                    </option>
                    <option value="COPYRIGHT_INFRINGEMENT">저작권 침해</option>
                    <option value="OTHER">기타</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-lg font-medium text-black mb-2">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) =>
                      e.target.value.length <= MAX_CONTENT_LENGTH &&
                      setContent(e.target.value)
                    }
                    className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                    placeholder="내용을 입력하세요"
                    style={{ height: "250px", resize: "none" }}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                    {content.length} / {MAX_CONTENT_LENGTH}
                  </p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center cursor-pointer hover:bg-[#C96442] text-sm">
                        사진 선택
                      </div>
                    </div>
                    {!file && (
                      <p className="ml-4 text-sm text-gray-500">
                        첨부할 사진을 선택하세요 (1개만 가능)
                      </p>
                    )}
                    {file && (
                      <div className="ml-4 flex items-center">
                        <p className="text-sm text-gray-500 mr-2 truncate max-w-md">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={handleFileCancel}
                          className="py-1 px-2 hover:text-red-600 text-sm underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442] cursor-pointer"
                  >
                    신고하기
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
