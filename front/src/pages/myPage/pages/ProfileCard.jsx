import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProfileCard = ({
  isEditing,
  editedProfile,
  handleChange,
  handleImageChange,
  handleNicknameCheck,
}) => {
  // editedProfile가 props로 전달되므로 profile 변수에 할당
  const profile = editedProfile || {};
  const MAX_NICKNAME_LENGTH = 10;
  const MAX_INTRODUCE_LENGTH = 200;

  // 이미지 미리보기를 위한 state: 부모의 editedProfile.profileImage가 바뀌면 갱신됨
  const [previewImage, setPreviewImage] = useState(profile.profileImage);
  const [nickname, setNickname] = useState(profile.nickname || "");

  useEffect(() => {
    setPreviewImage(profile.profileImage);
  }, [profile.profileImage]);

  useEffect(() => {
    setNickname(profile.nickname || "");
  }, [profile.nickname]);

  // 닉네임 입력 시 최대 글자 수 체크 후 부모의 handleChange 호출
  const handleNicknameInputChange = (e) => {
    const { value } = e.target;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
    if (
      value.length <= MAX_NICKNAME_LENGTH &&
      !/\s/.test(value) && // 공백 불가
      !emojiRegex.test(value) // 이모지 불가
    ) {
      setNickname(value);
      if (handleChange) handleChange(e);
    }
  };

  // 자기소개 입력 시 최대 글자 수 체크 후 부모의 handleChange 호출
  const handleIntroduceInputChange = (e) => {
    const { value } = e.target;
    if (value.length <= MAX_INTRODUCE_LENGTH) {
      if (handleChange) handleChange(e);
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      handleImageChange(e);
    }
  };

  return (
    <div className="w-auto bg-white p-10 rounded-xl border border-[#E1E1DF] text-[#424242] mb-5">
      <div className="flex mb-4">
        <h3 className="w-30">이미지</h3>
        {isEditing ? (
          <>
            {/* 편집 모드에서는 previewImage state를 사용 */}
            <img
              src={previewImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-1 border-[#E1E1DF]"
            />
            <div className="flex flex-col ml-6 self-end">
              <label className="cursor-pointer bg-gray-200 p-2 rounded-lg text-xs hover:bg-gray-300 w-fit">
                변경
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleImagePreview}
                />
              </label>
              <div className="mt-2 text-xs text-gray-500">
                <p>• png, jpg, jpeg의 확장자</p>
                <p>• 1MB 이하의 이미지</p>
              </div>
            </div>
          </>
        ) : (
          <img
            src={profile.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-1 border-[#E1E1DF]"
          />
        )}
      </div>
      <div className="flex mb-4">
        <h3 className="w-30">닉네임</h3>
        {isEditing ? (
          <div className="flex flex-col justify-start">
            <div className="flex items-center">
              <input
                type="text"
                name="nickname"
                value={nickname}
                onChange={handleNicknameInputChange}
                placeholder="닉네임을 입력해주세요."
                className="border p-2 rounded mr-3 focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
              />
              <button
                type="button"
                onClick={() => handleNicknameCheck(nickname, profile.nickname)}
                className="cursor-pointer bg-gray-200 p-2 rounded-lg text-xs hover:bg-gray-300 w-fit"
              >
                중복확인
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              • 최대 10글자, 공백 및 이모지 불가
            </p>
          </div>
        ) : (
          <p className="font-semibold">{profile.nickname}</p>
        )}
      </div>
      <div className="flex mb-4">
        <h3 className="w-30">관심분야</h3>
        {isEditing ? (
          <select
            name="hobby"
            value={profile.hobby || ""}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
          >
            <option value="">관심분야를 선택해주세요</option>
            <option value="FRONTEND">Frontend</option>
            <option value="BACKEND">Backend</option>
            <option value="DEVOPS">DevOps</option>
            <option value="DBSQL">DBSQL</option>
          </select>
        ) : (
          <p>{profile.hobby}</p>
        )}
      </div>
      <h3 className="w-30 mb-4">자기소개</h3>
      {isEditing ? (
        <>
          <textarea
            name="introduce"
            value={profile.introduce || ""}
            onChange={handleIntroduceInputChange}
            placeholder="자기소개를 입력해주세요."
            className="border p-2 rounded w-full focus:outline-none focus:ring-[#bc5b39] focus:border-[#bc5b39]"
            style={{ height: "100px", resize: "none" }}
          />
          <p className="text-xs text-gray-500 mt-1 mr-2 text-right">
            {profile.introduce?.length || 0} / {MAX_INTRODUCE_LENGTH}
          </p>
        </>
      ) : (
        <p className="break-all">{profile.introduce}</p>
      )}
    </div>
  );
};

ProfileCard.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  editedProfile: PropTypes.shape({
    profileImage: PropTypes.string,
    nickname: PropTypes.string,
    hobby: PropTypes.string,
    introduce: PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func,
  handleImageChange: PropTypes.func,
  handleNicknameCheck: PropTypes.func,
};

export default ProfileCard;
