package com.ssafy.docshund.domain.users.exception.auth;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class AuthException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public AuthException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
