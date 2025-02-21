package com.ssafy.docshund.domain.forums.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import org.springframework.http.HttpStatus;

import com.ssafy.docshund.global.exception.ExceptionCode;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ForumExceptionCode implements ExceptionCode {

	INVALID_CATEGORY(BAD_REQUEST, "F-C-001", "존재하지 않는 카테고리입니다."),
	MISMATCH_ARTICLE(BAD_REQUEST, "F-C-002", "댓글과 게시글의 정보가 일치하지 않습니다."),
	NOT_FOUND_COMMENT(NOT_FOUND, "F-C-003", "해당 댓글을 찾을 수 없습니다."),
	NOT_FOUND_ARTICLE(NOT_FOUND, "F-C-004", "해당 게시글을 찾을 수 없습니다.");

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
