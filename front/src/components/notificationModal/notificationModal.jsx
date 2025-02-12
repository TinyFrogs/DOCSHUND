import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import propTypes from "prop-types";

import notificationModalStore from "../../store/notificationModalStore";
import NotificationService from "../../services/notificationService";
import { format, isSameDay } from "date-fns";
import { axiosJsonInstance } from "../../utils/axiosInstance";

const NotificationModal = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const notifications = notificationModalStore((state) => state.notifications); // 알림 목록
  const setNotifications = notificationModalStore(
    (state) => state.setNotifications
  ); // 알림 목록 설정

  // 알림 카테고리 관리
  const [categories] = useState([
    { category: "TRANS", name: "번역" },
    { category: "ARTICLE", name: "게시글" },
    { category: "COMMENT", name: "댓글" },
    { category: "INQUIRY", name: "문의" },
  ]);

  // 유저 ID 가져오기
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  // 알림 SSE <- hook은 항상 최상단에 위치해야 함, 조건부 불가능
  // UseSSE(userId);

  if (!token) {
    toast.warn("로그인이 필요한 서비스입니다.");
    return null;
  }

  // INFO: 알림 클릭 시, 알림 내용 확인 및 그에 해당하는 페이지로 이동
  const handleNotificationClick = async (e, notification) => {
    try {
      const alertId = e.currentTarget.id;

      // NOTE: checkedAt이 null이면 읽지 않은 알림
      // 읽은 알림은 다시 읽지 않음
      if (notification.checkedAt === null) {
        // 알림 클릭 시, 알림 내용 확인
        const response = await NotificationService.readNotification(alertId);

        if (response != 200) {
          toast.warn("알림을 불러오는 중 오류가 발생했습니다.");
          return;
        }
      }

      const notificationCategory = notification.category;
      const notificationCategoryId = notification.categoryId;
      const notificationOriginCategoryId = notification.originCategoryId;

      // NOTE: 1. 번역 알림 -> 번역 페이지로 이동
      if (notificationCategory === "TRANS") {
        navigate(`/myPage/activity/myTrans`);
        // NOTE: 2. 게시글 알림 -> 게시글 페이지로 이동
      } else if (notificationCategory === "ARTICLE") {
        navigate(`/community/article/${notificationCategoryId}`);
        // NOTE: 3. 댓글 알림 -> 댓글 페이지로 이동
      } else if (notificationCategory === "COMMENT") {
        navigate(`/community/article/${notificationOriginCategoryId}`);
        // NOTE: 4. 문의 알림 -> 문의 페이지로 이동
      } else if (notificationCategory === "INQUIRY") {
        navigate(`/helpDesk/inquiryForm`);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // INFO: 모든 알림 읽음 처리
  const handleReadAllNotifications = async () => {
    try {
      // 알림 읽음 처리 확인
      window.confirm("모든 알림을 읽으시겠습니까?");

      const response = await NotificationService.readAllNotifications();

      if (response != 200) {
        toast.warn("알림을 읽는 중 오류가 발생했습니다.");
        return;
      }

      toast.info("모든 알림을 읽음 처리했습니다.");

      // 알림 읽음 처리 후, 알림 목록 갱신
      const data = await NotificationService.fetchNotifications();

      if (data) {
        setNotifications(data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // INFO: 알림 삭제
  const handleDeleteNotification = async (notification) => {
    const alertId = notification.alertId;

    try {
      // 알림 삭제 확인
      window.confirm("알림을 삭제하시겠습니까?");

      const response = await NotificationService.deleteNotification(alertId);

      if (response != 200) {
        toast.warn("알림을 삭제하는 중 오류가 발생했습니다.");
        return;
      }

      toast.info("알림이 삭제되었습니다.");

      // 알림 삭제 후, 알림 목록 갱신
      const newNotifications = notifications.filter(
        (notification) => notification.alertId !== alertId
      ); // 삭제한 알림을 제외한 나머지 알림들

      setNotifications(newNotifications); // 알림 목록 갱신
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAllNotifications = async () => {
    window.confirm("모든 알림을 삭제하시겠습니까?");

    const response = await axiosJsonInstance.deleteAllNotifications();

    if (response != 200) {
      toast.warn("알림을 삭제하는 중 오류가 발생했습니다.");
      return;
    }

    toast.info("모든 알림이 삭제되었습니다.");

    setNotifications([]); // 알림 목록 갱신
  };

  return (
    <div className="w-[360px] h-[460px] bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">알림</h2>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={handleReadAllNotifications}
            >
              전체 읽기
            </button>
            <button
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              onClick={handleDeleteAllNotifications}
            >
              전체 삭제
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-[calc(460px-57px)]">
        {notifications.length > 0 ? (
          <div className="overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.alertId}
                id={notification.alertId}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${
                    notification.checkedAt === null ? "bg-white" : "bg-gray-100"
                  }`}
                onClick={(event) =>
                  handleNotificationClick(event, notification)
                }
              >
                <div className="flex justify-between items-start gap-3">
                  <p
                    className={`text-sm ${
                      notification.checkedAt === null
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {notification.content}
                  </p>
                  <button
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification);
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    {notification?.createdAt
                      ? isSameDay(new Date(notification.createdAt), new Date())
                        ? format(new Date(notification.createdAt), "HH:mm")
                        : format(new Date(notification.createdAt), "yyyy-MM-dd")
                      : "날짜 없음"}
                  </span>
                  {categories.map(
                    (category) =>
                      category.category === notification.category && (
                        <span
                          key={category.category}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
                        >
                          {category.name}
                        </span>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <div className="mb-4">
              <div className="relative">
                <Bell className="w-12 h-12 text-gray-300" />
                <div className="absolute top-0 right-0 w-12 h-12">
                  <div className="relative w-full h-full">
                    <div className="absolute top-1/2 left-1/2 w-10 h-0.5 bg-gray-300 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              새로운 알림이 없습니다
            </p>
            <p className="mt-2 text-xs text-gray-400 text-center">
              게시글 작성과 번역하기로 활동을 시작해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

NotificationModal.propTypes = {
  userId: propTypes.string,
};

export default NotificationModal;
