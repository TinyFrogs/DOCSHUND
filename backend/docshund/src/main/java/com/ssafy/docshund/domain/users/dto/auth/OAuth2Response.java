package com.ssafy.docshund.domain.users.dto.auth;

import com.ssafy.docshund.domain.users.entity.Provider;

public interface OAuth2Response {
	Provider getProvider();

	String getProviderId();

	String getEmail();

	String getName();
}
