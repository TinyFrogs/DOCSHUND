import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  initDB,
  addData,
  loadData,
  closeAllConnections,
} from "./services/indexedDbService.jsx";
import {
  fetchTranslateData,
  fetchBestTranslate,
} from "./services/translateGetService.jsx";
// 컴포넌트 import
import TranslateEditor from "./translateEditor.jsx";
import TranslateArchive from "./translateArchive.jsx";
import ToastViewer from "./components/toastViewer.jsx";

//이미지 import
import loadingGif from "../../assets/loading.gif";
import { Trophy } from "lucide-react";
import { Languages } from "lucide-react";
import English from "../../assets/icon/english.png";

const BestTransViewer = () => {
  const navigate = useNavigate();
  const { docsId } = useParams();
  const [docParts, setDocParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);
  //각 문단 별 상태 저장 및 추적
  const tmpTransList = useRef([]);
  const tmpBestTransList = useRef([]);
  //
  const [checkComplete, setCheckComplete] = useState(false);
  const docData = useRef([]);
  const loadingRef = useRef(null);
  const chunk_size = 20;

  //번역 전체보기 관련

  //indexedDB 관련 변수
  const dbName = "docs";
  const objectStoreName = docsId;
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  // 문서 내용 전부 가져오기
  const loadMore = async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      // 인위적인 지연 추가 (개발용)
      await new Promise((resolve) => setTimeout(resolve, 600));
      const data = docData.current;
      if (!data || data.length === 0) {
        console.log("오류 발생 : 데이터 없음");
        return;
      }
      const newChunk = data.slice(processedCount, processedCount + chunk_size);
      if (!newChunk || newChunk.length === 0) {
        setHasMore(false);
        return;
      }
      //element.content가 null이나 undefined일 경우 ""로 대체 ==> React의 불변성 패턴
      const processedChunk = newChunk.map((element) => ({
        ...element,
        content: element.content || "",
      }));
      //전개 연산자 사용 : 두 객체들을 쉽게 합칠 수 있음.
      setDocParts((prev) => [...prev, ...processedChunk]);
      setProcessedCount((prev) => prev + chunk_size);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // 컴포넌트 마운트 상태 추적
    closeAllConnections();
    // 상태 초기화
    setDocParts([]);
    setProcessedCount(0);
    setHasMore(true);
    setCheckComplete(false);
    setIsDbInitialized(false); // 여기로 이동
    docData.current = [];

    const fetchData = async () => {
      const data = await fetchBestTranslate(docsId, "best");
      tmpTransList.current = data;
      console.log("tmpTransList.current", tmpTransList.current);
      tmpTransList.current.forEach((element) => {
        tmpBestTransList.current[element.originId] = {
          element,
          key: element.originId,
        };
      });
      console.log(
        "번역 전체 보기 데이터를 불러왔습니다.: ",
        tmpBestTransList.current
      );
    };

    // const processFetchedData = async () => {

    // };

    async function checkDB() {
      if (!isMounted) return; // 컴포넌트가 언마운트되었습니다면 중단
      setLoading(true);

      try {
        console.log("Initializing DB for docsId:", docsId); // 디버깅용
        await initDB(dbName, objectStoreName);
        const loadedData = await loadData(objectStoreName);
        console.log("Loaded data from DB:", loadedData.length); // 디버깅용

        if (!isMounted) return; // 비동기 작업 후 마운트 상태 다시 확인

        if (!loadedData || loadedData.length === 0) {
          console.log("Fetching data from server for docsId:", docsId); // 디버깅용
          try {
            const data = await fetchTranslateData(docsId, false);
            if (!isMounted) return;
            if (data && Array.isArray(data)) {
              docData.current = data;
              await addData(data, objectStoreName);
              console.log("Server data saved, length:", data.length); // 디버깅용
              if (isMounted) {
                setIsDbInitialized(true);
                await loadMore(); // 여기서 바로 loadMore 실행
                setCheckComplete(true);
              }
            } else {
              throw new Error("Invalid data format received from server");
            }
          } catch (error) {
            console.error("Failed to fetch data from server:", error);
          }
        } else {
          console.log("Using cached data from IndexedDB"); // 디버깅용
          if (isMounted) {
            docData.current = loadedData;
            setIsDbInitialized(true);
            await loadMore(); // 여기서도 바로 loadMore 실행
            setCheckComplete(true);
          }
        }
      } catch (error) {
        console.log("Error in checkDB:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    checkDB();
    fetchData();
    // 클린업 함수
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

  // Race Condition Prevention Pattern : useEffect에서 함수가 동시 실행되는 것을 방지

  return (
    <div className="h-[99%] min-w-[800px] bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-x-auto overflow-y-scroll p-6 flex flex-col z-[1000] max-w-screen-xl mx-auto shadow-xl">
      <div className="flex flex-col gap-2">
        {docParts.map((part, index) => (
          <div key={index} className="paragraph flex flex-row gap-4 relative">
            <div className="flex flex-col w-full p-1 rounded-sm text-[#424242]">
              <div className="flex justify-between">
                {tmpBestTransList.current[part.id] ? (
                  <ToastViewer
                    content={tmpBestTransList.current[part.id].element.content}
                  />
                ) : (
                  <ToastViewer content={""} />
                )}

                {/* {tmpBestTransList.current[part.id] && (
                  <Trophy className="w-6 h-6 shrink-0 m-2 text-yellow-500" />
                )} */}
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
      <TranslateEditor className="z-auto" />
      <TranslateArchive className="z-auto" />
    </div>
  );
};

export default BestTransViewer;
