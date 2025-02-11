import { useState } from "react";
import { useNavigate } from "react-router-dom";

// stroe
import communityArticleStore from "../../store/communityStore/communityArticleStore";
import docsCategoryStore from "../../store/docsCategoryStore";
import useEditorStore from "../../store/translateStore/editorStore";

// components
import CommunityHeader from "./components/communityHeader";
import EditorContent from "../translate/components/editorContent";
import ArticleItemService from "./services/articleItemService";

const WriteArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(""); // 제목 상태
  const [mainCategory, setMainCategory] = useState(""); // 대분류 선택 상태
  const [subCategory, setSubCategory] = useState(""); // 소분류 선택 상태
  const [file, setFile] = useState(null); // 첨부 파일 상태
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태

  const documentNames = docsCategoryStore((state) => state.documentNames);
  const currentUserText = useEditorStore((state) => state.currentUserText);
  const contentLength = communityArticleStore((state) => state.contentLength);
  const setContentLength = communityArticleStore(
    (state) => state.setContentLength
  );
  const setFileUrl = communityArticleStore((state) => state.setFileUrl);

  // 제목 입력 핸들러
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 대분류 선택 핸들러
  const handleMainCategoryChange = (e) => {
    const selectedMain = e.target.value;
    setMainCategory(selectedMain);
    setSubCategory(""); // 대분류가 변경되면 소분류 초기화
  };

  // 소분류 선택 핸들러
  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
  };

  // 파일 첨부 핸들링 함수
  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);

    // S3에 파일 업로드 후 url 받아오기
    const response = await ArticleItemService.uploadImageFile(
      e.target.files[0]
    );

    setImageUrl(response.data.imageUrl); // 이미지 URL 상태 업데이트
  };

  // 파일 첨부 취소 핸들링 함수
  const handleFileCancel = () => {
    setFile(null);
  };

  const handleContentLength = () => {
    setContentLength(currentUserText.length);
  };

  // 글 작성 요청
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    const content = currentUserText; // 에디터 내용

    // 제목, 대분류, 소분류, 내용, 파일이 모두 입력되었는지 확인
    if (!title || !mainCategory || !subCategory || !content) {
      alert("모든 항목을 입력해주세요.");
      return;
    } else {
      console.log(content.length);
      if (content.length > 10000) {
        alert("글 내용은 10000자 이하로 작성해주세요.");
        return;
      }

      const response = await ArticleItemService.postArticleItem(
        title,
        subCategory,
        content
      );

      const data = response.data;

      if (response.status === 200) {
        alert("글 작성이 완료되었습니다.");
        navigate(`/community/article/${data.articleId}`);
      }
    }
  };

  // DOM 요소 반환
  return (
    <div className="flex justify-center w-full">
      <main className="flex-1 p-8 max-w-[1280px]">
        {/* header */}
        <CommunityHeader />

        {/* main content */}
        <div className="bg-white rounded-tl-xl rounded-tr-xl border-t rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF]">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-[#E1E1DF] pb-4 mb-4">
                <div className="mb-6 flex items-center">
                  <label className="block text-lg font-medium text-black min-w-[100px]">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="flex-1 py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                    placeholder="제목을 입력하세요"
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-lg font-medium text-black min-w-[100px]">
                    분류 <span className="text-red-500">*</span>
                  </label>
                  {/*대분류 선택시 그에 해당하는 문서가 나오도록 */}
                  <div className="flex flex-1 gap-4">
                    <select
                      className="flex-1 py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                      onChange={handleMainCategoryChange}
                      value={mainCategory}
                    >
                      <option value="">대분류를 선택하세요</option>
                      {Object.keys(documentNames).map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                    <select
                      className="flex-1 py-2 px-3 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                      onChange={handleSubCategoryChange}
                      value={subCategory}
                    >
                      <option value="">문서를 선택하세요</option>
                      {/* mainCategory에 속하는 문서 이름만 나오게 */}
                      {mainCategory &&
                        documentNames[mainCategory]?.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 에디터 */}
              <div className="border-b border-[#E1E1DF] pb-4 mb-4">
                <div className="mb-6 mt-4">
                  <label className="block text-lg font-medium text-black mb-2">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 block w-full h-100">
                    <EditorContent initialTextContent={""} />
                  </div>
                  <div className="mt-2 flex justify-end">
                    {contentLength > 10000 ? (
                      <span
                        value={contentLength}
                        onChange={handleContentLength}
                        className="text-sm text-red-500 bg-gray-50 px-3 py-1 rounded-md"
                      >
                        글자 수: {contentLength.toLocaleString()} / 10,000
                      </span>
                    ) : (
                      <span
                        value={contentLength}
                        onChange={handleContentLength}
                        className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md"
                      >
                        글자 수: {contentLength.toLocaleString()} / 10,000
                      </span>
                    )}
                  </div>
                </div>

                {/* 파일 첨부 */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <label className="block text-lg font-medium text-black">
                      파일 첨부
                    </label>
                    {file && (
                      <p className="text-sm text-gray-800 ml-6">
                        파일 제목을 선택해 본문에 첨부할 수 있습니다.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="file"
                        // 파일 첨부 로직(s3에 업로드 후 url 받아오기)
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="py-2 px-4 bg-[#bc5b39] text-white rounded-md shadow-sm text-center cursor-pointer hover:bg-[#C96442] text-sm">
                        파일 선택
                      </div>
                    </div>
                    {!file && (
                      <p className="ml-4 text-sm text-gray-500">
                        첨부할 파일을 선택하세요 (1개만 가능)
                      </p>
                    )}
                    {file && (
                      <div className="ml-4 flex items-center">
                        <p
                          className="text-sm text-black mr-2 truncate max-w-md cursor-pointer hover:underline border border-gray-300 rounded-md px-2 py-1"
                          onClick={() => {
                            // 이미지 URL 상태 업데이트로 EditorContent의 useEffect 실행
                            setFileUrl(imageUrl);
                          }}
                        >
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
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="py-2 px-8 bg-[#bc5b39] text-white rounded-md shadow-sm hover:bg-[#C96442]"
                >
                  작성완료
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WriteArticle;
