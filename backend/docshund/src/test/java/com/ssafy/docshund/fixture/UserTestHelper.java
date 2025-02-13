package com.ssafy.docshund.fixture;

import org.springframework.stereotype.Component;

import com.ssafy.docshund.domain.users.dto.auth.UserDto;
import com.ssafy.docshund.domain.users.dto.profile.ProfileRequestDto;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.entity.UserInfo;
import com.ssafy.docshund.domain.users.repository.UserInfoRepository;
import com.ssafy.docshund.domain.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserTestHelper {

	private final UserRepository userRepository;
	private final UserInfoRepository userInfoRepository;

	public User saveUser(String email, String personalId, String nickname, Provider provider,
		boolean isAdmin, String introduce, String hobby, boolean isDarkMode) {
		// 1. 사용자 생성
		UserDto userDto = new UserDto();
		userDto.setEmail(email);
		userDto.setPersonalId(personalId);
		userDto.setProvider(provider);
		userDto.setNickname(nickname);

		User user = User.createUser(userDto);
		if (isAdmin) {
			user.changeAdmin(); // 관리자 권한 부여
		}
		userRepository.save(user);

		// 2. 사용자 정보 생성
		UserInfo userInfo = UserInfo.createUserInfo(user);
		userInfo.modifyInfo(createProfile(introduce, hobby, isDarkMode)); // 프로필 정보 수정
		userInfoRepository.save(userInfo);

		return user;
	}

	// 프로필 요청 DTO 생성 메서드
	private ProfileRequestDto createProfile(String introduce, String hobby, boolean isDarkMode) {
		ProfileRequestDto profileRequestDto = new ProfileRequestDto();
		profileRequestDto.setIntroduce(introduce);
		profileRequestDto.setHobby(hobby);
		profileRequestDto.setIsDarkmode(isDarkMode);
		return profileRequestDto;
	}
}
