import axios from "axios";
import useAuthStore from "../store/authStore"; // authStore 임포트 (경로 확인)

const BASE_URL = "https://i12a703.p.ssafy.io/api/v1/docshund/";

// JSON 요청용 Axios 인스턴스
const axiosJsonInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Multipart 요청용 Axios 인스턴스
const axiosMultipartInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// 요청 인터셉터 (토큰 추가)
const requestInterceptor = (config) => {
  const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// 응답 인터셉터 (에러 처리)
const responseInterceptor = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.message || "알 수 없는 오류가 발생했습니다.";

    if (status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return Promise.reject(error);
    } else if (
      (status === 400 &&
        (message === "이미 신고한 상태입니다." ||
          message === "유효하지 않은 메일입니다." ||
          message === "이미지 형식이 아닙니다." ||
          message === "문서에 이미 연결된 원본이 존재합니다." ||
          message === "필수 요소는 비워둘 수 없습니다.")) ||
      message === "해당 데이터를 찾을 수 없습니다." ||
      message === "해당 게시글을 찾을 수 없습니다." ||
      message === "해당 댓글을 찾을 수 없습니다."
    ) {
      return Promise.reject(error);
    } else {
      if (window.location.pathname !== "/error") {
        window.location.href = `/error?status=${status}&message=${encodeURIComponent(
          message
        )}`;
      }
    }
  }
  return Promise.reject(error);
};

// 인터셉터 적용
axiosJsonInstance.interceptors.request.use(requestInterceptor, (error) => {
  Promise.reject(error);
});
axiosMultipartInstance.interceptors.request.use(requestInterceptor, (error) => {
  Promise.reject(error);
});

axiosJsonInstance.interceptors.response.use(
  (response) => response,
  responseInterceptor
);
axiosMultipartInstance.interceptors.response.use(
  (response) => response,
  responseInterceptor
);

export { axiosJsonInstance, axiosMultipartInstance };
