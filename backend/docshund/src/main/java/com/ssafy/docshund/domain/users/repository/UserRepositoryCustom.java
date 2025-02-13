package com.ssafy.docshund.domain.users.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ssafy.docshund.domain.users.dto.page.UserAndInfoDto;
import com.ssafy.docshund.domain.users.dto.page.UserProfileDto;
import com.ssafy.docshund.domain.users.dto.page.UserSearchCondition;

public interface UserRepositoryCustom {
	Page<UserAndInfoDto> searchUsers(UserSearchCondition condition, Pageable pageable);

	UserProfileDto getProfileUser(Long userId);
}
