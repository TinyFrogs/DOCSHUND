package com.ssafy.docshund.domain.supports.exception.report;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReportExceptionCode implements ExceptionCode {

	REPORT_NOT_FOUND(NOT_FOUND, "R-S-001", "신고를 찾을 수 없습니다."),
	ALREADY_REPORTED_REPORT(BAD_REQUEST, "R-S-002", "이미 신고한 상태입니다."),
	REPORT_IS_MINE(BAD_REQUEST, "R-S-003", "자기 자신을 신고할 수 없습니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
