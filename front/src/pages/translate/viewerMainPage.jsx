import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import ChatBotBtn from "../chatBot/chatBotBtn.jsx";
import Information from "./page/information.jsx";
import { MessageCircle } from "lucide-react";
import Korean from "../../assets/icon/korean.png";
import English from "../../assets/icon/english.png";

//채팅
import Chat from "../chat/chat.jsx";
import ChatStore from "../../store/chatStore.jsx";
import ChatBotStore from "../../store/chatBotStore.jsx";

const ViewerMainPage = () => {
  const { isChatVisible, toggleChat } = ChatStore();
  const navigate = useNavigate();
  const { docsId } = useParams();
  const location = useLocation().pathname;
  console.log(location);
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="min-w-[768px] flex"
    >
      <Information />
      <ChatBotBtn />
      <button
        onClick={async () => {
          if (location.includes("best")) {
            navigate(`/translate/main/viewer/${docsId}/`);
          } else {
            navigate(`/translate/main/viewer/${docsId}/best`);
          }
        }}
        className="fixed bottom-26 right-3 z-[1900] group rounded-full w-10 h-10 bg-gradient-to-r from-[#BC5B39] to-[#ff835a] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
      >
        {/* <img className="w-7 h-6" src={Korean} alt="전체 번역 보기" /> */}
        {location.includes("best") ? (
          <img className="w-7 h-6" src={English} alt="원문 보기" />
        ) : (
          <img className="w-7 h-6" src={Korean} alt="전체 번역 보기" />
        )}
      </button>
      <div
        onClick={() => {
          toggleChat();
          ChatBotStore.setState({
            isChatBotVisible: false,
          });
        }}
        className="fixed right-3 bottom-4 z-[2500] rounded-full w-10 h-10 bg-gradient-to-r from-[#BC5B39] to-[#ff835a] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
      >
        <MessageCircle className="text-white w-6 h-6 transition-transform duration-300" />
      </div>
      {isChatVisible && <Chat />}
      {/* <AlertModal
        imgSrc={warning}
        alertTitle={"알림"}
        alertText={
          "[서비스 이용 안내]\n\n" +
          "1. 이 번역본은 공식 번역이 아니며, 원본의 정확성과 완전성을 보장하지 않습니다.\n" +
          "2. 참고용으로만 사용하시고, 공식 정보를 확인하시려면 원본 문서를 직접 참조하시기 바랍니다.\n\n" +
          "3. 본 서비스는 공익적인 목적을 위해 제공되며, 상업적 이용 시 발생하는 모든 법적 책임은의 사용자에게 있으며, 서비스 제공자는 이에 대한 책임을 지지 않습니다."
        }
        isVisible={isAlertOpen}
      /> */}
      <Outlet className="min-w-[768px] pr-16" />
    </div>
  );
};

export default ViewerMainPage;
