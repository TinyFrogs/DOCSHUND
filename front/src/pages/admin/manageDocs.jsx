import { useState, useEffect } from "react";
import { fetchDocsList } from "../translate/hooks/translateGetService";
import {
  registDocument,
  registDocumentContent,
} from "./Hooks/adminPostService";
import RegistDocs from "./components/registDocs";
import RegistDocsContent from "./components/registDocsContent";
import useModalStore from "../../store/modalStore";

const ManageDocs = () => {
  const [currentDocsId, setCurrentDocsId] = useState(null);

  const [adminDocsList, setAdminDocsList] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  //등록 관련 모달 상태관리
  const [openRegistDocs, setOpenRegistDocs] = useState(false);
  const [openRegistDocsContent, setOpenRegistDocsContent] = useState(false);

  useEffect(() => {
    const fetchAdminDocs = async () => {
      try {
        const response = await fetchDocsList();
        setAdminDocsList(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdminDocs();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocs(adminDocsList.map((doc) => doc.docsId));
    } else {
      setSelectedDocs([]);
    }
  };

  const handleSelectDoc = (docId) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleUpload = async (e, docsId) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file);
      await registDocumentContent(docsId, formData);
      alert("문서가 성공적으로 업로드되었습니다.");
    } catch (error) {
      console.error("문서 업로드 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <RegistDocs
        open={openRegistDocs}
        onClose={() => setOpenRegistDocs(false)}
      />
      <RegistDocsContent
        docsId={currentDocsId}
        open={openRegistDocsContent}
        onClose={() => setOpenRegistDocsContent(false)}
      />
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">문서관리</h1>
        {/* <h2>* 삭제하실 문서를 선택 후 삭제 버튼을 눌러주세요.</h2> */}
        <div className="flex gap-2">
          {/* <button className="cursor-pointer px-2 py-2 bg-[#ff2121] text-white rounded-lg hover:bg-[#a34e31] transition-colors duration-200">
            - 문서삭제
          </button> */}
          <button
            onClick={() => setOpenRegistDocs(true)}
            className="cursor-pointer px-2 py-2 bg-[#bc5b39] text-white rounded-lg hover:bg-[#a34e31] transition-colors duration-200"
          >
            + 문서생성
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#bc5b39] border-gray-300 rounded cursor-pointer"
                    checked={selectedDocs.length === adminDocsList.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  문서명
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  버전
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  라이선스명
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  문서등록일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  조회수
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  좋아요수
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  업로드
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {adminDocsList.map((adminDocs, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#bc5b39] border-gray-300 rounded cursor-pointer"
                      checked={selectedDocs.includes(adminDocs.docsId)}
                      onChange={() => handleSelectDoc(adminDocs.docsId)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminDocs.documentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminDocs.documentVersion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {adminDocs.license}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(
                      new Date(adminDocs.createdAt).toISOString()
                    ).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adminDocs.viewCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adminDocs.likeCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <label className="cursor-pointer px-2 py-2 rounded-lg bg-[#bc5b39] text-white hover:bg-[#a34e31] transition-colors duration-200">
                      <input
                        type="file"
                        onChange={(e) => handleUpload(e, adminDocs.docsId)}
                        className="hidden"
                      />
                      원본업로드
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDocs;
