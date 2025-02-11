import { useState, useEffect } from "react";
import { fetchBestTranslate } from "./hooks/translateGetService.jsx";
import { likeTranslate } from "./hooks/translatePostService.jsx";
import { jwtDecode } from "jwt-decode";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import Modal from "react-modal";
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import GoBack from "../../assets/icon/goBack.png";
import useEditorStore from "../../store/translateStore/editorStore.jsx";
import useArchiveStore from "../../store/translateStore/archiveStore.jsx";
import ToastViewer from "./components/toastViewer.jsx";

import ReportModal from "../report.jsx";
import useReportStore from "../../store/reportStore.jsx";

const TranslateArchive = () => {
  const decodedToken = jwtDecode(localStorage.getItem("token"));
  const userId = decodedToken.userId;

  const [transStates, setTransStates] = useState({});
  const [status, setStatus] = useState(0);

  const {
    docsId,
    originId,
    clearDocsPart,
    clearBestTrans,
    clearTempSave,
    clearSubmitData,
    clearDocsId,
    clearOriginId,
    clearCurrentUserText,
  } = useEditorStore();
  const {
    transList,
    orderBy,
    orderByLike,
    defaultStyle,
    toggledStyle,
    orderByUpdatedAt,
    setTransList,
    setOrderBy,
    setOrderByLike,
    setOrderByUpdatedAt,
  } = useArchiveStore();
  const {
    openReport,
    toggleReport,
    originContent,
    reportedUser,
    chatId,
    articleId,
    transId,
    commentId,
  } = useReportStore();

  //모달 관련 상태
  const { isArchiveOpen, closeArchive, isArchiveVisible, toggleArchive } =
    useModalStore();

  const toggleTransContent = (transId) => {
    setTransStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (key !== transId) {
          acc[key] = false;
        }
        return acc;
      }, {}),
      [transId]: !prev[transId],
    }));
  };

  const handleLike = async (docsId, transId) => {
    const status = await likeTranslate(docsId, transId);
    if (status === 200) {
      await fetchBestTranslate(docsId, "");
      setStatus(200);
    }
  };

  const handleClose = () => {
    clearDocsPart();
    clearBestTrans();
    clearTempSave();
    clearSubmitData();
    clearDocsId();
    clearOriginId();
    clearCurrentUserText();
  };

  const changeOrderBy = (category, list) => {
    if (category === "like") {
      list.sort((a, b) => b.likeCount - a.likeCount);
    } else if (category === "newest") {
      list.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);
        return dateB - dateA;
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const tmpTransList = await fetchBestTranslate(docsId, "");
      console.log(docsId, "번역 전체", tmpTransList);
      setTransList(tmpTransList);
      changeOrderBy("like", tmpTransList);
    };

    setStatus(0);
    fetchData();
  }, [isArchiveOpen, status]);

  return (
    <Modal
      isOpen={isArchiveOpen}
      closeTimeoutMS={0}
      style={{
        overlay: {
          backgroundColor: "rgba(240,238,229,0.8)",
          zIndex: 2000,
        },
      }}
      className="border-box w-full h-full flex items-center justify-center"
    >
      <AnimatePresence>
        {isArchiveVisible ? (
          <motion.div
            key="archive-modal"
            initial={{ opacity: 0, y: 1000 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 1000 }}
            transition={{
              ease: "easeInOut",
              duration: 0.5,
            }}
            className="fixed inset-0 flex items-center justify-center min-w-full min-h-full "
          >
            <ReportModal />
            <div className="relative m-5 p-6 w-1/2 h-[95%] min-w-[768px] min-h-[80%] max-w-full max-h-full rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out">
              <div className="flex shrink-0 pb-6 text-2xl font-semibold text-slate-800 justify-between items-center">
                <img
                  src={GoBack}
                  className="cursor-pointer w-[40px] h-[25px] hover:scale-110 transition-transform duration-200"
                  alt="나가기"
                  onClick={async () => {
                    await toggleArchive();
                    handleClose();
                    setTimeout(() => closeArchive(), 300);
                  }}
                />
                <span className="flex-1 text-center">
                  {originId}번째 문단 번역 기록
                </span>
                <div className="w-[40px]"></div>
              </div>
              <div className="flex justify-end gap-4 mb-2">
                <div
                  onClick={() => {
                    setOrderByUpdatedAt();
                    setOrderBy("newest");
                    changeOrderBy("newest", transList);
                  }}
                  className={`${
                    orderByUpdatedAt ? toggledStyle : defaultStyle
                  } transition-all duration-200 hover:shadow-md`}
                >
                  최신순
                </div>
                <div
                  onClick={() => {
                    setOrderByLike();
                    setOrderBy("like");
                    changeOrderBy("like", transList);
                  }}
                  className={`${
                    orderByLike ? toggledStyle : defaultStyle
                  } transition-all duration-200 hover:shadow-md`}
                >
                  좋아요순
                </div>
              </div>
              <div className="relative border-t border-slate-200 py-6 leading-normal text-slate-600 font-light h-9/11 flex flex-col gap-4 overflow-y-scroll">
                <div>
                  {transList.filter((trans) => trans.originId === originId)
                    .length === 0 && (
                    <div className="text-center text-gray-500 mt-12 text-lg font-medium animate-pulse">
                      첫 번째 번역의 주인공이 되세요!
                    </div>
                  )}
                </div>
                {transList.map((trans) => {
                  if (trans.originId === originId) {
                    return (
                      <div
                        key={trans.transId}
                        className="w-full flex flex-col bg-white border border-[#87867F] py-4 px-5 rounded-xl hover:shadow-lg transition-all duration-300 ease-in-out"
                      >
                        <div
                          onClick={() => {
                            toggleTransContent(trans.transId);
                          }}
                          className="flex flex-row justify-between cursor-pointer items-center"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="text-lg font-medium">
                              {trans.userId}님의 번역본
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(
                                new Date(trans.updatedAt).toISOString()
                              ).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                useReportStore.setState({
                                  originContent: trans.content,
                                  reportedUser: trans.userId,
                                  commentId: null,
                                  articleId: null,
                                  transId: trans.transId,
                                  chatId: null,
                                });
                                openReport();
                                toggleReport();
                              }}
                              className="text-gray-500 cursor-pointer underline"
                            >
                              신고
                            </button>

                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(docsId, trans.transId);
                              }}
                              className={`flex w-fititems-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer right-5 top-1/2  ${
                                trans.likeUserIds.includes(Number(userId))
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={
                                  trans.likeUserIds.includes(Number(userId))
                                    ? "text-white"
                                    : "text-slate-700"
                                }
                              >
                                좋아요
                              </span>
                              <span
                                className={`font-semibold ${
                                  trans.likeUserIds.includes(Number(userId))
                                    ? "text-white"
                                    : "text-slate-900"
                                }`}
                              >
                                {trans.likeCount}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            transStates[trans.transId]
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="border-t border-slate-200 mt-4 pt-4 px-2 text-slate-700 leading-relaxed">
                            <ToastViewer content={trans.content} />
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Modal>
  );
};

export default TranslateArchive;
