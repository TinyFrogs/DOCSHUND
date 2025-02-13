package com.ssafy.docshund.domain.users.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.docshund.domain.users.dto.page.UserAndInfoDto;
import com.ssafy.docshund.domain.users.dto.page.UserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserSearchCondition;
import com.ssafy.docshund.domain.users.dto.profile.ProfileRequestDto;
import com.ssafy.docshund.domain.users.entity.User;

public interface UserService {

	public Page<UserAndInfoDto> searchUsers(UserSearchCondition condition, Pageable pageable);

	public UserProfileDto getUserProfile(Long userId);

	public void modifyUserProfile(User user, ProfileRequestDto profileRequestDto, MultipartFile file);
}
