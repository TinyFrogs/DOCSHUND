import { axiosMultipartInstance } from "../utils/axiosInstance";

const ReportService = {
  async submitReport(formData) {
    try {
      const response = await axiosMultipartInstance.post(
        "/supports/reports",
        formData
      );
      return response.data;
    } catch (error) {
      console.error("신고 전송 중 오류 발생:", error);
      throw error;
    }
  },
};

export default ReportService;
