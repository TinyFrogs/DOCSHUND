import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";
import EditorModal from "../../pages/myPage/components/EditorModal.jsx";
import RoundCornerBtn from "../button/roundCornerBtn.jsx";
import { fetchDocsList } from "../../pages/translate/services/translateGetService.jsx";
import memoService from "../../pages/myPage/services/memoService";
import useMemoStore from "../../store/myPageStore/memoStore";
import useMemoMode from "../../pages/myPage/hooks/useMemoMode";

import NotificationModal from "../notificationModal/notificationModal";

// 상태 import

import useDocsStore from "../../store/translateStore/docsStore.jsx";
import modalStore from "../../store/myPageStore/myPageModalStore.jsx";
import notificationModalStore from "../../store/notificationModalStore";

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

const LeftNav = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [btnToggled, setBtnToggled] = useState(
    "absolute top-15 -right-6 transform"
  );
  const [showNav, setShowNav] = useState(
    "max-w-[15%] min-w-fit w-60 h-[80vh] bg-[#F0EEE5] shadow-lg flex flex-col border-box border-1 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 -translate-x-[90%] z-[1500]"
  ); // 배경색 및 테두리 색상 변경, 애니메이션 효과 조정
  const { isOpen, openModal, closeModal } = modalStore();
  const { memos, setMemos, deleteMemo } = useMemoStore();
  const { memoData, setMemoData, handleOpenCreateModal, handleOpenEditModal } =
    useMemoMode();
  const [userId, setUserId] = useState(null);
  const {
    toggleNotificationModal,
    isNotificationModalOpen,
    closeNotificationModal,
  } = notificationModalStore();

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    if (userId) {
      fetchMemos(userId);
    }
  }, [userId]);

  const fetchMemos = async (userId) => {
    if (!userId) {
      return;
    }
    try {
      const data = await memoService.fetchMemos(userId);
      if (data) {
        setMemos(data.reverse());
      } else {
        setMemos([]);
      }
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

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

  const handleEditMemo = async (memoId, memoData) => {
    if (userId) {
      try {
        await memoService.updateMemo(userId, memoId, memoData);
        const data = await memoService.fetchMemos(userId);
        if (data) {
          setMemos(data.reverse());
        } else {
          setMemos([]);
        }
        closeModal();
      } catch (error) {
        console.error("Error updating memo:", error);
      }
    }
  };

  const handleDeleteMemo = async (memoId) => {
    if (userId) {
      try {
        await memoService.deleteMemo(userId, memoId);
        deleteMemo(memoId);
        closeModal();
      } catch (error) {
        console.error("Error deleting memo:", error);
      }
    }
  };

  //문서 목록 관련 상태
  const { docsList, setDocsList } = useDocsStore();

  // 문서 목록 불러오기
  useEffect(() => {
    fetchDocsList(true);
  }, [docsList]);

  // 알림 모달 상태 초기화
  useEffect(() => {
    closeNotificationModal();
  }, []);

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
          <NavLink to="/">
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
              <div
                className="px-5 py-2.5 mb-2 flex items-center hover:bg-[#F5F4F0] cursor-pointer transition-colors duration-200"
                onClick={() => toggleNotificationModal()}
              >
                <Bell className="w-6 h-6 text-[#7E7C77]" />
                <span className="ml-5 font-medium text-[#7E7C77]">알림</span>
              </div>
              <div
                className={`absolute z-[1000] transition-all duration-300 transform ${
                  isNotificationModalOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <NotificationModal />
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
                  onClick={() => handleOpenCreateModal(openModal)}
                  className="cursor-pointer w-6 h-6 text-[#7E7C77] hover:text-[#4A4A4A] ml-auto"
                />
              </div>
              <div className="px-5">
                {Array.isArray(memos) && memos.length === 0 ? (
                  <p className="text-[#7E7C77] text-xs">
                    작성된 메모가 없습니다.
                  </p>
                ) : (
                  Array.isArray(memos) &&
                  memos.slice(0, 3).map((memo, index) => (
                    <div
                      key={index}
                      className="py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                    >
                      <span className="sm:w-25 md:w-36 text-[#7E7C77] break-all line-clamp-1">
                        {memo.title}
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(memo, openModal)}
                        className="text-[#7E7C77] hover:text-[#4A4A4A] underline cursor-pointer text-sm transition-colors duration-200"
                      >
                        보기
                      </button>
                    </div>
                  ))
                )}
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
          title={memoData ? "메모 수정" : "새 메모"}
          buttonText={memoData ? "수정 완료" : "작성 완료"}
          onSubmit={memoData ? handleEditMemo : handleCreateMemo}
          isOpen={isOpen}
          closeModal={closeModal}
          memoData={memoData}
          onDelete={memoData ? handleDeleteMemo : null}
        />
      </div>
    </div>
  );
};

export default LeftNav;
