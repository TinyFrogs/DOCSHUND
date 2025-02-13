import CommunityLeftNav from "./components/communityLeftNav";

import { Outlet } from "react-router-dom";

const community = () => {
  return (
    <div className="w-full flex px-8 py-5 justify-center max-w-screen-xl mx-auto">
      {/* 좌측 내비게이션 바 */}
      <CommunityLeftNav />
      {/* 리스트, 글 상세, 글 작성, 글 수정 페이지 routes */}
      <Outlet />
    </div>
  );
};

export default community;
