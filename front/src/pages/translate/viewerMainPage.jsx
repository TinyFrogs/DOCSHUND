import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ChatBotBtn from "../chatBot/chatBotBtn.jsx";
import Information from "./page/information.jsx";
import { MessageCircle } from "lucide-react";
import Korean from "../../assets/icon/korean.png";
import English from "../../assets/icon/english.png";

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
  console.log(location);

  const { isArchiveOpen, isEditorOpen } = useModalStore();
  const { setDocsList, setBestDocsList } = useDocsStore();

  useEffect(() => {
    const fetchData = async () => {
      const tmpDocsList = await fetchDocsList();
      setDocsList(tmpDocsList);
      setBestDocsList(tmpDocsList);
      console.log("tmpDocsList", tmpDocsList);
    };

    fetchData();
  }, []);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="min-w-[768px] flex"
    >
      <Information />
      <ChatBotBtn />
      {!isArchiveOpen && !isEditorOpen && (
        <button
          onClick={async () => {
            if (location.includes("best")) {
              navigate(`/translate/main/viewer/${docsId}/`);
            } else {
              navigate(`/translate/main/viewer/${docsId}/best`);
            }
          }}
          className="transition-all duration-300 fixed bottom-26 right-2 z-[2600] group rounded-full w-10 h-10 bg-gradient-to-r from-[#BC5B39] to-[#ff835a] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl border-2 border-white"
        >
          {/* <img className="w-7 h-6" src={Korean} alt="전체 번역 보기" /> */}
          {location.includes("best") ? (
            <img className="w-7 h-6" src={English} alt="원문 보기" />
          ) : (
            <img className="w-7 h-6" src={Korean} alt="전체 번역 보기" />
          )}
        </button>
      )}
      ;
      {localStorage.getItem("token") && (
        <div
          onClick={() => {
            toggleChat();
            ChatBotStore.setState({
              isChatBotVisible: false,
            });
          }}
          className="fixed right-2 bottom-4 z-[2500] rounded-full w-10 h-10 bg-gradient-to-r from-[#BC5B39] to-[#ff835a] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
        >
          <MessageCircle className="text-white w-6 h-6 transition-transform duration-300" />
        </div>
      )}
      {isChatVisible && <Chat />}
      <Outlet className="min-w-[768px] pr-16" />
    </div>
  );
};

export default ViewerMainPage;
