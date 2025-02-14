import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import MemoList from "../components/MemoList";
import EditorModal from "../components/EditorModal";
import modalStore from "../../../store/myPageStore/myPageModalStore";
import useMemoStore from "../../../store/myPageStore/memoStore";
import memoService from "../services/memoService";
import ListPagination from "../../../components/pagination/listPagination";
import ConfirmModal from "../../../components/alertModal/confirmModal";
import useAlertStore from "../../../store/alertStore";
import _ from "lodash";

const MemoPage = () => {
  const token = localStorage.getItem("token");

  const { isOpen, openId, openModal, closeModal, setOpenId } = modalStore();
  const { isAlertOpen, toggleAlert } = useAlertStore();
  const { memos, setMemos, setIsLoading, setError, updateMemo, deleteMemo } =
    useMemoStore();
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentData, setCurrentData] = useState([]);
  const [memoToDelete, setMemoToDelete] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const pageSize = 15;

  useEffect(() => {
    const fetchMemos = async (userId) => {
      try {
        const data = await memoService.fetchMemos(userId);
        if (data) {
          setMemos(data.reverse());
          console.log("Fetched memos:", data);
        } else {
          setMemos([]);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching memos:", error);
      } finally {
        setHasFetched(true);
      }
    };

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      fetchMemos(userId);
    }
  }, [token, setMemos, setIsLoading, setError]);

  useEffect(() => {
    if (memos.length > 0) {
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, memos.length);
      const newTotalPages = Math.ceil(memos.length / pageSize);

      setTotalPages(newTotalPages);
      setCurrentData(memos.slice(startIndex, endIndex));
    } else {
      setTotalPages(0);
      setCurrentData([]);
    }
  }, [memos, currentPage, pageSize]);

  const handleCreateMemo = _.debounce(async (memoData) => {
    if (userId) {
      try {
        await memoService.createMemo(userId, memoData);
        const data = await memoService.fetchMemos(userId);
        if (data) {
          setMemos(data.reverse());
        } else {
          setMemos([]);
        }
        closeModal();
      } catch (error) {
        console.error("Error creating memo:", error);
      }
    }
  }, 300);

  const handleEditMemo = _.debounce(async (memoId, memoData) => {
    if (userId) {
      try {
        await memoService.updateMemo(userId, memoId, memoData);
        const data = await memoService.fetchMemos(userId);
        if (data) {
          setMemos(data.reverse());
        } else {
          setMemos([]);
        }
        closeModal();
      } catch (error) {
        console.error("Error updating memo:", error);
      }
    }
  }, 300);

  const handleDeleteMemo = _.debounce(async (memoId) => {
    setMemoToDelete(memoId);
    toggleAlert();
  }, 300);

  const confirmDeleteMemo = _.debounce(async () => {
    if (userId && memoToDelete) {
      try {
        await memoService.deleteMemo(userId, memoToDelete);
        deleteMemo(memoToDelete);
        console.log("Deleted memo with ID:", memoToDelete);
      } catch (error) {
        console.error("Error deleting memo:", error);
      } finally {
        setMemoToDelete(null);
        closeModal();
        toggleAlert();
      }
    }
  }, 300);

  const handleOpenModal = async (memoId) => {
    if (memoId) {
      try {
        const detailedMemo = await memoService.fetchMemo(userId, memoId);
        if (detailedMemo) {
          updateMemo(memoId, detailedMemo);
          console.log("Fetched detailed memo:", detailedMemo);
        }
      } catch (error) {
        console.error("Error fetching detailed memo:", error);
      }
    }
    setOpenId(memoId);
    openModal();
    console.log("Opening modal with memoId:", memoId);
  };

  return (
    <div>
      <div className="flex justify-between mt-5 mb-5">
        <h1 className="font-bold text-2xl">메모장</h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="border-box bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 text-[#ffffff] hover:bg-[#C96442]"
        >
          + 새메모
        </button>
      </div>
      <MemoList
        memos={currentData || []}
        onEditMemo={handleOpenModal}
        onDeleteMemo={handleDeleteMemo}
        hasFetched={hasFetched}
      />
      {totalPages > 0 && (
        <ListPagination
          totalPages={totalPages}
          currentPage={currentPage + 1}
          setCurrentPage={setCurrentPage}
        />
      )}
      <EditorModal
        title={openId ? "메모 수정" : "새 메모"}
        buttonText={openId ? "수정 완료" : "완료"}
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={openId ? handleEditMemo : handleCreateMemo}
        memoData={memos ? memos.find((memo) => memo.memoId === openId) : null}
        onDelete={openId ? handleDeleteMemo : null}
      />
      {isAlertOpen && (
        <ConfirmModal
          message="정말로 메모를 삭제하시겠습니까?"
          onConfirm={confirmDeleteMemo}
          onCancel={toggleAlert}
        />
      )}
    </div>
  );
};

export default MemoPage;
