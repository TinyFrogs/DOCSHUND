package com.ssafy.docshund.domain.users.dto.page;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.docshund.domain.users.entity.Hobby;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserProfileDto {

	private Long userId;
	private String email;
	private String profileImage;
	private String nickname;
	private LocalDateTime lastLogin;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private Hobby hobby;
	private String introduce;
	private Boolean isDarkmode;

	@QueryProjection
	public UserProfileDto(Long userId, String email, String profileImage, String nickname,
		LocalDateTime lastLogin, LocalDateTime createdAt, LocalDateTime updatedAt,
		Hobby hobby, String introduce, boolean isDarkmode) {
		this.userId = userId;
		this.email = email;
		this.profileImage = profileImage;
		this.nickname = nickname;
		this.lastLogin = lastLogin;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.isDarkmode = isDarkmode;
		this.hobby = hobby;
		this.introduce = introduce;
	}

}
