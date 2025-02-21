import { axiosJsonInstance } from "../../utils/axiosInstance";

const NoticeService = {
  async fetchNotices(page, size) {
    try {
      const response = await axiosJsonInstance.get(
        `supports/notice?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      // console.error("공지사항 목록 가져오는 중 오류 발생:", error);
      return null;
    }
  },

  async fetchNoticeDetail(noticeId) {
    try {
      const response = await axiosJsonInstance.get(
        `supports/notice/${noticeId}`
      );
      return response.data;
    } catch (error) {
      // console.error("공지사항 상세 가져오는 중 오류 발생:", error);
      return null;
    }
  },
};

export default NoticeService;
