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
      console.error("문의 등록하는 중 오류 발생:", error);
      return null;
    }
  },
};

export default InquiryService;
