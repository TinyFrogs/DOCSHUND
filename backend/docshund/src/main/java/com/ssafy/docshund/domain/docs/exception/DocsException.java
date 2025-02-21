package com.ssafy.docshund.domain.docs.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;

@Getter
public class DocsException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public DocsException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
