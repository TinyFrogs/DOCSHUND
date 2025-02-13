import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../services/authService";
import useAuthStore from "../store/authStore";
import useModalStore from "../store/modalStore";

//assets
import logo from "../assets/logo.png";
import google from "../assets/google.png";
import github from "../assets/github.png";

const LoginModal = () => {
  const { isModalOpen, closeModal } = useModalStore();
  const { loginWithGoogle, loginWithGithub } = authService();
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem("token", urlToken);
      closeModal();
      navigate("/");
    }
  }, [navigate, closeModal, setToken]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="flex flex-col gap-9 bg-[#FAF9F5] border2 border-[#E1E1DF] p-6 rounded-lg w-1/2 h-auto max-w-120 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end">
              <button
                className="font-bold text-4xl text-[#BC5B39] cursor-pointer"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-8/10" />
            </div>
            <div className="flex flex-col items-center mt-4 mb-4">
              <div
                className="flex items-center justify-center w-8/10 p-2 bg-[#BC5B39] rounded-[15px] border-3 border-[#C96442] hover:bg-[#C96442] mb-4 cursor-pointer"
                onClick={loginWithGoogle}
              >
                <img src={google} alt="google" className="mr-4" />
                <button className="text-[#FAF9F5] text-sm">
                  Sign in with Google
                </button>
              </div>
              <div
                className="flex items-center justify-center w-8/10 p-2 bg-[#BC5B39] rounded-[15px] border-3 border-[#C96442] hover:bg-[#C96442] cursor-pointer"
                onClick={loginWithGithub}
              >
                <img src={github} alt="github" className="mr-4" />
                <button className=" text-[#FAF9F5] text-sm">
                  Sign in with GitHub
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
