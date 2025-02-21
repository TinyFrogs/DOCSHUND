package com.ssafy.docshund.domain.supports.exception.inquiry;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class InquiryException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public InquiryException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
