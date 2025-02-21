import { axiosMultipartInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ReportService = {
  async submitReport(formData) {
    try {
      const response = await axiosMultipartInstance.post(
        "/supports/reports",
        formData
      );
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.message === "이미 신고한 상태입니다."
      ) {
        toast.warn("이미 신고한 상태입니다.", {
          toastId: "report-warning",
        });
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.message === "이미지 형식이 아닙니다."
      ) {
        toast.warn("이미지 형식이 아닙니다.", {
          toastId: "report-warning",
        });
      }
      return false;
    }
  },
};

export default ReportService;
