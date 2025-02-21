package com.ssafy.docshund.domain.chats.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum WebSocketExceptionCode implements ExceptionCode {

    INVALID_PRINCIPAL(FORBIDDEN, "C-C-001", "채팅을 사용할 권한이 없습니다."),
    CHAT_NOT_FOUND(NOT_FOUND, "C-S-001", "채팅을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
