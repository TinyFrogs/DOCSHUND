import React, { useState } from "react";

const ManageNotification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "공지사항1",
      content: "내용1",
      createdAt: "2024-02-09",
      updatedAt: "2024-02-10",
    },
    {
      id: 2,
      title: "공지사항2",
      content: "내용2",
      createdAt: "2024-02-08",
      updatedAt: "2024-02-09",
    },
    // ...existing notifications...
  ]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    content: "",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAddNotification = () => {
    setIsEditorOpen(true);
    setIsEditing(false);
    setNewNotification({
      title: "",
      content: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleSaveNotification = () => {
    if (isEditing) {
      setNotifications(
        notifications.map((notification) =>
          notification.id === editId
            ? {
                ...notification,
                ...newNotification,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : notification
        )
      );
    } else {
      setNotifications([
        ...notifications,
        { ...newNotification, id: Date.now() },
      ]);
    }
    setIsEditorOpen(false);
    setNewNotification({
      title: "",
      content: "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    });
  };

  const handleEditNotification = (id) => {
    const notificationToEdit = notifications.find(
      (notification) => notification.id === id
    );
    setNewNotification(notificationToEdit);
    setIsEditorOpen(true);
    setIsEditing(true);
    setEditId(id);
  };

  const handleDeleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">공지사항 관리</h1>
        <button
          onClick={handleAddNotification}
          className="bg-[#bc5b39] text-white px-4 py-2 rounded-lg hover:bg-[#a34b2b] transition-colors duration-200"
        >
          + 공지사항 등록
        </button>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl z-50">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "공지사항 수정" : "공지사항 등록"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    title: e.target.value,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                내용
              </label>
              <textarea
                value={newNotification.content}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    content: e.target.value,
                  })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39] sm:text-sm"
                style={{ height: "250px" }}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                취소
              </button>
              <button
                onClick={handleSaveNotification}
                className="bg-[#bc5b39] text-white px-4 py-2 rounded-lg hover:bg-[#a34b2b] transition-colors duration-200"
              >
                저장
              </button>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsEditorOpen(false)}
          ></div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  게시일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  수정일
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <tr
                  key={notification.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notification.updatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditNotification(notification.id)}
                      className="text-[#bc5b39] hover:text-[#a34b2b] transition-colors duration-150"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700 transition-colors duration-150"
                    >
                      삭제
                    </button>
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

export default ManageNotification;
