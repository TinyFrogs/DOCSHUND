package com.ssafy.docshund.global.util.user;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.docshund.domain.users.dto.auth.CustomOAuth2User;
import com.ssafy.docshund.domain.users.entity.Role;
import com.ssafy.docshund.domain.users.entity.Status;
import com.ssafy.docshund.domain.users.entity.User;
import com.ssafy.docshund.domain.users.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserUtil {

	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public User getUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getPrincipal() == "anonymousUser") {
			log.warn("SecurityContext에 Authentication이 없습니다. 사용자가 로그인하지 않았을 가능성이 큽니다.");
			return null;
		}

		Object principal = authentication.getPrincipal();

		if (!(principal instanceof CustomOAuth2User)) {
			log.error("Principal이 CustomOAuth2User 타입이 아닙니다. 현재 타입: {}", principal.getClass().getName());
			return null;
		}

		CustomOAuth2User customUser = (CustomOAuth2User)principal;
		String personalId = customUser.getPersonalId();
		log.info("Personal ID: {}", personalId);

		User user = userRepository.findByPersonalId(personalId)
			.orElseGet(null);

		log.info("email: {}", user.getEmail());

		return user;
	}

	@Transactional(readOnly = true)
	public boolean isActiveUser(User user) {
		if (user == null || user.getStatus() == Status.ACTIVE) {
			return true;
		}

		log.error("User is not active");
		return false;
	}

	@Transactional(readOnly = true)
	public boolean isAdmin(User user) {
		if (user == null || user.getRole() != Role.ROLE_ADMIN) {
			log.info("is Not Admin");
			return false;
		}

		log.info("is Admin");
		return true;
	}

	@Transactional(readOnly = true)
	public boolean isMine(Long userId, User user) {
		if (user == null || !user.getUserId().equals(userId)) {
			log.info("is Not Mine");
			return false;
		}

		log.info("is Mine");
		return true;
	}

	@Transactional(readOnly = true)
	public Long getUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Object principal = authentication.getPrincipal();
		CustomOAuth2User customUser = (CustomOAuth2User)principal;
		String personalId = customUser.getPersonalId();
		return userRepository.findUserIdByPersonalId(personalId)
			.orElse(null);
	}

}
