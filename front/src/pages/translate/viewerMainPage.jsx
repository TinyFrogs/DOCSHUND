import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ChatBotBtn from "../chatBot/chatBotBtn.jsx";
import Information from "./page/information.jsx";
import { MessageCircle } from "lucide-react";

//아이콘
import Korean from "../../assets/icon/korean.png";
import English from "../../assets/icon/english.png";
import { ArrowLeftToLine } from "lucide-react";
import { Menu } from "lucide-react";

//상태
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useDocsStore from "../../store/translateStore/docsStore.jsx";

//채팅
import Chat from "../chat/chat.jsx";
import ChatStore from "../../store/chatStore.jsx";
import ChatBotStore from "../../store/chatBotStore.jsx";

//서비스
import { fetchDocsList } from "./services/translateGetService.jsx";

const ViewerMainPage = () => {
  const { isChatVisible, toggleChat } = ChatStore();
  const navigate = useNavigate();
  const { docsId } = useParams();
  const location = useLocation().pathname;

  const { isArchiveOpen, isEditorOpen, openNav } = useModalStore();
  const { setDocsList, setBestDocsList } = useDocsStore();

  useEffect(() => {
    const fetchData = async () => {
      const tmpDocsList = await fetchDocsList();
      setDocsList(tmpDocsList);
      setBestDocsList(tmpDocsList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="md:min-w-[768px] h-screen flex overflow-hidden relative"
      id="mainPage"
    >
      <Information />

      {/* 내브바 관련 버튼 */}
      <div
        id="navGroup"
        className="fixed top-4 left-4 z-[1200] flex items-center gap-2 px-2 py-1 bg-white/80 backdrop-blur-md rounded-full shadow-lg"
      >
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition-all duration-300"
          onClick={() => navigate("/translate")}
        >
          <ArrowLeftToLine className="text-white" />
        </button>
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105 transition-all duration-300"
          onClick={openNav}
        >
          <Menu className="text-white" />
        </button>
      </div>

      {/* 원문보기 버튼 (가장 위) */}
      {!isArchiveOpen && !isEditorOpen && (
        <button
          id="translateAllBtn"
          onClick={async () => {
            if (location.includes("best")) {
              navigate(`/translate/main/viewer/${docsId}/`);
            } else {
              navigate(`/translate/main/viewer/${docsId}/best`);
            }
          }}
          className="fixed bottom-34 right-4 z-[2500] flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full px-4 py-2 shadow-xl hover:scale-105 transition-all duration-300"
        >
          {location.includes("best") ? (
            <>
              <img className="w-6 h-6" src={English} alt="원문 보기" />
              <span className="text-sm font-medium">원문 보기</span>
            </>
          ) : (
            <>
              <img className="w-6 h-6" src={Korean} alt="전체 번역 보기" />
              <span className="text-sm font-medium">전체 번역 보기</span>
            </>
          )}
        </button>
      )}

      {/* 챗봇 버튼 (중간) */}
      <ChatBotBtn />

      {/* 채팅 버튼 (제일 아래) */}
      {localStorage.getItem("token") && (
        <div
          id="chatBtn"
          onClick={() => {
            toggleChat();
            ChatBotStore.setState({ isChatBotVisible: false });
          }}
          className="fixed right-4 bottom-6 z-[2500] flex items-center gap-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-full px-4 py-2 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-sm font-medium">채팅</span>
        </div>
      )}
      {localStorage.getItem("token") && <Chat />}
      <Outlet className="h-screen pr-16" />
    </div>
  );
};

export default ViewerMainPage;
