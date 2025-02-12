package com.ssafy.docshund.domain.users.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;

@Getter
public class MemoException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public MemoException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
