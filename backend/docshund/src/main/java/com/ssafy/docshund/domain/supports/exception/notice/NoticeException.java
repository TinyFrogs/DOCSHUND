package com.ssafy.docshund.domain.supports.exception.notice;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class NoticeException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public NoticeException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
