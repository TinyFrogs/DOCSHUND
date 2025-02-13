package com.ssafy.docshund.domain.users.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ssafy.docshund.domain.users.service.UserAuthServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/api/v1/docshund/users")
public class UserAuthController {

	private final UserAuthServiceImpl userAuthServiceImpl;

	@GetMapping("/leaving")
	public ResponseEntity<String> logout() {
		userAuthServiceImpl.deleteUser();

		return ResponseEntity.ok().body("탈퇴 요청이 완료되었습니다.");
	}
}
