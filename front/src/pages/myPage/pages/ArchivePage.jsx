import { Outlet } from "react-router-dom";
import useTabs from "../../../utils/useTabs";
import Tabs from "../../../components/Tabs";
import ArticleItemService from "../../community/services/articleItemService";
import {
  likeDocs,
  likeTranslate,
} from "../../translate/services/translatePostService";
import _ from "lodash";

const ArchivePage = () => {
  const tabs = [
    { id: "likeTrans", label: "번역본", path: "/archive/likeTrans" },
    { id: "likeArticle", label: "게시글", path: "/archive/likeArticle" },
    { id: "likeDocs", label: "문서", path: "/archive/likeDocs" },
  ];

  const { activeTab, handleTabChange } = useTabs(tabs);

  const handleLikeToggle = _.debounce(async (type, id, transId = null) => {
    try {
      if (type === "article") {
        await ArticleItemService.likeArticleItem(id);
      } else if (type === "docs") {
        await likeDocs(id);
      } else if (type === "trans" && transId) {
        await likeTranslate(id, transId);
      }
    } catch (error) {
      console.log("좋아요 토글 실패", error);
    }
  }, 300);

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">보관함</h1>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <Outlet context={{ handleLikeToggle }} />
    </div>
  );
};

export default ArchivePage;
