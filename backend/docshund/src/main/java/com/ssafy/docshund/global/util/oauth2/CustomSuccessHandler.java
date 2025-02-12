package com.ssafy.docshund.global.util.oauth2;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ssafy.docshund.domain.alerts.service.AlertsService;
import com.ssafy.docshund.domain.users.dto.auth.CustomOAuth2User;
import com.ssafy.docshund.global.util.jwt.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtUtil jwtUtil;
	private static final long TOKEN_EXPIRATION = 60L * 60L * 24L * 30L;

	private final AlertsService alertsService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {

		CustomOAuth2User userDetails = (CustomOAuth2User)authentication.getPrincipal();

		String personalId = userDetails.getPersonalId();
		Long userId = userDetails.getUserId();
		log.info("받아온 userId: {}", userId);

		String role = authentication.getAuthorities().stream()
			.findFirst()
			.map(GrantedAuthority::getAuthority)
			.orElse("ROLE_USER");

		String token = jwtUtil.createJwt(userId, personalId, role, TOKEN_EXPIRATION);
		log.info("Token: " + token);

		//프론트엔드 URL로 리디렉트하면서 토큰을 전달
		String redirectUrl = "http://localhost:5173?token=" + token;
		response.sendRedirect(redirectUrl);
	}

}
