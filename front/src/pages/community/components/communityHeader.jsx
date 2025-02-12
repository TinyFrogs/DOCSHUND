import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import RectBtn from "../../../components/button/rectBtn";

const CommunityHeader = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  // 현재 페이지가 글 목록인지 확인
  const isArticleList = location.pathname === "/community/list";

  return (
    <div className="mb-6">
      {/* 2-1. 헤더 영역 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#2C2C2C]">커뮤니티</h1>
        {/* NOTE: 로그인한 회원이고, 글 목록에서만 보이게 함 */}
        {isLoggedIn && isArticleList && (
          <RectBtn
            onClick={() => navigate("/community/write")}
            text="글쓰기"
            className="px-4 py-2 text-base"
          />
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
