package com.ssafy.docshund.domain.alerts.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;

@Getter
public class AlertsException extends RuntimeException {

	private final ExceptionCode exceptionCode;

	public AlertsException(ExceptionCode exceptionCode) {
		super(exceptionCode.getMessage());
		this.exceptionCode = exceptionCode;
	}
}
