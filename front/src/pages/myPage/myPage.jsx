import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

const MyPage = () => {
  return (
    <div className="w-full flex flex-col md:flex-row px-4 md:px-8 py-5 max-w-screen-xl mx-auto gap-4">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MyPage;
