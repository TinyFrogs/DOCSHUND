import { axiosJsonInstance } from "../../../utils/axiosInstance";

// 좋아요한 문서 조회
export const fetchUserList = async (page, size) => {
  try {
    const response = await axiosJsonInstance.get(
      `/users?page=${page}&size=${size}`
    );
    const data = response.data.content;
    return data;
  } catch (error) {
    // console.log("유저 목록 조회 실패", error);
  }
};

export const fetchReportList = async () => {
  try {
    const response = await axiosJsonInstance.get(`/supports/reports`);
    const data = response.data.content;
    console.log(data);
    return data;
  } catch (error) {
    // console.log("신고 목록 조회 실패", error);
  }
};

export const fetchInquiryList = async () => {
  try {
    const response = await axiosJsonInstance.get(`/supports/inquiry`);
    const data = response.data.content;
    console.log(data);
    return data;
  } catch (error) {
    // console.log("문의 목록 조회 실패", error);
  }
};

export const fetchNoticeList = async () => {
  try {
    const response = await axiosJsonInstance.get(`supports/notice`);
    const data = response.data;
    // console.log(data);
    return data;
  } catch (error) {
    // console.log("공지 목록 조회 실패", error);
  }
};
