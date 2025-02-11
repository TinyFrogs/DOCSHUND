import { useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import propTypes from "prop-types";

import useEditorStore from "../../../store/translateStore/editorStore";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";

const EditorContent = ({ initialTextContent }) => {
  // initialTextContent가 없으면 에디터 초기화
  useEffect(() => {
    // contentLength 초기화
    setContentLength(initialTextContent.length);

    if (!initialTextContent) {
      editorRef.current.getInstance().setMarkdown(""); // 에디터 초기화
      setContentLength(0); // contentLength 초기화
      console.log("initialTextContent: ", initialTextContent);
    }
  }, [initialTextContent]);

  const editorRef = useRef(null);
  const { docsPart, setCurrentUserText } = useEditorStore();

  const fileUrl = communityArticleStore((state) => state.fileUrl);
  const setFileUrl = communityArticleStore((state) => state.setFileUrl);
  const setContentLength = communityArticleStore(
    (state) => state.setContentLength
  );

  const handleEditorChange = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const markdownContent = editorInstance.getMarkdown();
      setCurrentUserText(markdownContent);
      setContentLength(markdownContent.length);
    }
  };

  const handleInsertImage = (url) => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.insertText(`![image](${url})<br/>`);
    } else {
      console.log("editorRef is null");
    }
  };

  useEffect(() => {
    setCurrentUserText(docsPart);
  }, [docsPart]);

  useEffect(() => {
    if (fileUrl) {
      handleInsertImage(fileUrl);
      setFileUrl(""); // 이미지 URL 초기화
    }
  }, [fileUrl]);

  return (
    <div className="flex flex-col h-full w-full">
      <Editor
        ref={editorRef}
        initialValue={initialTextContent}
        height="100%"
        // initialEditType="markdown" // or 'wysiwyg'
        previewStyle="tab" // or 'tab'
        onChange={handleEditorChange}
        theme="dark" // 필요에 따라 테마 설정
        toolbarItems={[
          ["heading", "bold", "italic", "strike"], // 기본 버튼만 추가
          ["hr", "quote"],
          ["ul", "ol", "task"],
          ["table", "link"], // 이미지 버튼 제외
          ["code", "codeblock"],
        ]}
        useImageUpload={false}
        placeholder={"내용을 입력하세요"}
      />
    </div>
  );
};

EditorContent.propTypes = {
  initialTextContent: propTypes.string,
};

export default EditorContent;
