package com.ssafy.docshund.global.mail.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class MailException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public MailException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
