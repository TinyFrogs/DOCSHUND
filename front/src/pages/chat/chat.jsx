import { useEffect, useState, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import { AnimatePresence, motion as m } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { axiosJsonInstance } from "../../utils/axiosInstance.jsx";
import ChatStore from "../../store/chatStore.jsx";
import { Flag, Send } from "lucide-react";
import { toast } from "react-toastify";
import ReportModal from "../report.jsx";
import useReportStore from "../../store/reportStore.jsx";

const Chat = () => {
  const { isChatVisible, toggleChat } = ChatStore();
  const location = useLocation();
  const navigate = useNavigate();
  const docsId = location.pathname.split("/")[4];
  const token = localStorage.getItem("token");
  const { openReport, toggleReport } = useReportStore();

  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitialMessages, setLoadingInitialMessages] = useState(true);

  const stompClient = useRef(null);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  // 웹소켓 연결 (실시간 채팅)
  const connect = () => {
    // 이미 연결되어 있다면 재연결 방지
    if (stompClient.current && stompClient.current.connected) return;

    // socketFactory 내부에서 웹소켓 에러 이벤트를 처리
    const socketFactory = () => {
      const socket = new WebSocket("wss://i12a703.p.ssafy.io/ws-connect");

      // 웹소켓 자체 에러 처리
      socket.onerror = (event) => {
        console.error("WebSocket Error:", event);
        toast.error("웹소켓 연결 오류가 발생했습니다.");
      };

      socket.onclose = (event) => {
        console.warn("WebSocket Closed:", event);
        toast.error("웹소켓 연결이 종료되었습니다.");
      };

      return socket;
    };

    // STOMP 클라이언트 생성 (웹소켓 에러 핸들러는 위에서 정의됨)
    stompClient.current = Stomp.over(socketFactory);

    // 연결 시 인증 헤더 전송
    stompClient.current.connect(
      { Authorization: `Bearer ${token}` },
      (frame) => {
        console.log("STOMP Connected:", frame);

        // 채팅 메시지 구독
        stompClient.current.subscribe(`/sub/chats/${docsId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });

        // STOMP 에러 구독 (구독 채널을 통해 전달되는 에러)
        stompClient.current.subscribe("/user/queue/errors", (message) => {
          const errorData = JSON.parse(message.body);
          console.error("STOMP 구독 에러:", errorData);
          toast.error(`${errorData.errorType}: ${errorData.message}`);
        });
      },
      (error) => {
        console.error("STOMP Error:", error);
        // error.headers.message가 없을 수도 있으므로 fallback 메시지 처리
        const errorMessage =
          (error && error.headers && error.headers.message) ||
          "알 수 없는 STOMP 오류가 발생했습니다.";
        toast.error(errorMessage);
      }
    );
  };

  const disconnect = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.disconnect(() =>
        console.log("WebSocket disconnected")
      );
    }
  };

  // 초기 메시지 로드 (페이지 0, size 50)
  const loadInitialMessages = async () => {
    setLoadingInitialMessages(true);
    try {
      const response = await axiosJsonInstance.get(
        `chats/${docsId}?page=0&size=50`
      );
      const { content, last } = response.data;
      const initialMessages = content.reverse();
      setMessages(initialMessages);
      setCurrentPage(0);
      setHasMore(!last && initialMessages.length > 0); // last가 false면 더 불러올 메시지가 있음

      // 스크롤을 맨 아래로 이동
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 0);
    } catch (error) {
      console.error("Error loading initial messages:", error);
    }
    setLoadingInitialMessages(false);
  };

  // 이전 채팅 더 불러오기 (다음 페이지 불러오기)
  const loadPreviousMessages = async () => {
    if (!hasMore) return; // 더 불러올 메시지가 없으면 종료
    const container = containerRef.current;
    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;
    try {
      const nextPage = currentPage + 1;
      const response = await axiosJsonInstance.get(
        `chats/${docsId}?page=${nextPage}&size=50`
      );
      const { content, last } = response.data;
      const newMessages = content.reverse();
      setMessages((prev) => [...newMessages, ...prev]);
      setCurrentPage(nextPage);
      setHasMore(!last);
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          prevScrollTop + (newScrollHeight - prevScrollHeight);
      }, 0);
    } catch (error) {
      console.error("Error loading previous messages:", error);
    }
  };

  const handleInputChange = (event) => {
    if (event.target.value.length <= 255) {
      setInputValue(event.target.value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") sendMessage();
  };

  const sendMessage = () => {
    if (inputValue.length > 200) {
      toast.error("200자 이상 메세지는 보낼 수 없습니다.");
      return;
    }
    if (stompClient.current?.connected && inputValue) {
      const body = { docsId, content: inputValue };
      stompClient.current.send(
        `/pub/chats/${docsId}`,
        { Authorization: `Bearer ${token}` },
        JSON.stringify(body)
      );
      setInputValue("");
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  useEffect(() => {
    connect();
    loadInitialMessages();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {isChatVisible && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[2500]"
          onClick={toggleChat}
        >
          <m.div
            key="chat-modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="fixed bottom-22 right-5 w-[400px] h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col z-[2600]"
            onClick={(e) => e.stopPropagation()}
          >
            <ReportModal />
            <div className="p-4 bg-[#C96442] rounded-t-xl text-white font-semibold flex items-center justify-between">
              <span>문서 채팅</span>
              <button onClick={toggleChat} className="cursor-pointer">
                &times;
              </button>
            </div>

            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {!loadingInitialMessages && (
                <div className="text-center mb-2">
                  {hasMore && messages.length > 0 ? (
                    <button
                      onClick={loadPreviousMessages}
                      className="px-3 py-1 text-gray-400 underline rounded hover:text-gray-800"
                    >
                      이전 채팅 더 불러오기
                    </button>
                  ) : (
                    messages.length > 0 && (
                      <span className="text-xs text-gray-500">
                        더 이상 불러올 메세지가 없습니다.
                      </span>
                    )
                  )}
                </div>
              )}

              {loadingInitialMessages ? (
                <div className="text-center text-gray-500">
                  메시지를 불러오는 중...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  메시지가 없습니다.
                </div>
              ) : (
                messages.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      item.userId === userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    {item.userId !== userId && (
                      <img
                        src={item.profileImg}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-[#c5afa7] cursor-pointer mr-2"
                        onClick={() => {
                          toggleChat();
                          setTimeout(() => {
                            navigate(`/userPage/${item.userId}`);
                          }, 300);
                        }}
                      />
                    )}
                    <div className="max-w-[70%]">
                      {item.userId !== userId && (
                        <p className="text-xs font-semibold mb-1">
                          {item.nickName}
                        </p>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          item.userId === userId
                            ? "bg-[#bc5b39] text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{item.content}</p>
                        {item.userId !== userId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              useReportStore.setState({
                                originContent: item.content,
                                reportedUser: item.userId,
                                commentId: null,
                                articleId: null,
                                transId: null,
                                chatId: item.chatId,
                              });
                              openReport();
                              toggleReport();
                            }}
                            className="text-xs text-red-500 flex items-center gap-1 mt-1 cursor-pointer hover:underline"
                          >
                            <Flag size={10} /> 신고
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
                placeholder="메시지를 입력하세요..."
              />
              <button
                onClick={sendMessage}
                className="px-3 py-3 bg-[#bc5b39] text-white rounded-full hover:bg-[#C96442] cursor-pointer"
              >
                <Send />
              </button>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Chat;
