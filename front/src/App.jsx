import "./App.css";
import AppRouter from "./router.jsx";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import UseSSE from "./hooks/useSSE.jsx";

//네비게이션 바
import Footer from "./components/footer/footer.jsx";
import UpperNav from "./components/Nav/upperNav.jsx";
import LeftNav from "./components/Nav/leftNav.jsx";

//모달
import Modal from "react-modal";
import LoginModal from "./components/LoginModal.jsx";
import ToastModal from "./components/alertModal/toastModal.jsx";
import notificationModalStore from "./store/notificationModalStore.jsx";
import NotificationService from "./services/notificationService.jsx";

//문서채팅
import Chat from "./pages/chat/chat.jsx";
import ChatStore from "./store/chatStore.jsx";
import chatImg from "./assets/icon/chat.png";

//챗봇
import ChatBotStore from "./store/chatBotStore.jsx";

Modal.setAppElement("#root");

function App() {
  // 번역 뷰어 페이지일 때만 좌측 내브바 표시
  const location = useLocation();
  const pathname = location.pathname;
  const isTranslateViewerPage = pathname.includes("/translate/main/viewer");
  const isAdminPage = pathname.includes("/admin");
  const [token, setToken] = useState("");

  const { isChatVisible, toggleChat } = ChatStore();
  const { setNotifications } = notificationModalStore();

  useEffect(() => {
    if (token === "" && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }

    if (location.search.includes("token")) {
      toast.success("로그인에 성공했습니다!");
      setToken(location.search.split("=")[1]);
    }
  }, []);

  useEffect(() => {
    // NOTE: 로그인 성공 시, 기존에 밀려있던 알림을 불러옴
    const fetchNotifications = async () => {
      try {
        if (token) {
          // 로그인 or 로그인 상태의 접속시 알림 불러오기
          const data = await NotificationService.fetchNotifications();

          if (data) {
            // NOTE: 알림 데이터가 id 오름차순으로 들어오므로 최신순으로 정렬하기 위해서 reverse() 적용
            setNotifications(data.reverse());
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, [token, location]);

  // 유저 ID가 없으면 알림을 불러올 수 없음
  // 유저 ID로 SSE 연결

  UseSSE(token ? jwtDecode(token).userId : null);

  return (
    <div
      className={`flex flex-col min-h-screen min-w-[768px] overflow-hidden ${
        isTranslateViewerPage ? "bg-[#FAF9F5]" : ""
      }`}
    >
      <ToastModal />
      {isTranslateViewerPage ? <LeftNav /> : null}
      {!isTranslateViewerPage && !isAdminPage ? <UpperNav /> : null}
      <div className="flex-grow">
        <AppRouter />
      </div>
      {isTranslateViewerPage ? (
        <div className="fixed bottom-4 right-3 z-[1900] group"></div>
      ) : null}
      {isTranslateViewerPage || isAdminPage ? null : <Footer />}
      <LoginModal />
    </div>
  );
}

export default App;
