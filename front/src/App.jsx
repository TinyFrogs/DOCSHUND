import "./App.css";
import AppRouter from "./router.jsx";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//네비게이션 바
import Footer from "./components/footer/footer.jsx";
import UpperNav from "./components/Nav/upperNav.jsx";
import LeftNav from "./components/Nav/leftNav.jsx";

//모달
import Modal from "react-modal";
import LoginModal from "./components/LoginModal.jsx";
import ToastModal from "./components/alertModal/toastModal.jsx";
import notificationModalStore from "./store/notificationModalStore.jsx";

//챗봇
import ChatBotStore from "./store/chatBotStore.jsx";

//문서채팅
import Chat from "./pages/chat/chat.jsx";
import ChatStore from "./store/chatStore.jsx";
import chatImg from "./assets/icon/chat.png";

Modal.setAppElement("#root");

function App() {
  // 번역 뷰어 페이지일 때만 좌측 내브바 표시
  const location = useLocation();
  const pathname = location.pathname;
  const isTranslateViewerPage = pathname.includes("/translate/main/viewer");
  const isAdminPage = pathname.includes("/admin");
  const { isChatVisible, toggleChat } = ChatStore();

  useEffect(() => {
    if (location.search.includes("token")) {
      toast.success("로그인에 성공했습니다!");
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen min-w-[768px] overflow-hidden">
      <ToastModal />
      {isTranslateViewerPage ? <LeftNav /> : null}
      {!isTranslateViewerPage && !isAdminPage ? <UpperNav /> : null}
      <div className="flex-grow">
        <AppRouter />
      </div>
      {isTranslateViewerPage ? (
        <div className="fixed bottom-4 right-4 z-[1900] group">
          {localStorage.getItem("token") && (
            <div
              onClick={toggleChat}
              className="rounded-full w-16 h-16 bg-gradient-to-r from-[#BC5B39] to-[#E4DCD4] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
            >
              <img
                className="group-hover:rotate-12 transition-transform duration-300"
                src={chatImg}
                alt="채팅 아이콘"
              />
            </div>
          )}
        </div>
      ) : null}

      {isChatVisible && <Chat />}
      {isTranslateViewerPage || isAdminPage ? null : <Footer />}
      <LoginModal />
    </div>
  );
}

export default App;
