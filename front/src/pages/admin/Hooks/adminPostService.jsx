import { axiosJsonInstance } from "../../../utils/axiosInstance";
import PropTypes from "prop-types";
const baseUrl = "http://i12a703.p.ssafy.io:8081/api/v1/docshund";

// 좋아요한 문서 조회
export const withdrawReport = async (reportId) => {
  try {
    const response = await axiosJsonInstance.post(
      `${baseUrl}/supports/reports/${reportId}/withdraw`
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log("신고 취소 처리 실패", error);
  }
};
