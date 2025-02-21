package com.ssafy.docshund.domain.users.dto.auth;

import com.ssafy.docshund.domain.users.entity.Provider;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

	private Long userId;
	private Provider provider;
	private String personalId;
	private String email;
	private String nickname;
	private String role;

	public static UserDto createUserDto(OAuth2Response oAuth2Response, String username) {
		return UserDto.builder()
			.provider(oAuth2Response.getProvider())
			.personalId(oAuth2Response.getProviderId())
			.email(oAuth2Response.getEmail())
			.nickname(username)
			.role("ROLE_USER")
			.build();
	}

	public UserDto(Long userId, String personalId, String role) {
		this.userId = userId;
		this.personalId = personalId;
		this.role = role;
	}
}
