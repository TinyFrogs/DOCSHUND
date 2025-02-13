import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

const MyPage = () => {
  return (
    <div className="w-full flex px-8 py-5 justify-center max-w-screen-xl mx-auto">
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPage;
