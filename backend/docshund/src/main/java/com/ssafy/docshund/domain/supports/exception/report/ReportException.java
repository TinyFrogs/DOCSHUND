package com.ssafy.docshund.domain.supports.exception.report;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class ReportException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public ReportException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
