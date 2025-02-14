import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";
import PropTypes from "prop-types";

const ProtectedRoute = ({ isAdminRoute }) => {
  const { isAuthenticated } = authService();
  const token = localStorage.getItem("token");

  // 토큰이 없으면 인증되지 않은 것으로 간주
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    const isAdmin = role === "ROLE_ADMIN";

    // Admin 라우트인데, 관리자가 아니면 권한 없음 페이지로 리다이렉트
    if (isAdminRoute && !isAdmin) {
      return <Navigate to="/error" replace />; // 권한 없음 페이지
    }

    // 인증되어 있고, Admin 라우트가 아니거나, Admin이고 Admin 라우트인 경우 자식 라우트 렌더링
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
  } catch (error) {
    // 토큰 디코딩 실패 처리 (토큰 만료 또는 손상)
    console.error("토큰 디코딩 오류:", error);
    localStorage.removeItem("token"); // 유효하지 않은 토큰 삭제
    return <Navigate to="/" replace />; // 로그인 페이지로 리다이렉트
  }
};
ProtectedRoute.propTypes = {
  isAdminRoute: PropTypes.bool.isRequired,
};

export default ProtectedRoute;
