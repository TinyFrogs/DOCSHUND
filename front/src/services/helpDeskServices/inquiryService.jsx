import { axiosMultipartInstance } from "../../utils/axiosInstance";

const InquiryService = {
  async submitInquiry(formData) {
    const response = await axiosMultipartInstance.post(
      "/supports/inquiry",
      formData
    );
    return response.data;
  },
};

export default InquiryService;
