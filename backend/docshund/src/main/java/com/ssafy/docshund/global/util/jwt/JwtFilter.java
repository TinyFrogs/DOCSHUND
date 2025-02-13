package com.ssafy.docshund.global.util.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.docshund.domain.users.dto.auth.CustomOAuth2User;
import com.ssafy.docshund.domain.users.dto.auth.UserDto;
import com.ssafy.docshund.domain.users.entity.Status;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private final UserRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		String authorizationHeader = request.getHeader("Authorization");

		log.info("Authorization Header: " + authorizationHeader);
		if (jwtUtil.isValidAuthorization(authorizationHeader)) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authorizationHeader.substring(7);

		if (jwtUtil.isExpired(token)) {
			log.info("Token expired");
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			filterChain.doFilter(request, response);
			return;
		}

		String personalId = jwtUtil.getPersonalId(token);
		String role = jwtUtil.getRole(token);

		if (checkUser(personalId)) {
			filterChain.doFilter(request, response);
			return;
		}

		UserDto userDto = new UserDto();
		userDto.setPersonalId(personalId);
		userDto.setRole(role);

		CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDto);

		Authentication authToken = new UsernamePasswordAuthenticationToken(
			customOAuth2User, null, customOAuth2User.getAuthorities()
		);

		SecurityContextHolder.getContext().setAuthentication(authToken);

		filterChain.doFilter(request, response);
	}

	private boolean checkUser(String personalId) {
		User user = userRepository.findByPersonalId(personalId)
			.orElse(null);

		if (user == null) {
			log.info("User is not found. UserId = {}", user.getPersonalId());
			return true;
		}

		if (user.getStatus() == Status.BANNED) {
			log.info("User is banned. UserId = {}", user.getPersonalId());
			return true;
		}

		if (user.getStatus() == Status.WITHDRAWN) {
			log.info("User is withdrawn. UserId = {}", user.getPersonalId());
			return true;
		}

		return false;
	}
}
