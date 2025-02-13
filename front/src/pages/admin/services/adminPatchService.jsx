import { axiosJsonInstance } from "../../../utils/axiosInstance";
const baseUrl = "http://i12a703.p.ssafy.io:8081/api/v1/docshund";

// 좋아요한 문서 조회
export const changeUserStatus = async (userId, status) => {
  try {
    const response = await axiosJsonInstance.patch(
      `${baseUrl}/users/${userId}/status`,
      { status: status }
    );
    const data = response.status;
    console.log(data);
    return data;
  } catch (error) {
    console.log("유저 상태 변경 실패", error);
  }
};

export const modifyNotice = async (noticeId, title, content) => {
  try {
    const response = await axiosJsonInstance.patch(
      `${baseUrl}/supports/notice/${noticeId}`,
      { title, content }
    );
    const data = response.status;
    console.log(data);
    return data;
  } catch (error) {
    console.log("공지사항 수정 실패", error);
  }
};
