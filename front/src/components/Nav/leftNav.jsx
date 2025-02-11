import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import EditorModal from "../../pages/myPage/components/EditorModal.jsx";
import RoundCornerBtn from "../button/roundCornerBtn.jsx";
import { fetchDocsList } from "../../pages/translate/hooks/translateGetService.jsx";

// 상태 import
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import modalStore from "../../store/myPageStore/myPageModalStore.jsx";
//

//이미지 주소 import
import Logo from "../../assets/logo.png";
import menuDown from "../../assets/icon/menu-down.png";
import menuUp from "../../assets/icon/menu-up.png";
import { Bell } from "lucide-react";
import { ScrollText } from "lucide-react";
import { StickyNote } from "lucide-react";
import navToggle2 from "../../assets/icon/navToggle2.png";
//

const LeftNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [docs, setDocs] = useState([]);
  const [memos, setMemo] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [btnToggled, setBtnToggled] = useState(
    "absolute top-15 -right-6 transform"
  );
  const [showNav, setShowNav] = useState(
    "max-w-[15%] min-w-fit w-60 h-[80%] bg-[#F8F7F3] flex flex-col border-box border-2 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 -translate-x-[90%] z-[1500]"
  ); // 배경색 및 테두리 색상 변경, 애니메이션 효과 조정
  const { isOpen, openModal, closeModal } = modalStore();
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

  //문서 목록 관련 상태
  const { docsList } = useDocsStore();

  useEffect(() => {
    fetchDocsList(true);
  }, [docsList]);

  function toggleNav() {
    if (isNavOpen === true) {
      setIsNavOpen(false);
      setBtnToggled(
        "absolute top-15 -right-6 transform transition-transform duration-300 "
      );
      setShowNav(
        "max-w-[15%] min-w-fit w-60 h-[80%] bg-[#F8F7F3] flex flex-col border-box border-2 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 -translate-x-[90%] z-[1500]"
      );
    } else if (isNavOpen === false) {
      setIsNavOpen(true);
      setBtnToggled(
        "absolute top-15 -right-6 transform transition-transform duration-300 rotate-180"
      );
      setShowNav(
        "max-w-[15%] min-w-fit w-60 h-[80%] bg-[#F8F7F3] flex flex-col border-box border-2 border-[#E0DED9] absolute top-1/2 -translate-y-1/2 rounded-br-4xl rounded-tr-4xl transform transition-all duration-400 z-[1500]"
      );
    }
  }

  return (
    <div className="h-screen">
      <div className={showNav}>
        <button className={btnToggled}>
          <img
            className="w-[48px] h-[48px] cursor-pointer"
            src={navToggle2}
            alt="nav 토글 버튼"
            onClick={() => toggleNav()}
          />
        </button>
        <div className="p-5 text-center">
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
          <div className="mb-5">
            <div
              className="px-5 py-2.5 flex flex-row items-center  cursor-pointer hover:bg-[#F5F4F0] transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <ScrollText className="w-5 h-5" />
              <span className="ml-5 font-medium text-[#4A4A4A]">문서목록</span>
              <div className="flex w-1/5 justify-end items-center">
                {" "}
                {isMenuOpen ? (
                  <img src={menuUp} className="w-4 h-4 right-0" />
                ) : (
                  <img src={menuDown} className="w-4 h-4 right-0" />
                )}
              </div>
            </div>
            {isMenuOpen && (
              <div className="h-[200px] overflow-y-scroll ">
                <div className="px-5">
                  {docsList.map((doc, index) => (
                    <div
                      onClick={() =>
                        window.location.replace(
                          `/translate/main/viewer/${doc.docsId}`
                        )
                      }
                      key={index}
                      className="cursor-pointer py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                    >
                      <span className="text-[#4A4A4A]">{doc.documentName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* 알림 리스트 */}
          {localStorage.getItem("token") && (
            <div className="mb-5 flex items-center">
              <Bell className="w-5 h-5 ml-5" />
              <div className="px-5 py-2.5 flex items-center gap-2.5 hover:bg-[#F5F4F0] transition-colors duration-200">
                <span className="font-medium text-[#4A4A4A]">알림</span>
              </div>
            </div>
          )}
          {/* 메모 리스트 */}
          {localStorage.getItem("token") && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-2.5 w-full flex items-center hover:bg-[#F5F4F0] transition-colors duration-200">
                <StickyNote className="w-13 h-13" />
                <span className="ml-5 font-medium text-[#4A4A4A]">MEMO</span>
                <div className="flex w-full right-0 justify-end items-center">
                  <FaPlus
                    onClick={openModal}
                    className="cursor-pointer hover:text-[#BC5B39]"
                  />
                </div>
              </div>
              <div className="px-5">
                {memos.map((memo, index) => (
                  <div
                    key={index}
                    className="py-2.5 flex justify-between items-center border-b border-[#E0DED9] hover:bg-[#F5F4F0] transition-colors duration-200"
                  >
                    <span className="text-[#4A4A4A]">{memo}</span>
                    <button className="text-[#6B6B6B] hover:text-[#4A4A4A] cursor-pointer text-sm transition-colors duration-200">
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
              window.location.replace("/translate");
            }}
            text="뷰어 나가기"
          />
        </div>
      </div>
      <div className="absolute z-[2500]">
        <EditorModal
          title="새 메모"
          fields={[
            {
              label: "제목",
              name: "title",
              type: "text",
              placeholder: "제목을 입력하세요",
              value: memoData.title,
              onChange: handleInputChange,
              required: true,
            },
          ]}
          buttonText="작성 완료"
          isOpen={isOpen}
          closeModal={closeModal}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default LeftNav;
