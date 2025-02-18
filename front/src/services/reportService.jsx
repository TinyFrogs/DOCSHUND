import { axiosMultipartInstance } from "../utils/axiosInstance";

const ReportService = {
  async submitReport(formData) {
    const response = await axiosMultipartInstance.post(
      "/supports/reports",
      formData
    );
    return response.data;
  },
};

export default ReportService;
