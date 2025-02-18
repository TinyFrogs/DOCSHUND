import { axiosMultipartInstance } from "../../utils/axiosInstance";

const InquiryService = {
  async submitInquiry(formData) {
    try {
      const response = await axiosMultipartInstance.post(
        "/supports/inquiry",
        formData
      );
      return response.data;
    } catch (error) {
      console.error("문의 전송 중 오류 발생:", error);
      throw error;
    }
  },
};

export default InquiryService;
