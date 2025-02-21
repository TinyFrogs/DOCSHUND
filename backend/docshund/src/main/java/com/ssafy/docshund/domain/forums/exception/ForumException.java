package com.ssafy.docshund.domain.forums.exception;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;

@Getter
public class ForumException extends RuntimeException {

    private final ExceptionCode exceptionCode;

    public ForumException(ExceptionCode exceptionCode) {
        super(exceptionCode.getMessage());
        this.exceptionCode = exceptionCode;
    }
}
