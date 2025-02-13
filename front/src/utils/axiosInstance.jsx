import axios from "axios";

// const BASE_URL = "https://i12a703.p.ssafy.io/api/v1/docshund/";
const BASE_URL = "http://i12a703.p.ssafy.io:8081/api/v1/docshund";

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

// // 응답 인터셉터 (에러 처리)
const responseInterceptor = (error) => {
  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.message || "알 수 없는 오류가 발생했습니다.";

    // 현재 경로가 /error가 아닐 때만 이동
    if (window.location.pathname !== "/error") {
      window.location.href = `/error?status=${status}&message=${encodeURIComponent(
        message
      )}`;
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

// axiosJsonInstance.interceptors.response.use(
//   (response) => response,
//   responseInterceptor
// );
// axiosMultipartInstance.interceptors.response.use(
//   (response) => response,
//   responseInterceptor
// );

export { axiosJsonInstance, axiosMultipartInstance };
