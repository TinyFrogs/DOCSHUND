package com.ssafy.docshund.domain.users.exception.user;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class UserException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public UserException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
