import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import back from "../../../assets/icon/goBack.png";
import useEditorStore from "../../../store/translateStore/editorStore";

const MAX_TITLE_LENGTH = 50;
const MAX_CONTENT_LENGTH = 15000;

const EditorModal = ({
  title,
  buttonText,
  onSubmit,
  isOpen,
  closeModal,
  memoData,
  onDelete,
}) => {
  const [formData, setFormData] = useState({ title: "" });
  const { setCurrentUserText, currentUserText } = useEditorStore();
  const editorRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (memoData) {
        setFormData({ title: memoData.title || "" });
        setCurrentUserText(memoData.content || "");
        if (editorRef.current) {
          editorRef.current.getInstance().setMarkdown(memoData.content || "");
        }
      } else {
        setFormData({ title: "" });
        setCurrentUserText("");
        if (editorRef.current) {
          editorRef.current.getInstance().setMarkdown("");
        }
      }
    } else {
      setFormData({ title: "" });
      setCurrentUserText("");
      if (editorRef.current) {
        editorRef.current.getInstance().setMarkdown("");
      }
    }
  }, [isOpen, memoData, setCurrentUserText]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length <= MAX_TITLE_LENGTH) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdownContent = editorInstance.getMarkdown();
      if (markdownContent.length <= MAX_CONTENT_LENGTH) {
        setCurrentUserText(markdownContent);
      } else {
        editorInstance.setMarkdown(
          markdownContent.slice(0, MAX_CONTENT_LENGTH)
        );
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const editorContent = currentUserText;
    const submitData = { ...formData, content: editorContent };
    if (memoData && memoData.memoId) {
      onSubmit(memoData.memoId, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  const handleDelete = () => {
    if (memoData && onDelete) {
      onDelete(memoData.memoId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-brightness-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white w-3/5 rounded-lg border border-[#E1E1DF] shadow-lg overflow-hidden flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between p-4 border-b">
              <button onClick={closeModal} className="cursor-pointer">
                <img src={back} alt="뒤로가기" />
              </button>
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col p-4 space-y-4"
            >
              <div>
                <label className="block text-lg font-medium text-black mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="제목 입력"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full py-2 px-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                  {formData.title.length} / {MAX_TITLE_LENGTH}
                </p>
              </div>
              <Editor
                ref={editorRef}
                initialValue={memoData?.content || " "}
                height="400px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                placeholder="내용을 입력해주세요"
                onChange={handleEditorChange}
              />
              <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
                {currentUserText.length} / {MAX_CONTENT_LENGTH}
              </p>

              <div className="flex justify-end space-x-3">
                {memoData && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-sm rounded-[12px] px-[20px] w-fit h-10 hover:bg-[#bc5b39] hover:text-[#ffffff] cursor-pointer"
                  >
                    삭제
                  </button>
                )}
                <button
                  type="submit"
                  className="text-sm bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 text-[#ffffff] hover:bg-[#C96442] cursor-pointer"
                >
                  {buttonText}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

EditorModal.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  memoData: PropTypes.object,
  onDelete: PropTypes.func,
};

export default EditorModal;
