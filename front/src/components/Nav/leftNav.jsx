import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import EditorModal from "../../pages/myPage/components/EditorModal.jsx";
import RoundCornerBtn from "../button/roundCornerBtn.jsx";
import MemoService from "../../pages/myPage/services/memoService.jsx";
import { fetchDocsList } from "../../pages/translate/services/translateGetService.jsx";

// 상태 import
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import modalStore from "../../store/myPageStore/myPageModalStore.jsx";
//

//이미지 주소 import
import Logo from "../../assets/logo.png";
import {
  Bell,
  ScrollText,
  ChevronDown,
  ChevronUp,
  StickyNote,
  Plus,
} from "lucide-react";
import navToggle2 from "../../assets/icon/navToggle2.png";
//

const LeftNav = () => {
  let userId = 0;
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    userId = jwtDecode(token).userId;
  }

  const { docsId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [memos, setMemos] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [btnToggled, setBtnToggled] = useState(
    "absolute top-15 -right-6 transform"
  );
  const [showNav, setShowNav] = useState(
    "max-w-[15%] min-w-fit w-60 h-[80%] bg-[#F0EEE5] shadow-lg flex flex-col border-box border-1 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 -translate-x-[90%] z-[1500]"
  ); // 배경색 및 테두리 색상 변경, 애니메이션 효과 조정
  const { isOpen, openModal, closeModal } = modalStore();
  const { setMemos } = useMemoStore();
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  const handleCreateMemo = async (memoData) => {
    if (userId) {
      try {
        await memoService.createMemo(userId, memoData);
        const data = await memoService.fetchMemos(userId);
        if (data) {
          setMemos(data.reverse());
        } else {
          setMemos([]);
        }
        closeModal();
      } catch (error) {
        console.error("Error creating memo:", error);
      }
    }
  };

  //메모 관련 상태
  const [memoData, setMemoData] = useState({
    title: "",
    content: "",
  });

  const handleInputChange = (e) => {
    setMemoData({
      ...memoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (data) => {
    // console.log("Memo Saved:", data); // 메모 저장 처리
    // 예를 들어, 데이터를 서버로 전송하거나 상태 업데이트 처리
    closeModal();
  };

  const handleMemoList = async () => {
    try {
      const data = await MemoService.fetchMemos(userId);
      if (data) {
        setMemos(data.reverse());
      } else {
        setMemos([]);
      }
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  //문서 목록 관련 상태
  const { docsList, setDocsList } = useDocsStore();

  function toggleNav() {
    if (isNavOpen === true) {
      setIsNavOpen(false);
      setBtnToggled(
        "absolute top-15 -right-6 transform transition-transform duration-300 "
      );
      setShowNav(
        "max-w-[15%] min-w-fit w-60 h-[80%] bg-[#F0EEE5] shadow-lg flex flex-col border-box border-1 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 -translate-x-[90%] z-[1500]"
      );
    } else if (isNavOpen === false) {
      setIsNavOpen(true);
      setBtnToggled(
        "absolute top-15 -right-6 transform transition-transform duration-300 rotate-180"
      );
      setShowNav(
        "max-w-[15%] min-w-fit w-60 h-[80%] bg-[#F0EEE5] shadow-lg flex flex-col border-box border-1 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 z-[1500]"
      );
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const tmpDocsList = await fetchDocsList();
      setDocsList(tmpDocsList);
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen">
      <div className={showNav}>
        <button className={btnToggled}>
          <img
            className="w-[36px] h-[36px] cursor-pointer"
            src={navToggle2}
            alt="nav 토글 버튼"
            onClick={() => toggleNav()}
          />
        </button>
        <div className="p-5 flex justify-center">
          <NavLink to="/translate">
            <img
              className="w-[clamp(120px,10vw,148px)] h-auto hover:opacity-80 transition-opacity duration-200"
              src={Logo}
              alt="닥스훈트 로고"
            />
          </NavLink>
        </div>
        {/* 문서목록 토글 */}
        <div className="flex-1 overflow-y-scroll">
          <div>
            <div
              className="px-5 py-2.5 mb-2 flex flex-row items-center cursor-pointer hover:bg-[#F5F4F0] transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ScrollText className="w-6 h-6 text-[#7E7C77]" />
              <span className="ml-5 font-medium text-[#7E7C77]">
                문서목록
              </span>{" "}
              {isMenuOpen ? (
                <ChevronUp className="w-6 h-6 text-[#7E7C77] ml-auto" />
              ) : (
                <ChevronDown className="w-6 h-6 text-[#7E7C77] ml-auto" />
              )}
            </div>
            {isMenuOpen && (
              <div className="h-[200px] overflow-y-scroll ">
                <div className="px-5">
                  {docsList.map((doc, index) => (
                    <div
                      onClick={async () => {
                        navigate(`/translate/main/viewer/${doc.docsId}`);
                      }}
                      key={index}
                      className="cursor-pointer py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                    >
                      <span className="text-[#7E7C77]">{doc.documentName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 알림 리스트 */}
          {localStorage.getItem("token") && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-2.5 mb-2 flex items-center hover:bg-[#F5F4F0] transition-colors duration-200">
                <Bell className="w-6 h-6 text-[#7E7C77]" />
                <span className="ml-5 font-medium text-[#7E7C77]">알림</span>
              </div>
            </div>
          )}
          {/* 메모 리스트 */}
          {localStorage.getItem("token") && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-2.5 mb-2 w-full flex items-center hover:bg-[#F5F4F0] transition-colors duration-200">
                <StickyNote className="w-6 h-6 text-[#7E7C77]" />
                <span className="ml-5 font-medium text-[#7E7C77]">메모장</span>
                <Plus
                  onClick={openModal}
                  className="cursor-pointer w-6 h-6 text-[#7E7C77] hover:text-[#4A4A4A] ml-auto"
                />
              </div>
              <div className="px-5">
                {memos.map((memo, index) => (
                  <div
                    key={index}
                    className="py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                  >
                    <span className="text-[#7E7C77]">{memo.title}</span>
                    <span className="text-[#7E7C77]">{memo.createdAt}</span>
                    <span className="text-[#7E7C77]">{memo.content}</span>
                    <button className="text-[#7E7C77] hover:text-[#4A4A4A] underline cursor-pointer text-sm transition-colors duration-200">
                      보기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="items-center justify-center flex mb-10">
          <RoundCornerBtn
            onClick={() => {
              navigate("/translate");
            }}
            text="뷰어 나가기"
          />
        </div>
      </div>
      <div className="absolute z-[2500]">
        <EditorModal
          title="새 메모"
          buttonText="작성 완료"
          isOpen={isOpen}
          closeModal={closeModal}
          onSubmit={handleCreateMemo}
        />
      </div>
    </div>
  );
};

export default LeftNav;
