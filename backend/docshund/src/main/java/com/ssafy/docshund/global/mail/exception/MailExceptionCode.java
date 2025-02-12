package com.ssafy.docshund.global.mail.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MailExceptionCode implements ExceptionCode {

	MAIL_NOT_SEND(BAD_REQUEST, "M-S-001", "메일을 보낼 수 없습니다."),
	IMAGE_NOT_DOWNLOAD(BAD_REQUEST, "M-S-002", "이미지를 다운로드 할 수 없습니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
