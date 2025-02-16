import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Layout } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import docsStore from "../../../store/translateStore/docsStore";
import docsCategoryStore from "../../../store/docsCategoryStore";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";
import { fetchDocsList } from "../../translate/services/translateGetService";

// TODO: 디자인 수정(패딩, 마진 등)

const CommunityLeftNav = () => {
  // docsList를 가져옴
  const docsList = docsStore((state) => state.docsList);
  const setDocsList = docsStore((state) => state.setDocsList);

  // 대분류 목록과 소분류 목록을 가져옴
  const setPositions = docsCategoryStore((state) => state.setPositions);
  const category = communityArticleStore((state) => state.category); // 소분류 카테고리(단일)
  const setCategory = communityArticleStore((state) => state.setCategory);
  const setDocumentNames = docsCategoryStore((state) => state.setDocumentNames);
  const clearArticles = communityArticleStore((state) => state.clearArticles);

  // 대분류와 소분류 목록을 저장할 Map
  const [positionMap, setPositionMap] = useState(new Map());
  const [expandedSections, setExpandedSections] = useState({});
  const [navData, setNavData] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  // 섹션 토글 hook
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // 카테고리 및 문서 목록 가져오기
  useEffect(() => {
    async function asyncFetchDocsList() {
      try {
        // store에 docsList가 저장돼있지 않으면
        if (docsList.length === 0) {
          const response = await fetchDocsList(); // docsList 호출
          // response가 있으면
          if (response) {
            setDocsList(response); // store에 저장
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    asyncFetchDocsList();
  }, []); // 빈 의존성 배열 추가

  // navData 초기화 부분 수정
  useEffect(() => {
    try {
      if (docsList.length > 0) {
        const newPositionMap = new Map();

        // 대분류와 소분류 목록을 Map에 추가
        docsList.forEach((docs) => {
          if (docs.position && docs.documentName) {
            if (!newPositionMap.has(docs.position)) {
              newPositionMap.set(docs.position, new Set([docs.documentName]));
            } else {
              newPositionMap.get(docs.position).add(docs.documentName);
            }
          }
        });

        setPositionMap(newPositionMap);
        const newPositions = Array.from(newPositionMap.keys());
        setPositions(newPositions);

        // 섹션 토글 초기화
        const initialExpanded = {};
        newPositions.forEach((position) => {
          initialExpanded[position] = true;
        });
        setExpandedSections(initialExpanded);

        // navData 초기화
        const initialNavData = {};
        newPositions.forEach((position) => {
          initialNavData[position] = Array.from(
            newPositionMap.get(position) || new Set()
          );
        });

        // 초기화된 데이터를 state에 저장
        setNavData(initialNavData);
        setDocumentNames(initialNavData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [docsList, setPositions]); // 필요한 의존성만 추가

  return (
    <div className="w-auto min-h-screen p-4">
      <nav className="border-1 border-[#E1E1DF] rounded-xl px-4 py-5 bg-[#FFFFFF]">
        <button
          onClick={() => {
            clearArticles();
            navigate("/community");
          }}
          className="text-sm hover:text-[#bc5b39] cursor-pointer py-1 mb-3"
        >
          {"전체 보기"}
        </button>
        {/* navData에 있는 각 entry들 조회 */}
        {Object.entries(navData).map(([section, items]) => (
          <div key={section} className="mb-2">
            <button
              onClick={() => toggleSection(section)}
              className="w-full flex items-center justify-between p-2 bg-[#bc5b39] text-white rounded cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layout size={18} />
                <span className="text-sm font-medium">{section}</span>
              </div>
              {expandedSections[section] ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {expandedSections[section] && (
              <ul className="mt-1 ml-6 space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className={`                      
                      text-sm hover:text-[#bc5b39] cursor-pointer py-1
                      ${category === item ? "text-[#bc5b39]" : "text-[#7D7C77]"}
                      `}
                    onClick={() => {
                      // 문서(소분류) 제목 변경
                      setCategory(item);
                      if (!location.pathname.includes("list")) {
                        // 카테고리에 해당하는 articleList 호출
                        navigate(`/community/list`);
                      }
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default CommunityLeftNav;
