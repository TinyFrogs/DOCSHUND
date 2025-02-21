package com.ssafy.docshund.domain.docs.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum DocsExceptionCode implements ExceptionCode {
	
	USER_NOT_FOUND(NOT_FOUND, "D-C-001", "회원을 찾을 수 없습니다."),
	USER_NOT_AUTHORIZED(UNAUTHORIZED, "D-C-002", "로그인 상태가 아닙니다."),
	NO_PERMISSION(FORBIDDEN, "D-C-003", "관리자가 아닙니다."),
	NOT_YOUR_CONTENT(FORBIDDEN, "D-C-004", "본인의 번역만 수정/삭제할 수 있습니다."),
	DOCS_NOT_FOUND(NOT_FOUND, "D-C-005", "해당 문서를 찾을 수 없습니다."),
	ORIGIN_NOT_FOUND(NOT_FOUND, "D-C-006", "해당 문단을 찾을 수 없습니다."),
	TRANSLATION_NOT_FOUND(NOT_FOUND, "D-C-007", "해당 번역을 찾을 수 없습니다."),
	REQUIRED_IS_EMPTY(BAD_REQUEST, "D-C-008", "필수 요소는 비워둘 수 없습니다."),
	TOO_MANY_REQUEST(TOO_MANY_REQUESTS, "D-C-009", "요청이 너무 많습니다."),
	ILLEGAL_ARGUMENT(BAD_REQUEST, "D-C-010", "잘못된 인자거나 필수 인자가 누락되었습니다."),
	PYTHON_ERROR(INTERNAL_SERVER_ERROR, "D-C-011", "파이썬 서버와의 통신 중 오류가 발생했습니다."),
	ALREADY_EXIST_ORIGIN(BAD_REQUEST, "D-C-012", "문서에 이미 연결된 원본이 존재합니다."),
	INVALID_FILE_TYPE(BAD_REQUEST, "D-C-013", "지원하지 않는 파일 형식입니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
