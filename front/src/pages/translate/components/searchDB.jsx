import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { initDB, searchData } from "../services/indexedDbService"; // indexedDB 관련 함수들
import ToastViewer from "./toastViewer";
import { toast } from "react-toastify";
import { Button, Spinner } from "flowbite-react";
import useDocsStore from "../../../store/translateStore/docsStore";
import Loading from "../../../assets/loading.gif";

const SearchDB = ({ tableId }) => {
  const [loading, setLoading] = useState(false);
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("");
  const { searchResults, setSearchResults } = useDocsStore();

  const dbName = "docs";
  const objectStoreName = tableId;
  const searchField = "content"; // 검색할 필드 지정

  // DB 초기화
  useEffect(() => {
    initDB(dbName, objectStoreName)
      .then((database) => setDb(database))
      .catch((error) => console.error("DB 초기화 오류:", error));
  }, []);

  // 검색 실행
  const handleSearch = async () => {
    setLoading(true);
    if (db && query.trim() !== "") {
      setSearchResults([]);
      const result = await searchData(objectStoreName, searchField, query);
      if (result.length === 0) {
        setLoading(false);
        console.log("검색 결과가 없습니다.");
        setSearchResults([{ content: "검색 결과가 없습니다." }]);
      } else {
        setSearchResults(result);
        setLoading(false);
      }
    }
  };

  const checkMaxLength = (e) => {
    if (e.target.value.length === 500) {
      toast.warn("검색어 글자 수 500자를 초과했습니다.");
    }
  };

  return (
    <div className="fixed flex flex-col items-center p-4 max-w-md mx-auto z-[1100] top-1 left-[60vw] sm:left-[50vw] translate-x-[-50%] w-[45vw]">
      {loading && (
        <Button className="absolute top-4 right-3" color="warn">
          <Spinner
            aria-label="Spinner button example"
            size="sm"
            color="success"
          />
          <span className="pl-3">검색 중...</span>
        </Button>
      )}
      <input
        type="text"
        placeholder="검색어 입력 후 Enter"
        value={query}
        maxLength={500}
        onChange={(e) => {
          setQuery(e.target.value);
          checkMaxLength(e);
          checkMaxLength(e);
          if (e.target.value === "") {
            setResults([]);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); //
            handleSearch();
          }
        }}
        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C96442] bg-[#FAF9F5] break-words"
      />

      {searchResults.length > 0 && (
        <ul className="mt-4 bg-white shadow-md rounded-lg p-2 max-h-[50vh] overflow-y-scroll overflow-x-hidden w-[45vw]">
          <div>
            {searchResults.map((item) => (
              <li
                key={item.id}
                className="p-2 border-b last:border-none flex bg-[#FAF9F5]"
              >
                <ToastViewer content={item[searchField]} />
              </li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

SearchDB.propTypes = {
  tableId: PropTypes.string.isRequired,
};

export default SearchDB;
