import { axiosMultipartInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const InquiryService = {
  async submitInquiry(formData) {
    try {
      const response = await axiosMultipartInstance.post(
        "/supports/inquiry",
        formData
      );
      return response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.message === "유효하지 않은 메일입니다."
      ) {
        toast.warn("유효하지 않은 메일입니다.", { toastId: "report-warning" });
      } else if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.message === "이미지 형식이 아닙니다."
      ) {
        toast.warn("이미지 형식이 아닙니다.", { toastId: "report-warning" });
      } else {
        toast.error("문의 제출 중 오류가 발생했습니다.", {
          toastId: "report-error",
        });
      }
      return false;
    }
  },
};

export default InquiryService;
