package com.ssafy.docshund.domain.supports.exception.inquiry;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InquiryExceptionCode implements ExceptionCode {

	INQUIRY_NOT_FOUND(NOT_FOUND, "I-S-001", "문의를 찾을 수 없습니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
