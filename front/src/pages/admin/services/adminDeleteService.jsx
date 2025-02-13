import { axiosJsonInstance } from "../../../utils/axiosInstance";
const baseUrl = "http://i12a703.p.ssafy.io:8081/api/v1/docshund";

// 좋아요한 문서 조회
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosJsonInstance.delete(
      `${baseUrl}/supports/notice/${notificationId}`
    );
    const data = response.status;
    return data;
  } catch (error) {
    console.log("공지 목록 삭제 실패", error);
  }
};
