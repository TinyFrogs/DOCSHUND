import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

const AuthService = () => {
  const navigate = useNavigate();
  const { token, loginWithGoogle, loginWithGithub, logout, isAuthenticated } =
    useAuthStore();

  const loginGoogleHandler = async () => {
    try {
      loginWithGoogle();
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      toast.error("Google 로그인에 실패했습니다.");
    }
  };

  const loginGithubHandler = async () => {
    try {
      loginWithGithub();
    } catch (error) {
      console.error("GitHub 로그인 실패:", error);
      toast.error("GitHub 로그인에 실패했습니다.");
    }
  };

  const logoutAndRedirect = () => {
    logout();
    toast.success("로그아웃 되었습니다.");
    navigate("/");
  };

  return {
    token,
    loginWithGoogle: loginGoogleHandler,
    loginWithGithub: loginGithubHandler,
    logout: logoutAndRedirect,
    isAuthenticated,
  };
};

export default AuthService;
