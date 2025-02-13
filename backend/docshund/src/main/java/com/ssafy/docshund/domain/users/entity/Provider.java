package com.ssafy.docshund.domain.users.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Provider {
	GOOGLE("google"), GITHUB("github");

	private final String loginProvider;

}
