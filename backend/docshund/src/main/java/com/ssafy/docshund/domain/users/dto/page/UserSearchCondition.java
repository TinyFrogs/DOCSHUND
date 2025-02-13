package com.ssafy.docshund.domain.users.dto.page;

import com.ssafy.docshund.domain.users.entity.Hobby;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchCondition {

	private String nickname;
	private String email;
	private Hobby category;
}
