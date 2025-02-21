package com.ssafy.docshund.domain.users.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum MemoExceptionCode implements ExceptionCode {

	USER_NOT_FOUND(NOT_FOUND, "MM-C-001", "회원을 찾을 수 없습니다."),
	USER_NOT_AUTHORIZED(UNAUTHORIZED, "MM-C-002", "로그인 상태가 아닙니다."),
	NO_PERMISSION(FORBIDDEN, "MM-C-003", "관리자가 아닙니다."),
	NOT_YOUR_MEMO(FORBIDDEN, "MM-C-004", "본인의 메모만 수정/삭제할 수 있습니다."),
	MEMO_NOT_FOUND(NOT_FOUND, "MM-C-005", "메모를 찾을 수 없습니다."),
	REQUIRED_IS_EMPTY(BAD_REQUEST, "MM-C-006", "필수 요소는 비워둘 수 없습니다."),
	TOO_MANY_REQUEST(TOO_MANY_REQUESTS, "MM-C-007", "요청이 너무 많습니다."),
	ILLEGAL_ARGUMENT(BAD_REQUEST, "MM-C-008", "잘못된 인자거나 필수 인자가 누락되었습니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
