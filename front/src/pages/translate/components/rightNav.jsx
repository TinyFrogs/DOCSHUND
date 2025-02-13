import React, { useState } from "react";

const GoogleDocsSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`
      ${isOpen ? "w-64" : "w-12"} 
      h-screen fixed top-0 right-0 bg-gray-100 border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="w-full text-left py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
        >
          {isOpen ? "접기" : "펼치기"}
        </button>
      </div>
      <div className="p-4">
        {/* 여기에 검색 기능 및 메뉴 아이템 추가 */}
        <ul>
          <li>메뉴 아이템 1</li>
          <li>메뉴 아이템 2</li>
          <li>메뉴 아이템 3</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleDocsSidebar;
