import { Outlet } from "react-router-dom";
import useTabs from "../../../utils/useTabs";
import Tabs from "../../../components/Tabs";

const ActivityPage = () => {
  const tabs = [
    { id: "myTrans", label: "번역본", path: "/activity/myTrans" },
    { id: "myArticle", label: "게시글", path: "/activity/myArticle" },
    { id: "myComment", label: "댓글", path: "/activity/myComment" },
  ];

  const { activeTab, handleTabChange } = useTabs(tabs);

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">나의 활동</h1>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <Outlet />
    </div>
  );
};

export default ActivityPage;
