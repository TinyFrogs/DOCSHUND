package com.ssafy.docshund.domain.users.entity;

import java.util.Arrays;

public enum Hobby {
	Backend, Frontend;

	public static Hobby fromString(String hobby) {
		return Arrays.stream(Hobby.values())
			.filter(h -> h.name().equalsIgnoreCase(hobby))
			.findFirst()
			.orElseThrow(() -> new IllegalArgumentException("Invalid hobby: " + hobby));
	}
}
