import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { initDB, searchData } from "../services/indexedDbService"; // indexedDB 관련 함수들
import ToastViewer from "./toastViewer";
import { toast } from "react-toastify";

const SearchDB = ({ tableId }) => {
  const [db, setDb] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

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
    if (db && query.trim() !== "") {
      const result = await searchData(objectStoreName, searchField, query);
      if (result.length === 0) {
        console.log("검색 결과가 없습니다.");
        setResults([{ content: "검색 결과가 없습니다." }]);
      } else {
        console.log("검색 결과:", result);
        setResults(result);
      }
    }
  };

  const checkMaxLength = (e) => {
    if (e.target.value.length > 1500) {
      toast.warn("검색어 글자 수 제한을 초과했습니다.");
    }
  };

  return (
    <div className="fixed flex flex-col items-center p-4 max-w-md mx-auto z-[1100] top-1 left-[50vw] translate-x-[-50%] w-[45vw]">
      <input
        type="text"
        placeholder="검색어 입력 후 Enter"
        value={query}
        maxLength={1500}
        onChange={(e) => {
          setQuery(e.target.value);
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

      {results.length > 0 && (
        <ul className="mt-4 bg-white shadow-md rounded-lg p-2 max-h-[50vh] overflow-y-scroll w-[45vw]">
          <div>
            {results.map((item) => (
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
