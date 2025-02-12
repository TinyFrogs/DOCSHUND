import { Outlet } from "react-router-dom";
import AdminSideBar from "./components/adminSideBar";

const Admin = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSideBar />
      <main className="flex-1 p-6 ml-[280px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
