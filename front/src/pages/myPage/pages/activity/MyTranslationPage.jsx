import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import TranslationStore from "../../../../store/myPageStore/translationStore";
import MyTranslationService from "../../services/myTranslationService";
import { fetchTranslateData } from "../../../translate/services/translateGetService";
import ListRender from "../../../../components/pagination/listRender";
import MyTranslationModal from "../../components/myTranslationModal";
import like from "../../../../assets/icon/heartFilled24.png";
import modalStore from "../../../../store/modalStore";
import { format, isSameDay } from "date-fns";
import { ChevronUp, ChevronDown } from "lucide-react";

const MyTranslationPage = () => {
  const { setOpenId, openId, closeModal } = modalStore();

  const token = localStorage.getItem("token");

  // store에서 데이터를 가져오기 위해 store의 상태 정의
  const myTranslations = TranslationStore((state) => state.myTranslations);

  // set(메소드) 정의
  const setMyTranslations = TranslationStore(
    (state) => state.setMyTranslations
  );
  const setLoading = TranslationStore((state) => state.setLoading);
  const setError = TranslationStore((state) => state.setError);

  const [currentDocsPart, setCurrentDocsPart] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  // translations 데이터를 가져오는 useEffect
  useEffect(() => {
    // 로딩 시작
    setLoading(true);
    setOpenId(null);

    // translations 데이터를 가져오는 함수
    const fetchTranslations = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.userId;
          const data = await MyTranslationService.fetchTranslations(userId);
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          // data가 존재하면 setTranslations로 데이터를 저장
          if (data.length > 0) {
            setMyTranslations(data);
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [token, setOpenId]);

  const fetchDocsPart = async (docsId, originId) => {
    const data = await fetchTranslateData(docsId, originId);
    setCurrentDocsPart(data.content);
  };

  // 페이지네이션 관련 상태들을 하나의 useEffect로 통합
  useEffect(() => {
    // TEST: length 0인 경우 체크
    if (myTranslations.length > 0) {
      const startIndex = currentPage * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        myTranslations.length
      );
      const newTotalPages = Math.ceil(myTranslations.length / itemsPerPage);

      setTotalPages(newTotalPages);
      setCurrentData(myTranslations.slice(startIndex, endIndex));
    }
  }, [myTranslations, currentPage, itemsPerPage]);

  const renderTranslation = (item) => (
    // <div className="flex justify-between text-lg px-3">
    //   <div className="flex-1 min-w-0 mr-3 font-semibold line-clamp-1 break-all">
    //     <Link
    //       // TODO: Link 경로 수정 필요
    //       onClick={() => fetchDocsPart(item.docsId, item.originId)}
    //       className="text-[#7d7c77] hover:text-[#bc5b39]"
    //     >
    //       {item.documentName} {item.pOrder}번째 문단 번역본
    //     </Link>
    //   </div>
    //   <div className="flex space-x-6">
    //     <p className="whitespace-nowrap">{item.createdAt}</p>
    //     <div className="flex items-center">
    //       <img className="mr-3" src={like} alt="좋아요수 아이콘" />
    //       <p className="w-8 text-right">{item.likeCount}</p>
    //     </div>
    //   </div>
    // </div>
    <div key={item.transId} className="flex-col">
      <div className="flex justify-between px-3">
        <div
          className={`flex-1 min-w-0 break-all mr-3 ${
            openId === item.transId ? "" : "line-clamp-1"
          }`}
        >
          <h3
            onClick={async () => {
              await fetchDocsPart(item.docsId, item.originId);
              setOpenId(item.transId === openId ? null : item.transId);
            }}
            className="sm:text-base md:text-lg font-semibold text-[#7d7c77] hover:text-[#bc5b39] cursor-pointer"
          >
            {item.documentName} {item.pOrder}번째 문단 번역본
          </h3>
        </div>
        <div className="flex space-x-6 items-center">
          <p className="sm:text-base md:text-lg">
            {item.createdAt
              ? isSameDay(new Date(item.createdAt), new Date())
                ? format(new Date(item.createdAt), "HH:mm")
                : format(new Date(item.createdAt), "yyyy-MM-dd")
              : "표시할 수 없는 날짜입니다."}
          </p>
          <button
            onClick={() => {
              setOpenId(item.transId === openId ? null : item.transId);
            }}
            className="cursor-pointer"
          >
            <span>
              {openId === item.transId ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </span>
          </button>
        </div>
      </div>
      {item.transId === openId && (
        <MyTranslationModal
          item={item}
          docsPart={currentDocsPart}
          closeModal={closeModal}
        />
      )}
    </div>
  );

  return (
    <div className="p-10 bg-white rounded-bl-xl rounded-br-xl border-b border-l border-r border-[#E1E1DF] text-[#7D7C77]">
      <ListRender
        data={currentData}
        renderItem={renderTranslation}
        totalPages={myTranslations.length > 0 ? totalPages : 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemCategory={"trans"}
      />
    </div>
  );
};

export default MyTranslationPage;
