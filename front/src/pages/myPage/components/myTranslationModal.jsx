import PropTypes from "prop-types";
import Toastviewer from "../../../pages/translate/components/toastViewer";

const MyTranslationModal = ({ item, docsPart }) => {
  return (
    <div className="mt-2 p-3 bg-[#F9F8F2] flex justify-between gap-2 text-sm font-light">
      <div className="w-1/2">
        <h4 className="text-[#7D7C77] mb-2">[원문]</h4>
        <p className="mb-2 p-4 bg-white rounded-xl border border-[#E1E1DF]">
          <Toastviewer content={docsPart} />
        </p>
      </div>
      <div className="w-1/2">
        <h4 className="text-[#7D7C77] mb-2">[나의 번역]</h4>
        <p className="mb-2 p-4 bg-white rounded-xl border border-[#E1E1DF]">
          <Toastviewer content={item.content} />
        </p>
      </div>
    </div>
  );
};

MyTranslationModal.propTypes = {
  item: PropTypes.shape({
    content: PropTypes.string.isRequired,
    answered: PropTypes.bool.isRequired,
    answerContent: PropTypes.string,
  }).isRequired,
};

export default MyTranslationModal;
