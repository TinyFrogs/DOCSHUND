import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  initDB,
  addData,
  loadData,
  closeAllConnections,
} from "./services/indexedDbService.jsx";
import userProfileService from "../myPage/services/userProfileService.jsx";
import {
  fetchTranslateData,
  fetchBestTranslate,
} from "./services/translateGetService.jsx";
import useMemoService from "../myPage/services/memoService.jsx";

// 컴포넌트 import
import TranslateEditor from "./translateEditor.jsx";
import TranslateArchive from "./translateArchive.jsx";
import ToastViewer from "./components/toastViewer.jsx";
import SearchDB from "./components/searchDB.jsx";

//우클릭 커스타마이즈
import "react-contexify/dist/ReactContexify.css";

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";

// 상태 import
import useModalStore from "../../store/translateStore/translateModalStore.jsx";
import useEditorStore from "../../store/translateStore/editorStore.jsx";
import useDocsStore from "../../store/translateStore/docsStore.jsx";
import useArchiveStore from "../../store/translateStore/archiveStore.jsx";
import MemoStore from "../../store/../store/myPageStore/memoStore.jsx";
// import useProgressStore from "../../store/translateStore/progressStore.jsx";

// 이미지 import
import loadingGif from "../../assets/loading.gif";
import { Trophy } from "lucide-react";
import { createPortal } from "react-dom";

