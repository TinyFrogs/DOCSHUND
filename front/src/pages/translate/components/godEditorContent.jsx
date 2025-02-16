import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import propTypes from "prop-types";

import useEditorStore from "../../../store/translateStore/editorStore";
import communityArticleStore from "../../../store/communityStore/communityArticleStore";

const GodEditorContent = ({ initialTextContent, maxLength = 15000 }) => {
  const { docsPart, currentUserText, setCurrentUserText } = useEditorStore();
  const [value, setValue] = useState(initialTextContent);

  const handleChange = (newText) => {
    setValue(newText);
    setCurrentUserText(newText);
    console.log("현재 에디터에 입력되는 값입니다.", value);
    console.log("제출될 내용입니다.", currentUserText);
  };

  return (
    <div className="h-full">
      {/* Markdown 에디터 */}
      <MDEditor
        value={value}
        onChange={handleChange}
        data-color-mode="light"
        height="96%"
        textareaProps={{
          placeholder: "최대 15000자까지 입력 가능합니다.",
          maxLength: maxLength, // 최대 입력 글자 수 설정
        }}
        visibleDragbar={false}
      />

      {/* Markdown 미리보기 */}
      {/* <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} /> */}
      <div
        style={{
          marginTop: "10px",
          color: value.length >= maxLength ? "red" : "black",
        }}
        className="flex justify-end mx-5"
      >
        {maxLength - value.length} 글자 남음
      </div>
    </div>
  );
};

GodEditorContent.propTypes = {
  initialTextContent: propTypes.string,
  maxLength: propTypes.number,
};

export default GodEditorContent;
