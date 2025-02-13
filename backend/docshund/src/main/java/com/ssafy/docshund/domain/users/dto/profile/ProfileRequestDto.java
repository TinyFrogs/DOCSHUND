package com.ssafy.docshund.domain.users.dto.profile;

import com.ssafy.docshund.domain.users.entity.Hobby;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileRequestDto {
	@Size(max = 20)
	private String nickname;

	private String introduce;
	private Boolean isDarkmode;
	private String hobby;

	public Hobby getHobbyEnum() {
		return hobby != null ? Hobby.fromString(hobby) : null;
	}
}
