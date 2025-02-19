import { useEffect, useState } from "react";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { toast } from "react-toastify";

import notificationModalStore from "../store/notificationModalStore";
import useAuthStore from "../store/authStore";

const UseSSE = (userId) => {
  const token = useAuthStore(
    (state) => state.token,
    (prev, next) => prev === next // shallow comparison
  );
  const addNotification = notificationModalStore(
    (state) => state.addNotification
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  // const [retryCount, setRetryCount] = useState(0);

  // const MAX_RETRY_ATTEMPTS = 5;
  // const RETRY_TIMEOUT = 3000; // 3초

  const EventSource = EventSourcePolyfill || NativeEventSource;

  useEffect(() => {
    if (!userId) {
      setError("사용자 ID가 필요합니다.");
      return;
    }

    let eventSource = null;

    // INFO: SSE 연결 함수
    const connectSSE = () => {
      try {
        // 이전 연결이 있다면 정리
        if (eventSource) {
          eventSource.close();
        }

        // token이 없고(로그아웃 상태) 연결이 되어있으면 return
        if (!token) {
          return;
        }

        // INFO: EventSource 객체 생성 -> stream 주소, 헤더 설정
        eventSource = new EventSource(
          `https://i12a703.p.ssafy.io/api/v1/docshund/alerts/stream`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "text/event-stream",
            },
            withCredentials: true,
            heartbeatTimeout: 10 * 60 * 1000, // Backend와 동일하게 10분으로 설정
          }
        );

        // INFO: 이벤트 소스 연결 성공 시
        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
          // setRetryCount(0);
        };

        // INFO: Backend에서 설정한 'alert' 이벤트 리스닝
        eventSource.addEventListener("alert", (event) => {
          try {
            const notification = JSON.parse(event.data);

            // 모든 UI 업데이트를 requestAnimationFrame 내부로 이동
            requestAnimationFrame(() => {
              // 알림 상태 업데이트
              addNotification(notification);

              // 토스트 알림 표시
              toast.info(notification.content, {
                toastId: notification.id,
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                toastId: `${notification.id}-${Date.now()}`, // 고유성 보장을 위해 타임스탬프 추가
                pauseOnFocusLoss: false, // 포커스 손실시에도 타이머 계속 실행
                pauseOnHover: true, // 호버시 일시 정지
              });
            });
          } catch (err) {
            // console.error("알림 데이터 파싱 오류:", err);
          }
        });

        // INFO: 에러 핸들링
        eventSource.onerror = (error) => {
          // console.error("SSE 연결 오류:", error);
          setIsConnected(false);

          // NOTE: 현재 재연결 로직은 비활성화 <- 필요 시 주석 해제
          // // INFO: 재연결 로직
          // if (retryCount < MAX_RETRY_ATTEMPTS) {
          //   const retryDelay = Math.min(
          //     1000 * Math.pow(2, retryCount),
          //     RETRY_TIMEOUT
          //   );
          //   console.log(
          //     `${retryDelay}ms 후 재연결 시도 (${
          //       retryCount + 1
          //     }/${MAX_RETRY_ATTEMPTS})`
          //   );

          //   eventSource.close();
          //   setRetryCount((prev) => prev + 1);
          //   setError(
          //     `연결이 끊어졌습니다. ${retryDelay / 1000}초 후 재연결합니다...`
          //   );

          //   // setTimeout(connectSSE, retryDelay);
          // } else {
          //   setError(
          //     "최대 재시도 횟수를 초과했습니다. 페이지를 새로고침해주세요."
          //   );
          // }
        };
      } catch (err) {
        // console.error("EventSource 초기화 오류:", err);
        setIsConnected(false);
        setError("알림 서버 연결에 실패했습니다.");
      }
    };

    // 최초 연결 시도
    connectSSE();

    // Cleanup
    return () => {
      if (eventSource) {
        // console.log("SSE 연결 종료");
        eventSource.close();
        setIsConnected(false);
      }
    };
  }, [userId, token]); // userId가 변경될 때만 재연결

  return {
    isConnected,
    error,
    // retryCount,
  };
};

export default UseSSE;