const TranslateViewer = () => {
  let userId = 0;
  const location = useLocation();
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    const token = localStorage.getItem("token");
    userId = jwtDecode(token).userId;
  }

  const { docsId } = useParams();
  const [docParts, setDocParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);
  // 각 문단 별 상태 저장 및 추적

  const [docpartStates, setDocpartStates] = useState({});
  const [heightStates, setHeightStates] = useState({});
  // 마우스 위치 저장 (컨텍스트 메뉴 위치 조정용)
  const [checkComplete, setCheckComplete] = useState(false);
  const docData = useRef([]);
  const loadingRef = useRef(null);
  const chunk_size = 100;
  // 문단 높이 조절을 위한 초기 높이 저장 ref
  const initialHeights = useRef({});
  //우클릭메뉴 커스텀을 위한 상태
  const [contextMenuPorder, setContextMenuPorder] = useState(0);

  // indexedDB 관련 변수
  const dbName = "docs";
  const objectStoreName = docsId;
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  // 번역 관련 상태
  const { transList, setTransList, transUserList } = useArchiveStore();
  const {
    bestTrans,
    setBestTrans,
    setDocsId,
    setOriginId,
    setDocsPart,
    setPorder,
    clearCurrentUserText,
    clearDocsPart,
    clearBestTrans,
    clearTempSave,
    clearSubmitData,
  } = useEditorStore();
  const { documentName } = useDocsStore();
  // 모달 관련 상태
  const { openEditor, openArchive, closeEditor, closeArchive } =
    useModalStore();
  // const {
  //   currentProgress,
  //   totalData,
  //   setTotalData,
  //   clearTotalData,
  //   setCurrentProgress,
  //   resetCurrentProgress,
  // } = useProgressStore();

  // 우클릭 또는 버튼 클릭 시 UI 상태 토글

  const generateUserList = async (translateList) => {
    translateList.forEach(async (trans) => {
      const user = await userProfileService.fetchProfile(trans.userId);
      transUserList[trans.userId] = user.nickname;
    });
  };

  const toggleDocpart = (partId) => {
    setDocpartStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (key !== partId) {
          acc[key] = false;
        }
        return acc;
      }, {}),
      [partId]: !prev[partId],
    }));
  };

  // 문서 내용을 청크 단위로 불러오기
  const loadMore = async () => {
    if (loading || !hasMore) {
      return;
    }
    try {
      setLoading(true);
      // 인위적인 지연 추가 (개발용)
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = docData.current;
      if (!data || data.length === 0) {
        toast.error("원문 데이터가 없습니다.");
        return;
      }
      const newChunk = data.slice(processedCount, processedCount + chunk_size);
      if (!newChunk || newChunk.length === 0) {
        setHasMore(false);
        // setCurrentProgress(100);
        return;
      }
      // element.content가 null 또는 undefined일 경우 ""로 대체
      const processedChunk = newChunk.map((element) => ({
        ...element,
        content: element.content || "",
      }));
      setDocParts((prev) => [...prev, ...processedChunk]);
      setProcessedCount((prev) => prev + chunk_size);
      // setCurrentProgress((processedCount / totalData) * 100);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // 주송 이동 예외 처리
  const handleClose = () => {
    clearDocsPart();
    clearBestTrans();
    clearTempSave();
    clearSubmitData();
    clearCurrentUserText();
  };

  useEffect(() => {
    closeEditor();
    closeArchive();
    handleClose();
  }, [location]);

  useEffect(() => {
    let isMounted = true; // 마운트 여부 추적
    closeAllConnections();
    // 상태 초기화
    setDocParts([]);
    setProcessedCount(0);
    setHasMore(true);
    setCheckComplete(false);
    setIsDbInitialized(false);
    MemoStore.setState({ memos: useMemoService.fetchMemos(userId) });
    docData.current = [];

    async function checkDB() {
      if (!isMounted) return;
      setLoading(true);

      try {
        await initDB(dbName, objectStoreName);
        const loadedData = await loadData(objectStoreName);
        // setTotalData(loadedData.length);

        if (!isMounted) return;

        if (!loadedData || loadedData.length === 0) {
          toast.info("서버와 연결되었습니다.");
          try {
            const data = await fetchTranslateData(docsId, "");
            if (data.length === 0) {
              toast.info("문서 원본을 추가 중입니다.");
              navigate(-1);
              return;
            }
            if (!isMounted) return;
            if (data && Array.isArray(data)) {
              docData.current = data;
              await addData(data, objectStoreName);
              toast.success("원문 데이터가 준비되었습니다.");
              if (isMounted) {
                setIsDbInitialized(true);
                await loadMore();
                setCheckComplete(true);
              }
            } else {
              throw new Error("Invalid data format received from server");
            }
          } catch (error) {
            console.error("Failed to fetch data from server:", error);
          }
        } else {
          toast.success("원문 데이터가 준비되었습니다.");
          if (isMounted) {
            docData.current = loadedData;
            setIsDbInitialized(true);
            await loadMore();
            setCheckComplete(true);
          }
        }
      } catch (error) {
        // console.log("Error in checkDB:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkDB();

    return () => {
      isMounted = false;
    };
  }, [docsId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && checkComplete) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    return () => observer.disconnect();
  }, [hasMore, loading, processedCount]);

  const { show } = useContextMenu({
    id: "translate-menu",
  });

  // 우클릭 시 컨텍스트 메뉴 실행
  const handleContextMenu = (e, part) => {
    e.preventDefault();
    show({ event: e, props: { part } });
  };

  // 메뉴 항목: 번역하기
  const handleTranslate = async ({ props }) => {
    const { part } = props;
    useEditorStore.setState({
      docsPart: part.content,
      porder: part.pOrder,
      docsId: part.docsId,
      originId: part.originId,
    });

    await openEditor();
    toggleEditor();
  };

  // 메뉴 항목: 번역 기록
  const handleArchive = async ({ props }) => {
    const { part } = props;
    const tmpTransList = await fetchBestTranslate(part.docsId, "");
    setTransList(tmpTransList);
    setDocsPart(part.content);
    setDocsId(part.docsId);
    setOriginId(part.originId);
    setPorder(part.pOrder);
    // await fetchBestTranslate(part.docsId, "");
    // await generateUserList(transList);
    await openArchive();
  };

  return (
    <div
      id="mainContent"
      className="h-screen min-w-[90vw] md:min-w-[65vw] lg:min-w-[60vw] bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-x-auto overflow-y-scroll p-6 flex flex-col z-[1000] max-w-screen-xl mx-auto shadow-xl"
    >
      {createPortal(<SearchDB tableId={docsId} />, document.body)}
      <div className="flex flex-col gap-2">
        {docParts.map((part, index) => (
          <div
            key={index}
            onContextMenu={async (e) => {
              if (!localStorage.getItem("token")) {
                e.preventDefault();
                return;
              }
              setContextMenuPorder(part.pOrder);
              handleContextMenu(e, part);
              const tmpTransList = await fetchBestTranslate(
                part.docsId,
                "best"
              );
              setTransList(tmpTransList);
              await generateUserList(tmpTransList);
              if (tmpTransList !== undefined) {
                const filteredTranslations = tmpTransList.filter(
                  (item) => item.originId === part.originId
                );
                if (filteredTranslations.length > 0) {
                  setBestTrans(filteredTranslations[0].content);
                } else {
                  setBestTrans("");
                }
              } else {
                setBestTrans("");
              }
            }}
            className="paragraph flex flex-row gap-4 w-full"
          >
            <div
              onClick={async (e) => {
                e.stopPropagation();
                const tmpTransList = await fetchBestTranslate(
                  part.docsId,
                  "best"
                );
                setTransList(tmpTransList);

                if (tmpTransList !== undefined) {
                  const filteredTranslations = tmpTransList.filter(
                    (item) => item.originId === part.originId
                  );
                  if (filteredTranslations.length > 0) {
                    setBestTrans(filteredTranslations[0].content);
                  } else {
                    setBestTrans("");
                    toast.info("아직 등록된 변역이 없습니다.");
                  }
                } else {
                  setBestTrans("");
                }
                setTimeout(() => {
                  toggleDocpart(part.id);
                }, 50);
              }}
              className="flex flex-col w-full h-fit rounded-md p-2 text-[#424242] hover:shadow-[0px_0px_15px_0px_rgba(149,_157,_165,_0.3)] hover:border-gray-200 cursor-pointer transition-all duration-250 ease-in-out"
            >
              <div
              // ref={(element) => {
              //   if (element && !initialHeights.current[part.id]) {
              //     // ToastViewer 렌더 후 높이 측정
              //     setTimeout(() => {
              //       const height = element.offsetHeight;
              //       initialHeights.current[part.id] = height + "px";
              //       setHeightStates((prev) => ({
              //         ...prev,
              //         [part.id]: initialHeights.current[part.id],
              //       }));
              //     }, 50);
              //   }
              // }}
              >
                {!docpartStates[part.id] ? (
                  <ToastViewer content={part.content} />
                ) : (
                  <div className="flex flex-col">
                    {bestTrans !== "" && (
                      <div className="flex justify-end">
                        <p className="font-extrabold mr-2">BEST</p>
                        <Trophy className="w-6 h-6 text-yellow-500" />
                      </div>
                    )}
                    {bestTrans === "" ? (
                      <ToastViewer content={part.content} />
                    ) : (
                      <ToastViewer
                        content={`<span style="background-color: #fbebd2">${bestTrans}</span>`}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loadingRef} className="py-6 text-center">
        {loading && (
          <div className="flex justify-center items-center" role="status">
            <img
              className="w-[250px] h-[250px]"
              src={loadingGif}
              alt="로딩 애니메이션"
            />
          </div>
        )}
        {!hasMore && (
          <div className="text-gray-600 font-medium">
            모든 문서를 불러왔습니다.
          </div>
        )}
      </div>
      {createPortal(<TranslateEditor />, document.body)}
      {createPortal(<TranslateArchive />, document.body)}

      {/* Menu를 Portal로 document.body에 렌더링하고 z-index를 높게 지정 */}
      {createPortal(
        <Menu
          id="translate-menu"
          theme="none"
          animation="scale"
          style={{ zIndex: 1900 }}
        >
          <Item disabled>{contextMenuPorder}번째 문단</Item>
          <Separator />
          <Item className="hover:bg-gray-100!" onClick={handleTranslate}>
            번역하기
          </Item>
          <Item onClick={handleArchive}>번역 기록</Item>
        </Menu>,
        document.body
      )}
    </div>
  );
};

export default TranslateViewer;
