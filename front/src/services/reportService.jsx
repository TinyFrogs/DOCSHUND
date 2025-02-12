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
      console.error("신고 등록하는 중 오류 발생:", error);
      return null;
    }
  },
};

export default ReportService;
