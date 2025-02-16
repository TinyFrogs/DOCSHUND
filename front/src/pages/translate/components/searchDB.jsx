import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { initDB, searchData } from "../services/indexedDbService"; // indexedDB 관련 함수들
import ToastViewer from "./toastViewer";
import { Search } from "lucide-react";

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
      setResults(result);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="fixed p-4 max-w-md mx-auto z-[1100] top-0 left-[50vw] translate-x-[-50%] w-[80vw]">
      <input
        type="text"
        placeholder="검색어를 입력해주세요."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); //
            handleSearch();
          }
        }}
        className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C96442] bg-[#FAF9F5]"
      />

      {results.length > 0 && (
        <ul className="mt-4 bg-white shadow-md rounded-lg p-2 max-h-[50vh] overflow-y-scroll">
          {results.map((item) => (
            <li
              key={item.id}
              className="p-2 border-b last:border-none flex bg-[#FAF9F5]"
            >
              <ToastViewer content={item[searchField]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SearchDB.propTypes = {
  tableId: PropTypes.string.isRequired,
};

export default SearchDB;
