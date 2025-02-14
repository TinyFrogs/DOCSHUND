import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { Bot, Send, X } from "lucide-react";
import _ from "lodash";

//상태 관리
import useChatBotStore from "../../store/chatBotStore.jsx";
import ChatStore from "../../store/chatStore.jsx";

const ChatBotBtn = () => {
  const { isChatBotVisible, toggleChatBot } = useChatBotStore();
  const { isChatVisible, toggleChat } = ChatStore();

  //챗봇 관련
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = () => {
    toggleChatBot();
  };

  const handleSubmit = useCallback(
    _.debounce(async (e) => {
      e.preventDefault();
      if (!inputMessage.trim()) return;

      const newMessage = {
        text: inputMessage,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");
      await testGeminiAPI(
        inputMessage.concat(
          "페르소나: 당신은 영어에 능통한 30년차 풀스택 개발자 멘토로서, 개발 관련 영어 질문에 대해 간결하고 명확한 한국어 답변을 해요체로 256자 이내로 제공합니다. 답변은 반드시 한국어로 해야 합니다."
        )
      );
    }, 500),
    [inputMessage]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const testGeminiAPI = async (chatContent) => {
    setLoading(true);
    console.log("Sending chat content:", chatContent);
    try {
      const cloudFunctionUrl = `${import.meta.env.VITE_CLOUD_FUNCTION_URL}`;
      const response = await axios.post(
        cloudFunctionUrl,
        { prompt: chatContent },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = {
        text: response.data.response || "응답을 받아오는데 실패했습니다.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      console.log("Processed bot response:", botResponse);
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage = {
        text: `에러가 발생했습니다: ${error.message}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      {localStorage.getItem("token") && (
        <div className="fixed z-[2600] bottom-17 right-1 flex">
          <AnimatePresence>
            {isChatBotVisible && (
              <motion.div
                key="chatbot-modal"
                initial={{ opacity: 0, y: 1000 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 1000 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.5,
                }}
                className=" w-[400px] h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 z-[2500] flex flex-col -translate-x-[15%] translate-y-[10%]"
              >
                {/* 챗봇 헤더 */}
                <div className="flex items-center p-4 border-b border-gray-200 bg-[#C96442] rounded-t-xl w-full">
                  <Bot className="h-8 w-8 text-white" />
                  <div className="flex items-center justify-between w-full">
                    <div className="ml-3 text-white">
                      <h3 className="font-semibold">DocshunD 번역봇</h3>
                    </div>
                    <button
                      className="cursor-pointer"
                      onClick={() => handleClose()}
                    >
                      <X className="h-8 w-8 flex left-0 text-white" />
                    </button>
                  </div>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isUser
                            ? "bg-red-900 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                <form
                  onSubmit={onSubmit}
                  className="p-4 border-t border-gray-200"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#C96442]"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-[#C96442] text-white rounded-full hover: cursor-pointer transition-colors"
                      disabled={loading}
                    >
                      <Send />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onClick={() => {
              toggleChatBot();
              ChatStore.setState({ isChatVisible: false });
            }}
            className="fixed bottom-15 right-2 rounded-full w-10 h-10 bg-gradient-to-r from-[#BC5B39] to-[#ff835a] flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
          >
            <Bot className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatBotBtn;
