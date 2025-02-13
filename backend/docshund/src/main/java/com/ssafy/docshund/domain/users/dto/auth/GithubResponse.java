package com.ssafy.docshund.domain.users.dto.auth;

import java.util.Map;

import com.ssafy.docshund.domain.users.entity.Provider;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class GithubResponse implements OAuth2Response {

	private final Map<String, Object> attributes;

	@Override
	public Provider getProvider() {
		return Provider.GITHUB;
	}

	@Override
	public String getProviderId() {
		return attributes.get("id").toString();
	}

	@Override
	public String getEmail() {
		if (attributes.get("email") == null) {
			return attributes.get("login").toString().concat("@github.com");
		}
		return attributes.get("email").toString();
	}

	@Override
	public String getName() {
		return attributes.get("login").toString();
	}
}
