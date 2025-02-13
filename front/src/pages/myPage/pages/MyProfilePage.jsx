import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import authService from "../../../services/authService";
import useUserProfileStore from "../../../store/myPageStore/userProfileStore";
import userProfileService from "../services/userProfileService";
import ProfileCard from "./ProfileCard";
import SettingsCard from "./SettingsCard";
import ConfirmModal from "../../../components/alertModal/confirmModal";
import useAlertStore from "../../../store/alertStore";

const MyProfilePage = () => {
  const { profile, error, fetchProfile, updateProfile, deleteAccount } =
    useUserProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    nickname: "",
    hobby: "",
    introduce: "",
    profileImage: "",
    email: "",
    isDarkmode: false,
    ...profile,
  });
  const [userId, setUserId] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { logout } = authService();
  const { isAlertOpen, toggleAlert } = useAlertStore();

  // 1. 토큰 디코딩 및 userId 설정
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  // 2. userId가 설정되거나 편집 모드가 종료될 때 프로필 호출
  useEffect(() => {
    if (userId && !isEditing) {
      fetchProfile(userId);
    }
  }, [userId, isEditing, fetchProfile]);

  // 3. 프로필 변경 시 편집 중이 아닐 때만 로컬 상태 업데이트
  useEffect(() => {
    if (profile && !isEditing && !editedProfile.nickname) {
      setEditedProfile({ ...profile });
      console.log("원본 카피완료", profile);
    }
  }, [profile, isEditing]);

  // 4. 에러 발생 시 토스트 표시
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  // 편집 모드 시작 / 취소
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setProfileImageFile(null);
  };

  // 닉네임 중복 체크
  const checkNickname = async (showSuccessToast = true) => {
    if (!editedProfile.nickname) {
      toast.warn("닉네임을 입력해주세요.");
      return false;
    }
    try {
      const isAvailable = await userProfileService.checkNickname(
        editedProfile.nickname,
        profile.nickname
      );
      if (isAvailable) {
        if (showSuccessToast) {
          toast.success("사용 가능한 닉네임입니다.");
        }
        return true;
      } else {
        toast.error("사용할 수 없는 닉네임입니다.");
        return false;
      }
    } catch (error) {
      console.log("닉네임 중복 체크 중 오류 발생:", error);
      return false;
    }
  };

  // 편집 모드 저장
  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (
      !editedProfile.nickname ||
      !editedProfile.hobby ||
      !editedProfile.introduce ||
      !editedProfile.email
    ) {
      toast.warn("모든 필드를 입력해주세요.");
      return;
    }

    const isUnique = await checkNickname(false);
    if (!isUnique) return;

    const formData = new FormData();
    formData.append(
      "profile",
      new Blob([JSON.stringify(editedProfile)], { type: "application/json" })
    );
    if (profileImageFile) {
      formData.append("file", profileImageFile);
    }

    try {
      await updateProfile(userId, formData);
      toast.success("프로필이 성공적으로 업데이트되었습니다.");
      setIsEditing(false);
    } catch (error) {
      toast.error("프로필 업데이트 중 오류가 발생했습니다.");
      console.error("프로필 업데이트 실패", error);
    }
  };

  // 이미지 변경 처리 (최대 1MB)
  const MAX_FILE_SIZE = 1 * 1024 * 1024;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.warn("이미지 파일 크기는 1MB 이하만 가능합니다.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedProfile((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
      setProfileImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  // 계정 탈퇴 처리
  const handleDeleteAccount = async () => {
    toggleAlert();
  };

  const confirmDeleteAccount = async () => {
    try {
      const success = await deleteAccount(userId);
      if (success) {
        toast.success("계정이 성공적으로 탈퇴되었습니다.");
        toggleAlert();
        logout();
      } else {
        toast.error("계정 탈퇴 중 오류가 발생했습니다.");
        toggleAlert();
      }
    } catch (error) {
      toast.error("계정 탈퇴 중 오류가 발생했습니다.");
      console.error("계정 탈퇴 실패", error);
      toggleAlert();
    }
  };

  // 입력 값 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  // 환경설정 (테마) 변경 처리
  const handleThemeChange = (e) => {
    const { value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      isDarkmode: value === "dark",
    }));
  };

  return (
    <div>
      <div className="flex justify-between mt-4 mb-5">
        <h1 className="font-bold text-2xl">내 프로필</h1>
        {!isEditing ? (
          <button
            className="bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 relative flex items-center justify-center text-white hover:bg-[#C96442]"
            onClick={handleEditClick}
          >
            편집
          </button>
        ) : (
          <div className="flex space-x-5">
            <button
              className="border-box rounded-[12px] px-[20px] w-fit h-10 hover:text-[#ffffff] hover:bg-[#bc5b39]"
              onClick={handleCancelClick}
            >
              취소
            </button>
            <button
              className="border-box bg-[#bc5b39] rounded-[12px] px-[20px] w-fit h-10 text-[#ffffff] hover:bg-[#C96442]"
              onClick={handleSaveClick}
            >
              저장
            </button>
          </div>
        )}
      </div>

      <ProfileCard
        isEditing={isEditing}
        editedProfile={editedProfile}
        handleChange={handleChange}
        handleImageChange={handleImageChange}
        handleNicknameCheck={checkNickname}
      />

      <h1 className="font-bold text-2xl mt-5 mb-5">환경설정</h1>
      <SettingsCard
        isEditing={isEditing}
        editedProfile={editedProfile}
        handleThemeChange={handleThemeChange}
      />

      <div className="mt-5 mr-2 flex justify-end">
        <button
          className="flex items-center text-gray-500 hover:text-red-600 hover:underline"
          onClick={handleDeleteAccount}
        >
          <p className="text-bold">계정탈퇴</p>
          <ChevronRight />
        </button>
      </div>
      {isAlertOpen && (
        <ConfirmModal
          message="정말로 계정을 탈퇴하시겠습니까?"
          onConfirm={confirmDeleteAccount}
          onCancel={toggleAlert}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
