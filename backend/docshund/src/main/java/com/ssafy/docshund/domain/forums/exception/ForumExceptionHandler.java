package com.ssafy.docshund.domain.forums.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ssafy.docshund.global.exception.ExceptionResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class ForumExceptionHandler {

    @ExceptionHandler(ForumException.class)
    public ResponseEntity handleForumException(
            ForumException exception
    ) {
        log.error("{}", exception.getMessage());

        return new ResponseEntity<>(
                new ExceptionResponse(exception.getExceptionCode()),
                exception.getExceptionCode().getHttpStatus()
        );
    }
}
