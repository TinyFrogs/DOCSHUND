package com.ssafy.docshund.domain.supports.exception.notice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.ssafy.docshund.global.exception.ExceptionResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class NoticeExceptionHandler {

	@ExceptionHandler(NoticeException.class)
	public ResponseEntity noticeException(
		NoticeException exception
	) {
		log.error("{}", exception.getMessage());

		return new ResponseEntity<>(
			new ExceptionResponse(exception.getExceptionCode()),
			exception.getExceptionCode().getHttpStatus()
		);
	}
}
