import { useEffect, useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import PropTypes from "prop-types";

import useEditorStore from "../../../store/translateStore/editorStore";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";

const EditorContent = ({ initialTextContent, maxLength = 15000 }) => {
  const [contentLength, setContentLength] = useState(initialTextContent.length);
  const editorRef = useRef(null);
  const { docsPart, setCurrentUserText } = useEditorStore();

  const fileUrl = communityArticleStore((state) => state.fileUrl);
  const setFileUrl = communityArticleStore((state) => state.setFileUrl);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(initialTextContent);
    }
  }, [initialTextContent]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdownContent = editorInstance.getMarkdown();
      if (markdownContent.length <= maxLength) {
        setCurrentUserText(markdownContent);
        setContentLength(markdownContent.length);
      } else {
        editorInstance.setMarkdown(markdownContent.slice(0, maxLength));
      }
    }
  };

  const handleInsertImage = (url) => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.insertText(`![image](${url})<br/>`);
    }
  };

  useEffect(() => {
    setCurrentUserText(docsPart);
  }, [docsPart]);

  useEffect(() => {
    if (fileUrl) {
      handleInsertImage(fileUrl);
      setFileUrl("");
    }
  }, [fileUrl]);

  return (
    <div className="flex flex-col h-full w-full">
      <Editor
        ref={editorRef}
        initialValue={initialTextContent}
        height="100%"
        previewStyle="tab"
        onChange={handleEditorChange}
        theme="dark"
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task"],
          ["table", "link"],
          ["code", "codeblock"],
        ]}
        useImageUpload={false}
        placeholder={"내용을 입력하세요"}
      />
      <div className="text-xs text-gray-500 mt-1 mr-2 text-right">
        {contentLength} / {maxLength}
      </div>
    </div>
  );
};

EditorContent.propTypes = {
  initialTextContent: PropTypes.string.isRequired,
  maxLength: PropTypes.number.isRequired,
};

export default EditorContent;
