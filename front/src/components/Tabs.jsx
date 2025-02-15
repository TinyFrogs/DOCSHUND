import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    navigate(tabId);
  };

  return (
    <div className="flex pt-4 pl-6 bg-white rounded-tl-xl rounded-tr-xl border border-[#E1E1DF]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`px-6 py-2 text-xl font-semibold cursor-pointer ${
            activeTab === tab.id
              ? "border-b-3 border-[] text-[#bc5b39]"
              : "text-[#7D7C77] hover:text-[#bc5b39]"
          }`}
        >
          {tab.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default Tabs;
