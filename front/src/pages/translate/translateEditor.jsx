import Modal from "react-modal";
import { useState } from "react";
import * as motion from "motion/react-client";
import { fetchBestTranslate } from "./services/translateGetService";
import { registTranslate } from "./services/translatePostService";
import { AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import TextContent from "./components/textContent";
import EditorContent from "./components/editorContent";
import RectBtn from "../../components/button/rectBtn";

//상태 관련
import useModalStore from "../../store/translateStore/translateModalStore";
import useEditorStore from "../../store/translateStore/editorStore";
import useArchiveStore from "../../store/translateStore/archiveStore";
//

const TranslateEditor = () => {
  const { docsPart, bestTrans, docsId, originId, porder, currentUserText } =
    useEditorStore();
  const [isVisible, setIsVisible] = useState(false);

  //모달 관련 상태
  const { isEditorOpen, closeEditor, openArchive } = useModalStore();

  const {
    clearDocsPart,
    clearBestTrans,
    submitData,
    clearTempSave,
    clearSubmitData,
  } = useEditorStore();

  const { setTransList } = useArchiveStore();

  //에디터 내용 변경 상태
  const { setTempSave, setSubmitData } = useEditorStore();

  const handleSubmit = async (docsId, originId, currentUserText) => {
    const status = await registTranslate(docsId, originId, currentUserText);
    return status;
  };

  const handleClose = () => {
    clearDocsPart();
    clearBestTrans();
    clearTempSave();
    clearSubmitData();
  };

  return (
    <AnimatePresence>
      {isEditorOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[2100] backdrop-brightness-60 border-box w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <motion.div
            key="editor-modal"
            // initial={{ opacity: 0, y: 1000 }}
            // animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: 1000 }}
            // transition={{
            //   ease: "easeOut",
            //   duration: 0.3,
            // }}
            className="fixed inset-0 flex items-center justify-center min-w-full min-h-full "
          >
            <div className="relative m-5 p-4 w-full h-[95%] min-w-[768px] min-h-[80%] max-w-full max-h-[95%] rounded-lg bg-white shadow-sm">
              <div className="flex shrink-0 w-full items-center pb-4 text-xl font-medium text-slate-800 justify-between">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 transition-all duration-300 hover:bg-slate-100">
                  <svg
                    className="w-5 h-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-base font-semibold text-slate-700">
                    {porder} 번째 문단
                  </span>
                  <span className="text-sm text-slate-600">번역 중</span>
                </div>
                <div className="flex space-x-6 ">
                  <RectBtn
                    onClick={async () => {
                      if (
                        currentUserText === "" ||
                        currentUserText === null ||
                        currentUserText.trim() === "" ||
                        currentUserText.trim() === undefined
                      ) {
                        toast.error("내용을 입력해주세요.");
                        return;
                      }
                      setSubmitData(currentUserText);
                      const status = await handleSubmit(
                        docsId,
                        originId,
                        currentUserText
                      );

                      if (status !== 200) {
                        toast.error("제출 실패");
                      } else {
                        toast.success("제출 완료");
                        const tmpTransList = await fetchBestTranslate(
                          docsId,
                          "",
                          false
                        );
                        tmpTransList.sort((a, b) => b.likeCount - a.likeCount);
                        setTransList(tmpTransList);
                        setIsVisible(true);
                        setTimeout(() => setIsVisible(false), 1500);
                        setTimeout(() => closeEditor(), 2000);
                        setTimeout(() => openArchive(), 2000);
                      }
                    }}
                    text="제출하기"
                  />
                  <RectBtn
                    onClick={async () => {
                      closeEditor();
                      handleClose();
                    }}
                    text="나가기"
                  />
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 leading-normal text-slate-600 h-[calc(100%-3rem)] w-full flex gap-2">
                {/* 에디터 모달 안에 들어갈 컨텐츠 */}
                <div className="h-full w-1/2 flex flex-col space-y-2 overflow-hidden">
                  <TextContent tag="공식문서 원본" textContent={docsPart} />
                  <TextContent tag="베스트 번역" textContent={bestTrans} />
                </div>

                <div className="h-full w-1/2 right-1/2">
                  <EditorContent initialTextContent={docsPart} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TranslateEditor;
