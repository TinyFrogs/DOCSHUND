import { ToastContainer } from "react-toastify";

const ToastModal = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      limit={1}
      theme="light"
    />
  );
};

export default ToastModal;
