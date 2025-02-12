import { Outlet } from "react-router-dom";
import Tabs from "../../components/Tabs";
import useTabs from "../../utils/useTabs";

const HelpDeskPage = () => {
  const tabs = [
    { id: "notices", label: "공지사항", path: "/helpDesk/notices" },
    { id: "faq", label: "FAQ", path: "/helpDesk/faq" },
    { id: "inquiryForm", label: "문의", path: "/helpDesk/inquiryform" },
  ];

  const { activeTab, handleTabChange } = useTabs(tabs);

  return (
    <div className="w-full px-12 py-5 max-w-screen-xl mx-auto">
      <div className="flex justify-between mt-4 mb-5">
        <h1 className="pl-4 font-bold text-2xl">헬프데스크</h1>
      </div>
      <Tabs
        tabs={tabs}
        activeTab={activeTab || tabs[0].id}
        onTabChange={handleTabChange}
      />
      <Outlet />
    </div>
  );
};

export default HelpDeskPage;
