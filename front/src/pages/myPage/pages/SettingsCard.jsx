import PropTypes from "prop-types";

const SettingsCard = (props) => {
  const { isEditing, editedProfile, handleThemeChange } = props;
  return (
    <div className="w-auto bg-white p-10 rounded-xl border-1 border-[#E1E1DF] text-[#424242]">
      <div className="flex mb-4">
        <h3 className="w-30 font-bold">이메일 |</h3>
        <p className="font-semibold">{editedProfile.email}</p>
      </div>
      <div className="flex mb-4">
        <h3 className="w-30 font-bold">모드설정 |</h3>
        <label className="mr-5">
          <input
            type="radio"
            className="mr-2 cursor-pointer"
            name="theme"
            value="light"
            checked={!editedProfile.isDarkmode}
            onChange={handleThemeChange}
            disabled={!isEditing}
          />
          라이트 모드
        </label>
        <label>
          <input
            type="radio"
            className="mr-2 cursor-pointer"
            name="theme"
            value="dark"
            checked={editedProfile.isDarkmode}
            onChange={handleThemeChange}
            disabled={!isEditing}
          />
          다크 모드
        </label>
      </div>
    </div>
  );
};

SettingsCard.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  editedProfile: PropTypes.shape({
    email: PropTypes.string.isRequired,
    isDarkmode: PropTypes.bool.isRequired,
  }).isRequired,
  handleThemeChange: PropTypes.func.isRequired,
};

export default SettingsCard;
