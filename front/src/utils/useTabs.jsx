import { useLocation, useNavigate } from "react-router-dom";

const useTabs = (tabs) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.find((tab) => location.pathname.includes(tab.id))?.id;

  const handleTabChange = (tabId) => {
    const selectedTab = tabs.find((tab) => tab.id === tabId);
    if (selectedTab) {
      navigate(selectedTab.path);
    }
  };

  return { activeTab, handleTabChange };
};

export default useTabs;
