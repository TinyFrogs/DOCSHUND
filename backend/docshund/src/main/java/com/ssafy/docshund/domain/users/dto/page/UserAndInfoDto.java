package com.ssafy.docshund.domain.users.dto.page;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.docshund.domain.users.entity.Hobby;
import com.ssafy.docshund.domain.users.entity.Provider;
import com.ssafy.docshund.domain.users.entity.Role;
import com.ssafy.docshund.domain.users.entity.Status;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserAndInfoDto {

	private Long userId;
	private String email;
	private String profileImage;
	private String nickname;
	private Role role;
	private Provider provider;
	private String personalId;
	private Status status;
	private LocalDateTime lastLogin;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	private Long userInfoId;
	private boolean isDarkmode;
	private Hobby hobby;
	private String introduce;
	private int reportCount;

	@QueryProjection
	public UserAndInfoDto(Long userId, String email, String profileImage, String nickname,
		Role role, Provider provider, String personalId, Status status,
		LocalDateTime lastLogin, LocalDateTime createdAt, LocalDateTime updatedAt,
		Long userInfoId, boolean isDarkmode, Hobby hobby, String introduce,
		int reportCount) {
		this.userId = userId;
		this.email = email;
		this.profileImage = profileImage;
		this.nickname = nickname;
		this.role = role;
		this.provider = provider;
		this.personalId = personalId;
		this.status = status;
		this.lastLogin = lastLogin;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.userInfoId = userInfoId;
		this.isDarkmode = isDarkmode;
		this.hobby = hobby;
		this.introduce = introduce;
		this.reportCount = reportCount;
	}
}
