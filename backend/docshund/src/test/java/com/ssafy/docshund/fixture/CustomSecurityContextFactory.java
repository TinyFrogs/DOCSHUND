package com.ssafy.docshund.fixture;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import com.ssafy.docshund.domain.users.dto.auth.CustomOAuth2User;
import com.ssafy.docshund.domain.users.dto.auth.UserDto;
import com.ssafy.docshund.domain.users.entity.Provider;

public class CustomSecurityContextFactory implements WithSecurityContextFactory<WithMockCustomOAuth2User> {

	@Override
	public SecurityContext createSecurityContext(WithMockCustomOAuth2User annotation) {
		SecurityContext context = SecurityContextHolder.createEmptyContext();

		// CustomOAuth2User 생성
		CustomOAuth2User user = new CustomOAuth2User(
			new UserDto(100000L, Provider.GOOGLE, annotation.personalId(), annotation.email(), annotation.nickname(),
				"ROLE_ADMIN")
		);

		Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		context.setAuthentication(auth);

		return context;
	}
}
