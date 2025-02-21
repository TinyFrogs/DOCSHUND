package com.ssafy.docshund.domain.chats.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class WebSocketException extends RuntimeException {

    private final ExceptionCode exceptionCode;

    public WebSocketException(ExceptionCode exceptionCode) {
        super(exceptionCode.getMessage());
        this.exceptionCode = exceptionCode;
    }
}
