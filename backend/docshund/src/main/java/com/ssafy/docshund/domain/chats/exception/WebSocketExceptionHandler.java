package com.ssafy.docshund.domain.chats.exception;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.web.bind.annotation.ControllerAdvice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class WebSocketExceptionHandler {

    @MessageExceptionHandler(WebSocketException.class)
    @SendToUser("/queue/errors")
    public ErrorMessage handleWebSocketException(
            WebSocketException exception
    ) {
        log.error("{}", exception.getMessage());
        return new ErrorMessage("WEBSOCKET_ERROR", exception.getMessage());
    }

    @Getter
    @AllArgsConstructor
    public static class ErrorMessage {
        private String errorType;
        private String message;
    }
}
