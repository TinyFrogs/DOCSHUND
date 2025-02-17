import { useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import useUserProfileStore from "../../store/myPageStore/userProfileStore";
import useAuthStore from "../../store/authStore";

import InquiryService from "../../services/helpDeskServices/inquiryService";
import LodingImage from "../../assets/loading.gif";

const InquiryFormPage = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { profile } = useUserProfileStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (profile && profile.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  useEffect(() => {
    if (!token) {
      setEmail("");
    }
  }, [token]);

  const MAX_TITLE_LENGTH = 50;
  const MAX_CONTENT_LENGTH = 2000;

  const debouncedSubmit = useCallback(
    _.debounce(async (inquiry, formData) => {
      try {
        await InquiryService.submitInquiry(formData);
        setCategory("");
        setTitle("");
        setEmail("");
        setContent("");
        setFile(null);
        toast.success("문의가 성공적으로 제출되었습니다.");
      } catch (error) {
        toast.error("문의 제출 중 오류가 발생했습니다.");
        console.error("문의 등록 실패", error);
      } finally {
        setLoading(false);
      }
    }, 1000),
    [navigate]
  );

  useEffect(() => {
    return () => {
      debouncedSubmit.cancel();
    };
  }, [debouncedSubmit]);

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!category || !title || !email || !content) {
      toast.info("문의 카테고리, 제목, 이메일, 내용을 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    // 이메일 도메인에 "github"가 포함된 경우 제출 차단
    const emailParts = email.split("@");
    if (
      emailParts.length > 1 &&
      emailParts[1].toLowerCase().includes("github")
    ) {
      toast.info("유효하지 않은 이메일 도메인입니다.");
      setLoading(false);
      return;
    }

    let userId = null;
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    }

    const inquiry = {
      title,
      category,
      content,
      email,
    };

    if (userId) {
      inquiry.userId = userId;
    }

    const formData = new FormData();
    formData.append(
      "inquiry",
      new Blob([JSON.stringify(inquiry)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    debouncedSubmit(inquiry, formData);
  };

  // 파일 용량 제한 및 형식 체크
  const MAX_FILE_SIZE = 10 * 1000 * 1000;
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (selectedFile && !validTypes.includes(selectedFile.type)) {
      toast.warn("올바른 파일형식이 아닙니다.");
      e.target.value = "";
      return;
    }
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.warn("파일 크기는 최대 10MB까지 업로드 가능합니다.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleFileCancel = () => {
    setFile(null);
  };

  return (
    <div className="p-4 md:p-10 bg-white rounded-bl-xl rounded-br-xl border border-[#E1E1DF] text-[#7D7C77] mb-5">
      <form onSubmit={handleSubmit}>
        {/* 문의 카테고리 */}
        <div className="mb-6">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            문의 카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
          >
            <option value="">카테고리를 선택하세요</option>
            <option value="DOCUMENT_REQUEST">문서등록요청</option>
            <option value="MEMBER">회원관련</option>
            <option value="REPORT">신고관련</option>
          </select>
        </div>
        {/* 제목 */}
        <div className="mb-4">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) =>
              e.target.value.length <= MAX_TITLE_LENGTH &&
              setTitle(e.target.value)
            }
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
            placeholder="제목을 입력하세요"
          />
          <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
            {title.length} / {MAX_TITLE_LENGTH}
          </p>
        </div>
        {/* 이메일 */}
        <div className="mb-6">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            이메일 <span className="text-red-500">*</span>{" "}
            <span className="text-xs text-gray-500 mt-1 mr-2">
              이메일을 잘못 입력한 경우, 메일이 전송되지 않을 수 있습니다.
            </span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                setEmail(e.target.value);
              }
            }}
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
            placeholder="이메일을 입력하세요"
          />
        </div>
        {/* 내용 */}
        <div className="mb-4">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) =>
              e.target.value.length <= MAX_CONTENT_LENGTH &&
              setContent(e.target.value)
            }
            className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] text-xs md:text-sm"
            placeholder="내용을 입력하세요"
            style={{ height: "200px", resize: "none" }}
          ></textarea>
          <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
            {content.length} / {MAX_CONTENT_LENGTH}
          </p>
        </div>
        {/* 사진 첨부 */}
        <div className="mb-6">
          <label className="block text-base md:text-lg font-medium text-black mb-2">
            사진 첨부 (1개만 가능)
          </label>
          <div className="flex items-center">
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center hover:bg-[#C96442] text-xs md:text-sm cursor-pointer">
                사진 선택
              </div>
            </div>
            {!file && (
              <p className="ml-4 text-xs md:text-sm text-gray-500">
                첨부할 사진을 선택하세요
              </p>
            )}
            {file && (
              <div className="ml-4 flex items-center">
                <p className="text-xs md:text-sm text-gray-500 mr-2 truncate max-w-md">
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={handleFileCancel}
                  className="py-1 px-2 hover:text-red-600 text-xs md:text-sm underline cursor-pointer"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 제출 버튼 */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442] cursor-pointer text-xs md:text-sm"
          >
            보내기
          </button>
        </div>
      </form>

      {loading && (
        <div className="fixed inset-0 bg-opacity-50 flex flex-col justify-center items-center z-50 backdrop-brightness-80">
          <img src={LodingImage} alt="로딩중" />
        </div>
      )}
    </div>
  );
};

export default InquiryFormPage;
