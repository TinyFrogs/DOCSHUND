import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDocsStore from "../../store/translateStore/docsStore";
import { fetchDocsList } from "./hooks/translateGetService";
import { likeDocs } from "./hooks/translatePostService";
import { motion } from "framer-motion";

const TransLatePage = () => {
  const [docsCategories, setDocsCategories] = useState(["1", "2"]);

  const { docsList, setDocsList } = useDocsStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const tmpDocsList = await fetchDocsList();
      setDocsList(tmpDocsList);
    };
    fetchData();
  }, []);

  const handleLike = async (docsId) => {
    await likeDocs(docsId);
    const tmpDocsList = await fetchDocsList();
    setDocsList(tmpDocsList);
  };

  return (
    <div className="min-h-screen text-center bg-gradient-to-b from-white to-[#F5E6DA]">
      <div className="max-w-6xl mx-auto px-8">
        <div>
          {/* hero */}
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-[#5C3B23] drop-shadow-md">
              공식문서 번역 라이브러리
            </h1>
            <p className="text-lg text-[#7C543F] mt-4">
              다양한 번역 문서를 한 곳에서 찾아보세요.
            </p>
          </motion.div>

          {/* most popular */}
          <div className="relative bg-[#F7F3EC] p-5 rounded-xl shadow-xl">
            <h2 className="text-left text-2xl font-semibold text-[#BC5B39] mb-8">
              인기 번역 문서
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
              {docsList.slice(0, 4).map((items, index) => (
                <motion.div
                  key={items.docsId}
                  className="relative w-48 h-64 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105 border border-[#E8E5E1]"
                  onClick={() =>
                    navigate(`/translate/main/viewer/${items.docsId}`)
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#D8B6A0] shadow-md rounded-r-lg"></div>
                  <div className="flex flex-col items-center py-8 ml-8">
                    <img
                      src={items.documentLogo}
                      alt="문서 로고"
                      className="w-32 h-32 object-contain rounded-full border border-[#E8E5E1]"
                    />
                    <div className="w-32 text-center text-[#BC5B39] text-base font-semibold p-4 break-words">
                      {items.documentName}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="w-full h-6 bg-[#E3DAC9] shadow-md rounded-t-lg mt-5"></div>
          </div>
        </div>

        {/* 문서 전체 목록 */}
        <div>
          {/* 카테고리 */}
          <div className="flex flex-wrap gap-3 justify-center my-16">
            {docsCategories.map((docsCategory, index) => (
              <button
                className="cursor-pointer px-6 py-2 rounded-full bg-white text-gray-700 hover:text-white hover:bg-[rgba(188,91,57,0.8)] transition-all duration-200 shadow-sm border border-gray-200 font-medium"
                key={index}
              >
                {docsCategory}
              </button>
            ))}
          </div>

          {/* 전체 문서 카드 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {docsList.map((docs, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {localStorage.getItem("token") && (
                  <button
                    onClick={() => handleLike(docs.docsId)}
                    className={`absolute right-2 top-2 p-2 rounded-full transition-all duration-300 cursor-pointer ${
                      docs.likeUserIds.includes(
                        Number(localStorage.getItem("userId"))
                      )
                        ? "bg-[#BC5B39] text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    <svg
                      className="h-6 w-6"
                      fill={
                        docs.likeUserIds.includes(
                          Number(localStorage.getItem("userId"))
                        )
                          ? "white"
                          : "currentColor"
                      }
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                )}
                <div className="p-6 flex flex-col items-center">
                  <div className="bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    <img src={docs.documentLogo} alt="문서 아이콘" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {docs.documentName}
                  </h3>
                  <button
                    onClick={() => {
                      navigate(`/translate/main/viewer/${docs.docsId}`);
                    }}
                    className="cursor-pointer mt-4 px-6 py-2 bg-[rgba(188,91,57,1)] text-white rounded-lg hover:bg-[rgba(188,91,57,0.8)] transition-colors duration-200 font-medium"
                  >
                    {localStorage.getItem("token") ? "번역 하기" : "번역 보기"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center my-16">
          <div className="w-1/5 border-t border-gray-300"></div>
        </div>

        {/* 문서 신청 */}
        <div className="pb-20 text-center">
          <h2 className="text-3xl font-semibold text-[#BC5B39]">
            원하는 문서를 찾을 수 없나요?
          </h2>
          <p className="text-md text-[#7C543F] mt-2">
            새로운 문서를 신청하면 빠르게 추가해드립니다.
          </p>
          <button
            onClick={() => navigate("/helpDesk/inquiryForm")}
            className="mt-6 px-6 py-3 bg-[#BC5B39] text-white rounded-lg hover:bg-[#9E482E] font-semibold text-lg shadow-md transition-all duration-300"
          >
            문서 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransLatePage;
