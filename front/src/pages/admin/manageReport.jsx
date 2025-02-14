import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchReportList,
  fetchUserList,
} from "../admin/services/adminGetService";
import { withdrawReport } from "../admin/services/adminPostService";
import { MoveRight, Download } from "lucide-react";
import useUserManagerStore from "../../store/adminStore/userManagerStore";
import ToastViewer from "../../pages/translate/components/toastViewer";
import { toast } from "react-toastify";
import _ from "lodash";

const ManageReport = () => {
  const reportListData = useRef([]);
  const [reportStates, setReportStates] = useState({});
  const [userList, setUserList] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const { currentUserList, addUserList, removeUserList } =
    useUserManagerStore();

  const handleFilter = async (category) => {
    if (category === "all") {
      setReportList(reportListData.current);
    } else if (category === "transId") {
      const tmpReportList = reportListData.current.filter(
        (report) => report.transId !== null
      );
      setReportList(tmpReportList);
    } else if (category === "articleId") {
      const tmpReportList = reportListData.current.filter(
        (report) => report.articleId !== null
      );
      setReportList(tmpReportList);
    } else if (category === "commentId") {
      const tmpReportList = reportListData.current.filter(
        (report) => report.commentId !== null
      );
      setReportList(tmpReportList);
    } else if (category === "chatId") {
      const tmpReportList = reportListData.current.filter(
        (report) => report.chatId !== null
      );
      setReportList(tmpReportList);
    }
  };

  const handleReportStatus = useCallback(
    _.debounce(async (reportId) => {
      const response = await withdrawReport(reportId);
      if (response === 200) {
        toast.success("신고 철회 완료");
      } else {
        toast.error("공개 처리 실패");
      }
      const data = await fetchReportList();
      setReportList(data);
    }, 500),
    []
  );

  const processUserList = (userListContent) => {
    userListContent.forEach((user) => {
      currentUserList[user.userId] = user.nickname;
    });
  };

  const toggleReportContent = (reportId) => {
    setReportStates((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        if (key !== reportId) {
          acc[key] = false;
        }
        return acc;
      }, {}),
      [reportId]: !prev[reportId],
    }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchUserList();
        data.sort((a, b) => b.reportCount - a.reportCount);
        setUserList(data);
        processUserList(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchData = async () => {
      const data = await fetchReportList();
      reportListData.current = data;
      setReportList(data);
    };

    fetchUsers();
    fetchData();
  }, []);

  const filterButtons = [
    { label: "전체", value: "all" },
    { label: "번역본", value: "transId" },
    { label: "게시글", value: "articleId" },
    { label: "댓글", value: "commentId" },
    { label: "채팅", value: "chatId" },
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">신고 관리</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="이메일로 검색"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#bc5b39] focus:ring-1 focus:ring-[#bc5b39] transition-colors duration-200"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-start space-x-2 mb-4">
        {filterButtons.map((button) => (
          <button
            key={button.value}
            onClick={() => {
              handleFilter(button.value);
              setActiveFilter(button.value);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer duration-200 ${
              activeFilter === button.value
                ? "bg-[#bc5b39] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="flex gap-1 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div>신고한 유저</div>
                  <MoveRight /> <div>신고된 유저</div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  신고일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  첨부파일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportList.map((report) => (
                <>
                  <tr
                    key={report.reportId}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(report.content);
                      toggleReportContent(report.reportId);
                    }}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.category}
                    </td>
                    <td className="flex gap-1 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentUserList[report.userId]} <MoveRight />{" "}
                      {currentUserList[report.reportedUser]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(
                        new Date(report.createdAt).toISOString()
                      ).toLocaleString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap w-28 flex items-center gap-2">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(report.reportId);
                          handleReportStatus(report.reportId);
                        }}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          report.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status === "active" ? "공개" : "철회"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-[#bc5b39] hover:text-[#a34b2b] transition-colors duration-150 cursor-pointer">
                        <a
                          onClick={(e) => e.stopPropagation()}
                          download={report.reportFile}
                        >
                          <Download />
                        </a>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="7" className="p-0">
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          reportStates[report.reportId]
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-slate-200 p-4 text-slate-700 leading-relaxed">
                          <div className="mb-4">
                            <div className="font-medium text-slate-900 mb-2">
                              원본 내용
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <ToastViewer content={report.originContent} />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 mb-2">
                              신고 내용
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <ToastViewer content={report.content} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageReport;
