package com.ssafy.docshund.domain.alerts.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
@RequiredArgsConstructor
public enum AlertsExceptionCode implements ExceptionCode {
	
	USER_NOT_FOUND(NOT_FOUND, "AL-C-001", "회원을 찾을 수 없습니다."),
	USER_NOT_AUTHORIZED(UNAUTHORIZED, "AL-C-002", "로그인 상태가 아닙니다."),
	NO_PERMISSION(FORBIDDEN, "AL-C-003", "관리자가 아닙니다."),
	NOT_YOUR_ALERT(FORBIDDEN, "AL-C-004", "본인의 알림만 읽거나 삭제할 수 있습니다."),
	ALERT_NOT_FOUND(NOT_FOUND, "AL-C-005", "알림을 찾을 수 없습니다."),
	REQUIRED_IS_EMPTY(BAD_REQUEST, "AL-C-006", "필수 입력값이 누락되었습니다."),
	TOO_MANY_REQUEST(TOO_MANY_REQUESTS, "AL-C-007", "요청이 너무 많습니다."),
	ILLEGAL_ARGUMENT(BAD_REQUEST, "AL-C-008", "잘못된 인자거나 필수 인자가 누락되었습니다."),
	ALREADY_REQUESTED(CONFLICT, "AL-C-009", "이미 처리된 작업입니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
