import axios from "axios";
import { toast } from "react-toastify"; // toast 임포트
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
      // 401 에러 발생 시: 잘못된/만료된 토큰 처리
      useAuthStore.getState().logout(); // store에서 토큰 삭제 및 상태 업데이트
      toast.error(
        "세션이 만료되었거나 유효하지 않은 토큰입니다. 다시 로그인 해주세요."
      );
      if (window.location.pathname !== "/") {
        window.location.href = "/"; // 홈 페이지로 강제 이동
      }
    } else {
      // 401 이외의 에러: /error 페이지로 이동
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
axiosJsonInstance.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);
axiosMultipartInstance.interceptors.request.use(requestInterceptor, (error) =>
  Promise.reject(error)
);

axiosJsonInstance.interceptors.response.use(
  (response) => response,
  responseInterceptor
);
axiosMultipartInstance.interceptors.response.use(
  (response) => response,
  responseInterceptor
);

export { axiosJsonInstance, axiosMultipartInstance };
