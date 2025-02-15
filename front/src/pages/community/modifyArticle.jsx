import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";

// stroe
import communityArticleStore from "../../store/communityStore/communityArticleStore";
import docsCategoryStore from "../../store/docsCategoryStore";
import useEditorStore from "../../store/translateStore/editorStore";

// components
import CommunityHeader from "./components/communityHeader";
import EditorContent from "../translate/components/editorContent";
import ArticleItemService from "./services/articleItemService";

const ModifyArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const articleItems = communityArticleStore((state) => state.articleItems);
  const setArticleItems = communityArticleStore(
    (state) => state.setArticleItems
  );

  const [title, setTitle] = useState(""); // 제목 상태
  const [mainCategory, setMainCategory] = useState(articleItems.position); // 대분류 선택 상태
  const [subCategory, setSubCategory] = useState(articleItems.documentName); // 소분류 선택 상태
  const [file, setFile] = useState(null); // 첨부 파일 상태
  const [imageUrl, setImageUrl] = useState(""); // 이미지 URL 상태
  const [content, setContent] = useState(articleItems.content); // 내용 상태

  const documentNames = docsCategoryStore((state) => state.documentNames);
  const setFileUrl = communityArticleStore((state) => state.setFileUrl);

  useEffect(() => {
    const loadArticleData = async () => {
      try {
        // articleItems가 비어있거나 현재 articleId와 다른 경우에만 데이터를 새로 불러옵니다
        if (!articleItems?.articleId && articleItems.articleId !== articleId) {
          const data = await ArticleItemService.fetchArticleItem(articleId);
          setArticleItems(data); // store에 데이터 저장

          if (data) {
            // 로컬 상태 업데이트
            setTitle(data.title);
            setMainCategory(data.position);
            setSubCategory(data.documentName);
            setContent(data.content);
          }
        } else {
          // store에 있는 데이터 사용
          setTitle(articleItems.title);
          setMainCategory(articleItems.position);
          setSubCategory(articleItems.documentName);
          setContent(articleItems.content);
        }
      } catch (error) {
        console.error("Failed to load article:", error);
        toast.error("게시글을 불러오는데 실패했습니다.");
      }
    };

    loadArticleData();
  }, [articleId]);

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
  const handleFileChange = _.debounce(async (e) => {
    const selectedFile = e.target.files[0];

    // INFO: 파일 타입 조회해서 이미지만 가능하게
    if (!selectedFile.type.includes("image"))
      return toast.info("이미지 파일만 업로드 가능합니다.");

    if (selectedFile) {
      if (selectedFile.size > 5 * 1000 * 1000) {
        // 5MB 제한
        toast.info("사진 크기는 최대 5MB까지 업로드 가능합니다.");
        return;
      }

      setFile(selectedFile);

      // S3에 파일 업로드 후 url 받아오기
      const response = await ArticleItemService.uploadImageFile(
        e.target.files[0]
      );

      setImageUrl(response.data.imageUrl); // 이미지 URL 상태 업데이트
    }
  }, 300);

  // 파일 첨부 취소 핸들링 함수
  const handleFileCancel = () => {
    setFile(null);
  };

  // 실제 제출 로직을 별도 함수로 분리
  const submitArticle = _.debounce(async () => {
    try {
      // 제목, 대분류, 소분류, 내용, 파일이 모두 입력되었는지 확인
      if (!title || !mainCategory || !subCategory || !content) {
        toast.warn("모든 항목을 입력해주세요.");
        return;
      }

      const response = await ArticleItemService.patchArticleItem(
        articleId,
        title,
        subCategory,
        content
      );

      if (response.status === 204) {
        setArticleItems({
          ...articleItems,
          title,
          position: mainCategory,
          documentName: subCategory,
          content,
        });
        toast.info("글 수정이 완료되었습니다.");
        navigate(`/community/article/${articleId}`);
      }
    } catch (error) {
      console.error("Failed to modify article:", error);
      toast.error("게시글 수정에 실패했습니다.");
    }
  }, 500);

  // form 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 동작 즉시 방지
    submitArticle(); // 디바운스된 제출 로직 호출
  };

  return (
    // 불필요한 div 제거
    <div className="flex justify-center w-full min-w-[768px]">
      <main className="flex-1 p-8 max-w-[1280px] min-w-[768px]">
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
                    // NOTE: Modify는 기존의 데이터가 들어감
                    value={title}
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
                    <EditorContent
                      initialTextContent={content}
                      maxLength={15000}
                    />
                  </div>
                </div>

                {/* 파일 첨부 */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <label className="block text-lg font-medium text-black">
                      사진 첨부
                    </label>
                    {file && (
                      <p className="text-sm text-gray-800 ml-6">
                        파일 제목 혹은 사진을 선택해 본문에 첨부할 수 있습니다.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        // INFO: 파일 첨부 로직(s3에 업로드 후 url 받아오기)
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
                      <div className="ml-4 flex items-center gap-4">
                        <img
                          src={imageUrl}
                          alt="이미지 파일 미리보기"
                          className="h-24 w-24 object-cover rounded-md border border-gray-300 cursor-pointer"
                          onClick={() => {
                            setFileUrl(imageUrl);
                          }}
                        />
                        <p
                          className="text-sm text-black mr-2 truncate max-w-md cursor-pointer hover:underline border border-gray-300 rounded-md px-2 py-1"
                          onClick={() => {
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

export default ModifyArticle;
